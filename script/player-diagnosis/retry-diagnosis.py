"""失敗した選手の念系統診断を再実行するスクリプト"""

import json
import os
import sys
from pathlib import Path
from typing import List, Dict, Any
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

# 環境変数を読み込み（apiディレクトリの.envを参照）
script_dir = Path(__file__).resolve().parent.parent.parent
env_path = script_dir / "api" / ".env"
load_dotenv(env_path)


class PlayerDiagnosisResult(BaseModel):
    """選手診断結果"""
    primary: str = Field(
        description="最も適性のある念能力系統（強化系、変化系、具現化系、特質系、操作系、放出系のいずれか）"
    )
    specialist_score: int = Field(
        description="特質系の適性スコア（0-100）", ge=0, le=100
    )
    reason: str = Field(description="診断理由と性格分析のコメント")


def get_player_diagnosis_prompt() -> ChatPromptTemplate:
    """選手診断用プロンプト"""
    
    system_message = """あなたはサッカーと心理学の専門家です。

念能力の6系統について:

1. **強化系**: モノの持つ働きや力を強くする
   - 特徴: 体力がある、力が強い、回復力が高い、基礎を大事にする
   - サッカー例: フィジカルの強さ、持久力、基本技術の反復練習
   - **対応ポジション: GK（ゴールキーパー）**
   - 理由: ゴールを守る最後の砦。フィジカル、反射神経、基礎技術の反復が重要

2. **放出系**: オーラを飛ばす
   - 特徴: パス・シュートがうまい、遠くに飛ばす能力
   - サッカー例: ロングパス、ミドルシュート、正確なクロス
   - **対応ポジション: FW（フォワード）**
   - 理由: ゴールを決める＝シュートを放つ。得点という結果を「放出」する

3. **変化系**: オーラの性質を変える
   - 特徴: 相手を惑わすトリックプレーがうまい
   - サッカー例: フェイント、ドリブルテクニック、予測不能な動き
   - **対応ポジション: MF（攻撃的ミッドフィールダー）**
   - 理由: 状況に応じてプレーを「変化」させ、相手を惑わす

4. **操作系**: 物質や生物を操る
   - 特徴: ツール・アイテムにこだわりがある、戦略を立てて人を動かす
   - サッカー例: スパイク、ボール、用具へのこだわり、戦術理解
   - **対応ポジション: DF（ディフェンダー）**
   - 理由: 守備の組織化、チーム全体を「操作」してゴールを守る

5. **具現化系**: 何かを具現化する
   - 特徴: 想像力、創造性が豊か
   - サッカー例: 独創的なプレー、新しい戦術の発案、芸術的なゴール
   - **対応ポジション: MF（中盤・ゲームメイカー）**
   - 理由: アイデアを「具現化」し、攻守の切り替えやチャンスを創造

6. **特質系**: 他に類のない特殊なオーラ
   - 特徴: 以上に挙げた5種にはない特殊な能力・雰囲気を持ち合わせている
   - サッカー例: カリスマ性、天性の勘、異次元のプレー
   - **対応ポジション: COACH/STAFF（コーチ・スタッフ）**
   - 理由: チームを導く特別な存在。指導者としての独自の哲学とカリスマ

---

## 診断ルール

選手のプロフィール情報から以下の2つを判定してください：

1. **primary（主系統）**: 最も適性のある系統を1つ選択
2. **specialist_score（特質系スコア）**: 特質系の適性を0-100で評価（primaryに関係なく必ず評価）

### 重要: ポジションとの整合性

診断結果は、選手の実際のポジション（{position}）と整合性を持たせてください：
- GK → 強化系の特徴を強調
- FW → 放出系の特徴を強調
- MF → 変化系または具現化系の特徴を強調（プレースタイルによる）
- DF → 操作系の特徴を強調
- COACH/STAFF → 特質系の特徴を強調

### 診断コメント作成ガイドライン

- 選手のプロフィール情報から読み取れる具体的な性格傾向を説明
- **ポジション（{position}）に対応する念系統の特徴との関連性を必ず含める**
- そのポジションで活躍するために必要な念能力の特性を説明
- 肯定的かつ具体的なフィードバック
- 200-300文字程度"""

    user_message = """選手情報:
{player_info}"""

    return ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("user", user_message)
    ])


def calculate_affinities(primary: str, specialist_score: int) -> List[int]:
    """primaryを基準に親和性スコアを計算"""
    types = ["強化系", "変化系", "具現化系", "特質系", "操作系", "放出系"]
    
    if primary not in types:
        raise ValueError(f"Invalid primary type: {primary}")
    
    primary_index = types.index(primary)
    scores = [0] * 6
    
    for i in range(6):
        if i == 3:  # 特質系
            scores[i] = specialist_score
            continue
        
        distance = min(
            abs(i - primary_index),
            6 - abs(i - primary_index)
        )
        
        if distance == 0:
            scores[i] = 100
        elif distance == 1:
            scores[i] = 80
        elif distance == 2:
            scores[i] = 60
        else:  # distance == 3
            scores[i] = 40
    
    return scores


def format_player_info(player: Dict[str, Any]) -> str:
    """選手情報をテキスト形式に整形"""
    # look_at_my_play を安全に処理
    look_at_play = player.get('look_at_my_play', [])
    if isinstance(look_at_play, list):
        look_at_play_str = ', '.join(look_at_play)
    else:
        look_at_play_str = str(look_at_play) if look_at_play else '不明'
    
    info = f"""
選手名: {player.get('name', '不明')}
背番号: {player.get('id', '不明')}
ポジション: {player.get('position', '不明')}
生年月日: {player.get('birth', '不明')}
身長/体重: {player.get('height', '?')}cm / {player.get('weight', '?')}kg
出身地: {player.get('from', '不明')}
ニックネーム: {player.get('nickname', '不明')}
サッカーとは: {player.get('what_is_soccer', '不明')}
背番号へのこだわり: {player.get('jersey_number_commitment', '不明')}
試合前のルーティン: {player.get('pregame_ritual', '不明')}
注目してほしいプレー: {look_at_play_str}
憧れの選手: {player.get('hero', '不明')}
性格を一言で: {player.get('personality_one_word', '不明')}
チャームポイント: {player.get('charm_point', '不明')}
チーム内で一番: {player.get('best_in_team_non_soccer', '不明')}
座右の銘: {player.get('motto', '不明')}
ファンへのメッセージ: {player.get('message_to_fans', '不明')}
"""
    
    # 選手説明文を追加
    if 'description' in player and player['description']:
        desc = player['description']
        if isinstance(desc, dict):
            if 'title' in desc:
                info += f"\n特徴（{desc.get('title', '')}）: {desc.get('text', '')}"
            elif 'text' in desc:
                info += f"\n特徴: {desc.get('text', '')}"
    
    if 'best_game' in player and player['best_game']:
        info += f"\nベストゲーム: {player['best_game'].get('title', '不明')}"
        info += f"\n理由: {player['best_game'].get('reason', '不明')}"
    
    return info.strip()


def diagnose_player(player: Dict[str, Any], llm) -> Dict[str, Any]:
    """選手を診断"""
    player_info = format_player_info(player)
    position = player.get('position', '不明')
    
    prompt = get_player_diagnosis_prompt()
    structured_llm = llm.with_structured_output(PlayerDiagnosisResult)
    chain = prompt | structured_llm
    
    print(f"診断中: {player.get('name', '不明')} (ID: {player.get('id', '?')}, {position})")
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            result: PlayerDiagnosisResult = chain.invoke({
                "player_info": player_info,
                "position": position
            })
            
            if result is None:
                if attempt < max_retries - 1:
                    print(f"  警告: LLMが応答を返しませんでした（試行 {attempt + 1}/{max_retries}）. リトライします...")
                    continue
                else:
                    raise Exception("LLMが構造化出力の生成に失敗しました")
            
            scores = calculate_affinities(result.primary, result.specialist_score)
            
            return {
                "id": player.get("id"),
                "name": player.get("name"),
                "position": player.get("position"),
                "primary": result.primary,
                "specialist_score": result.specialist_score,
                "scores": scores,
                "comment": result.reason
            }
            
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"  エラー（試行 {attempt + 1}/{max_retries}）: {e}. リトライします...")
                continue
            else:
                print(f"  エラー: 診断に失敗しました - {e}")
                raise


def main():
    """メイン処理"""
    # Google API キーの確認
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("エラー: GOOGLE_API_KEY が設定されていません")
        sys.exit(1)
    
    # ファイルパス
    script_dir = Path(__file__).parent.parent
    players_file = script_dir / "players.json"
    output_file = Path(__file__).parent / "players-diagnosis.json"
    
    # players.json を読み込み
    print(f"選手データを読み込み: {players_file}")
    with open(players_file, "r", encoding="utf-8") as f:
        all_players = json.load(f)
    
    # 既存の診断結果を読み込み
    existing_results = {}
    if output_file.exists():
        print(f"既存の診断結果を読み込み: {output_file}")
        with open(output_file, "r", encoding="utf-8") as f:
            existing_data = json.load(f)
            for result in existing_data:
                existing_results[result["id"]] = result
        print(f"既存の診断数: {len(existing_results)}人")
    
    # 未診断の選手をフィルタリング
    players_to_diagnose = [
        player for player in all_players
        if player.get("id") not in existing_results
    ]
    
    print(f"総選手数: {len(all_players)}人")
    print(f"未診断の選手数: {len(players_to_diagnose)}人")
    
    if not players_to_diagnose:
        print("\n全選手の診断が完了しています！")
        return
    
    # LLM の初期化
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        api_key=api_key,
        temperature=0.7,
    )
    
    # 未診断の選手を診断
    new_results = []
    for i, player in enumerate(players_to_diagnose, 1):
        print(f"\n[{i}/{len(players_to_diagnose)}]", end=" ")
        try:
            diagnosis = diagnose_player(player, llm)
            new_results.append(diagnosis)
            print(f"  → {diagnosis['primary']} (特質系: {diagnosis['specialist_score']})")
        except Exception as e:
            print(f"  スキップ: {e}")
            continue
    
    # 既存の結果と新しい結果をマージ
    all_results = list(existing_results.values()) + new_results
    
    # IDでソート
    all_results.sort(key=lambda x: x["id"])
    
    # 結果を保存
    print(f"\n診断結果を保存: {output_file}")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    
    print(f"\n完了!")
    print(f"  既存: {len(existing_results)}人")
    print(f"  新規: {len(new_results)}人")
    print(f"  合計: {len(all_results)}人")


if __name__ == "__main__":
    main()
