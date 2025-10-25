"""診断APIのテストスクリプト

実行方法:
    cd api
    .venv/bin/python test/test_diagnosis.py
"""

import json
import sys
import os

# 親ディレクトリ（api）をPythonパスに追加
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.diagnosis_service import diagnose_personality
from models.diagnosis import QuestionAnswer
from models.question import Question


def create_sample_questions():
    """サンプルの質問セットを作成（念系統を意識した質問）"""
    questions = [
        Question(
            question_text="試合で劣勢の時、どう行動する？",
            choices=[
                "諦めずに走り続ける",  # 強化系: 愚直な努力
                "チームメイトを鼓舞する",  # 放出系: 影響を外に
                "トリッキーなプレーで突破を図る",  # 変化系: 予測不能
                "戦術を変える提案をする",  # 操作系: 戦略的思考
            ],
        ),
        Question(
            question_text="新しい技術を習得する時、どうする？",
            choices=[
                "何度も基礎から繰り返し練習する",  # 強化系: 基礎重視
                "実戦で試しながら覚える",  # 放出系: 実践的
                "自分なりにアレンジして身につける",  # 変化系: 柔軟性
                "完璧なフォームをイメージしてから練習する",  # 具現化系: イメージ重視
            ],
        ),
        Question(
            question_text="チームメイトとの関わり方は？",
            choices=[
                "一緒に汗を流して信頼を築く",  # 強化系: 努力で信頼
                "積極的に声をかけて盛り上げる",  # 放出系: 外向的
                "その場の雰囲気に合わせて柔軟に対応",  # 変化系: 適応力
                "役割分担を明確にして協力する",  # 操作系: 組織化
            ],
        ),
        Question(
            question_text="サッカーの魅力は何だと思う？",
            choices=[
                "努力が結果につながること",  # 強化系: 努力主義
                "チーム全体で勝利を目指すこと",  # 放出系: チーム重視
                "自由な発想でプレーできること",  # 変化系: 創造性
                "美しいプレーが生まれる瞬間",  # 具現化系: 芸術性
            ],
        ),
        Question(
            question_text="用具（スパイク・ウェアなど）の選び方は？",
            choices=[
                "機能性と耐久性を重視",  # 強化系: 実用性
                "パフォーマンスが向上するものを選ぶ",  # 放出系: 効果重視
                "デザインや個性を重視",  # 変化系: 個性
                "細部までこだわって最適なものを選ぶ",  # 操作系: こだわり
            ],
        ),
        Question(
            question_text="試合前のルーティンは？",
            choices=[
                "入念なウォーミングアップで体を温める",  # 強化系: 準備徹底
                "仲間と声を出して気持ちを高める",  # 放出系: 士気向上
                "音楽を聴いたり、リラックスして臨む",  # 変化系: 柔軟な準備
                "理想のプレーを細かくイメージする",  # 具現化系: イメージング
            ],
        ),
        Question(
            question_text="ミスをした後の気持ちの切り替え方は？",
            choices=[
                "次のプレーで取り返すと決意する",  # 強化系: 前向きな努力
                "声を出して気持ちを切り替える",  # 放出系: 外に発散
                "気にせず次は違うアプローチを試す",  # 変化系: 柔軟な対応
                "なぜミスしたか冷静に分析する",  # 操作系: 論理的分析
            ],
        ),
        Question(
            question_text="憧れるプレースタイルは？",
            choices=[
                "最後まで走り続ける献身的なプレー",  # 強化系: 持久力
                "正確なパスでチャンスを作るプレー",  # 放出系: パス能力
                "相手の裏をかく華麗なドリブル",  # 変化系: トリッキー
                "芸術的で創造性あふれるプレー",  # 具現化系: 芸術性
            ],
        ),
        Question(
            question_text="サッカーを通じて得た最も大切なものは？",
            choices=[
                "努力し続ける力",  # 強化系: 努力
                "仲間と協力する喜び",  # 放出系: 協調性
                "柔軟に対応する力",  # 変化系: 適応力
                "戦略的に考える力",  # 操作系: 戦略思考
            ],
        ),
        Question(
            question_text="あなたにとって理想のサッカーとは？",
            choices=[
                "全員が最後まで全力で戦うサッカー",  # 強化系: 全力
                "チーム全体が連動する美しいサッカー",  # 放出系: 連携
                "自由で創造的なサッカー",  # 変化系: 自由
                "緻密な戦術が機能するサッカー",  # 操作系: 戦術
            ],
        ),
    ]
    return questions


def test_diagnosis_pattern_1():
    """強化系寄りのパターンをテスト"""
    print("=" * 60)
    print("テスト 1: 強化系寄りの回答パターン")
    print("=" * 60)

    questions = create_sample_questions()
    # 強化系の選択肢（インデックス0）を多く選ぶパターン
    answer_indices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    question_answers = [
        QuestionAnswer(question=q, selected_choice_index=idx)
        for q, idx in zip(questions, answer_indices)
    ]

    try:
        result = diagnose_personality(question_answers)
        print(f"✓ 診断成功")
        print()
        print("スコア（強化系, 放出系, 変化系, 操作系, 具現化系, 特質系）:")
        print(f"  {result.scores}")
        print()
        print("診断コメント:")
        print(f"  {result.comment}")
        print()
        return True
    except Exception as e:
        print(f"✗ エラー: {e}")
        import traceback

        traceback.print_exc()
        return False


def test_diagnosis_pattern_2():
    """変化系寄りのパターンをテスト"""
    print("=" * 60)
    print("テスト 2: 変化系寄りの回答パターン")
    print("=" * 60)

    questions = create_sample_questions()
    # 変化系の選択肢（インデックス2）を多く選ぶパターン
    answer_indices = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]

    question_answers = [
        QuestionAnswer(question=q, selected_choice_index=idx)
        for q, idx in zip(questions, answer_indices)
    ]

    try:
        result = diagnose_personality(question_answers)
        print(f"✓ 診断成功")
        print()
        print("スコア（強化系, 放出系, 変化系, 操作系, 具現化系, 特質系）:")
        print(f"  {result.scores}")
        print()
        print("診断コメント:")
        print(f"  {result.comment}")
        print()
        return True
    except Exception as e:
        print(f"✗ エラー: {e}")
        import traceback

        traceback.print_exc()
        return False


def test_diagnosis_pattern_3():
    """操作系寄りのパターンをテスト"""
    print("=" * 60)
    print("テスト 3: 操作系寄りの回答パターン")
    print("=" * 60)

    questions = create_sample_questions()
    # 操作系の選択肢（インデックス3）を多く選ぶパターン
    answer_indices = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]

    question_answers = [
        QuestionAnswer(question=q, selected_choice_index=idx)
        for q, idx in zip(questions, answer_indices)
    ]

    try:
        result = diagnose_personality(question_answers)
        print(f"✓ 診断成功")
        print()
        print("スコア（強化系, 放出系, 変化系, 操作系, 具現化系, 特質系）:")
        print(f"  {result.scores}")
        print()
        print("診断コメント:")
        print(f"  {result.comment}")
        print()
        return True
    except Exception as e:
        print(f"✗ エラー: {e}")
        import traceback

        traceback.print_exc()
        return False


def test_diagnosis_mixed_pattern():
    """バランス型の回答パターンをテスト"""
    print("=" * 60)
    print("テスト 4: バランス型の回答パターン")
    print("=" * 60)

    questions = create_sample_questions()
    # 放出系（1）を中心に、バランスよく選ぶパターン
    answer_indices = [1, 1, 1, 1, 1, 0, 2, 1, 1, 1]

    question_answers = [
        QuestionAnswer(question=q, selected_choice_index=idx)
        for q, idx in zip(questions, answer_indices)
    ]

    try:
        result = diagnose_personality(question_answers)
        print(f"✓ 診断成功")
        print()
        print("スコア（強化系, 放出系, 変化系, 操作系, 具現化系, 特質系）:")
        print(f"  {result.scores}")
        print()
        print("診断コメント:")
        print(f"  {result.comment}")
        print()
        return True
    except Exception as e:
        print(f"✗ エラー: {e}")
        import traceback

        traceback.print_exc()
        return False


def main():
    """全テストを実行"""
    print()
    print("=" * 60)
    print("サッカー診断 - 性格診断APIテスト")
    print("=" * 60)
    print()

    results = []

    # 各テストを実行
    results.append(test_diagnosis_pattern_1())
    results.append(test_diagnosis_pattern_2())
    results.append(test_diagnosis_pattern_3())
    results.append(test_diagnosis_mixed_pattern())

    # 結果サマリー
    print("=" * 60)
    print("テスト結果サマリー")
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"成功: {passed}/{total}")
    print()

    if passed == total:
        print("✓ 全テスト成功")
        return 0
    else:
        print(f"✗ {total - passed}個のテストが失敗")
        return 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except ValueError as e:
        print(f"✗ 設定エラー: {e}", file=sys.stderr)
        print()
        print("対処方法:")
        print("1. api/.env.example をコピーして api/.env を作成")
        print("2. https://ai.google.dev/gemini-api/docs/api-key から API キーを取得")
        print("3. api/.env に GOOGLE_API_KEY=<取得したAPIキー> を記載")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n✗ テストが中断されました")
        sys.exit(130)
