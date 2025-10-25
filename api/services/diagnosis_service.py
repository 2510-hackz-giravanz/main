"""診断サービス - ユーザーの回答を分析して性格診断を行う"""

import os
from typing import List
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from prompts.diagnosis import get_diagnosis_prompt
from models.diagnosis import DiagnosisResponse, QuestionAnswer, PrimaryDiagnosisResult

# 環境変数を読み込み
load_dotenv()


def calculate_affinities(primary: str, specialist_score: int) -> List[int]:
    """
    primaryを基準に親和性スコアを計算
    
    Args:
        primary: 主系統の名前
        specialist_score: 特質系のスコア（0-100）
    
    Returns:
        List[int]: 6つの系統のスコア配列
        
    Raises:
        ValueError: primaryが無効な系統名の場合
    """
    types = ["強化系", "変化系", "具現化系", "特質系", "操作系", "放出系"]
    
    if primary not in types:
        raise ValueError(f"Invalid primary type: {primary}")
    
    primary_index = types.index(primary)
    scores = [0] * 6
    
    # 円状配列での距離を計算
    for i in range(6):
        # 特質系(index=3)は常にLLMの値を使用
        if i == 3:
            scores[i] = specialist_score
            continue
        
        # 円状配列での最短距離を計算
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


def diagnose_personality(question_answers: List[QuestionAnswer]) -> DiagnosisResponse:
    """
    ユーザーの回答を分析して念能力の6系統を診断する

    Args:
        question_answers: 質問と回答のペアのリスト

    Returns:
        DiagnosisResponse: 6系統のスコアと診断コメント

    Raises:
        ValueError: Google API キーが設定されていない場合
        Exception: 診断処理に失敗した場合
    """
    # Google API キーの確認
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY が設定されていません。.env ファイルを確認してください。"
        )

    # LLM の初期化
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        api_key=api_key,
        temperature=0.7,  # 診断にある程度の多様性を持たせる
    )

    # プロンプトの取得と構造化出力の設定
    prompt = get_diagnosis_prompt()
    structured_llm = llm.with_structured_output(PrimaryDiagnosisResult)

    # チェーンの構築
    chain = prompt | structured_llm

    # 質問と回答データを整形
    qa_text = ""
    for i, qa in enumerate(question_answers, 1):
        qa_text += f"\n質問{i}: {qa.question.question_text}\n"
        qa_text += f"選択肢: {qa.question.choices}\n"
        selected_choice = qa.question.choices[qa.selected_choice_index]
        qa_text += f"→ ユーザーの選択: {qa.selected_choice_index} ({selected_choice})\n"

    # 診断実行（リトライ機能付き）
    max_retries = 3
    last_error = None
    
    for attempt in range(max_retries):
        try:
            result: PrimaryDiagnosisResult = chain.invoke({"question_answers": qa_text})
            
            # Noneが返ってきた場合はリトライ
            if result is None:
                last_error = Exception(f"LLMが構造化出力の生成に失敗しました（試行 {attempt + 1}/{max_retries}）")
                if attempt < max_retries - 1:
                    print(f"警告: {last_error}. リトライします...")
                    continue
                else:
                    raise last_error
            
            # primaryとspecialist_scoreからスコアを計算
            scores = calculate_affinities(result.primary, result.specialist_score)
            
            # DiagnosisResponseを構築して返す
            return DiagnosisResponse(
                scores=scores,
                comment=result.reason
            )
            
        except Exception as e:
            last_error = e
            if attempt < max_retries - 1:
                print(f"エラーが発生しました（試行 {attempt + 1}/{max_retries}）: {e}. リトライします...")
                continue
            else:
                raise Exception(f"診断処理に失敗しました（{max_retries}回試行）: {str(e)}") from e
    
    # ここには到達しないはずだが、念のため
    raise Exception(f"診断処理に失敗しました: {last_error}")
