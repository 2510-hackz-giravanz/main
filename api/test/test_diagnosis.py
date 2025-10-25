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
    """サンプルの質問セットを作成"""
    questions = [
        Question(
            question_text="試合で劣勢の時、どう行動する？",
            choices=[
                "諦めずに走り続ける",
                "チームメイトを鼓舞する",
                "戦術を変える提案をする",
                "クリエイティブなプレーで突破を図る",
            ],
        ),
        Question(
            question_text="練習で最も重視することは？",
            choices=["基礎トレーニング", "シュート練習", "ドリブル技術", "戦術理解"],
        ),
        Question(
            question_text="チームでの自分の役割は？",
            choices=["守備の要", "パスの起点", "チャンスメイカー", "戦術の司令塔"],
        ),
        Question(
            question_text="得意なプレースタイルは？",
            choices=["フィジカル重視", "正確なキック", "トリッキーな動き", "頭脳的なプレー"],
        ),
        Question(
            question_text="試合前の準備で大切にしていることは？",
            choices=["体調管理", "イメージトレーニング", "個人技の確認", "戦術の復習"],
        ),
        Question(
            question_text="サッカーで一番楽しいと感じる瞬間は？",
            choices=[
                "全力でプレーしている時",
                "味方にパスが通った時",
                "相手を抜き去った時",
                "作戦が成功した時",
            ],
        ),
        Question(
            question_text="失敗した時の対処法は？",
            choices=[
                "もっと練習する",
                "前向きに考える",
                "別のアプローチを試す",
                "原因を分析する",
            ],
        ),
        Question(
            question_text="尊敬する選手のタイプは？",
            choices=[
                "フィジカルが強い選手",
                "パスが上手い選手",
                "ドリブルが上手い選手",
                "戦術理解が高い選手",
            ],
        ),
        Question(
            question_text="サッカーから学んだことは？",
            choices=["努力の大切さ", "仲間の大切さ", "創造性の大切さ", "戦略の大切さ"],
        ),
        Question(
            question_text="理想のサッカーとは？",
            choices=["力強いサッカー", "華麗なサッカー", "魅せるサッカー", "賢いサッカー"],
        ),
    ]
    return questions


def test_diagnosis_pattern_1():
    """強化系寄りのパターンをテスト"""
    print("=" * 60)
    print("テスト 1: 強化系寄りの回答パターン")
    print("=" * 60)

    questions = create_sample_questions()
    # 選択肢が0や1に偏る回答
    answer_indices = [0, 0, 0, 1, 0, 0, 1, 0, 0, 1]

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
    # 選択肢が2や3に偏る回答
    answer_indices = [2, 3, 2, 2, 3, 2, 3, 2, 2, 3]

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
    """特質系寄りのパターンをテスト"""
    print("=" * 60)
    print("テスト 3: 特質系寄りの回答パターン")
    print("=" * 60)

    questions = create_sample_questions()
    # 全て選択肢3を選ぶパターン
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
    """バランス型のパターンをテスト"""
    print("=" * 60)
    print("テスト 4: バランス型の回答パターン")
    print("=" * 60)

    questions = create_sample_questions()
    # バランスの取れた回答
    answer_indices = [0, 1, 2, 3, 0, 1, 2, 3, 1, 2]

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
