"""質問生成のテストスクリプト

実行方法:
    cd api
    ../.venv/bin/python test_question_generator.py
"""

import json
import sys
from services.question_generator import generate_questions


def main():
    """質問生成をテストする"""
    print("=" * 60)
    print("サッカー診断用質問生成テスト")
    print("=" * 60)
    print()

    try:
        print("質問を生成中...")
        question_set = generate_questions()

        print(f"✓ 質問生成成功！ ({len(question_set.questions)}個の質問)")
        print()

        # 結果をJSON形式で出力
        print("=" * 60)
        print("生成された質問セット（JSON形式）")
        print("=" * 60)
        print(json.dumps(question_set.model_dump(), ensure_ascii=False, indent=2))
        print()

        # 統計情報を表示
        print("=" * 60)
        print("統計情報")
        print("=" * 60)
        nen_type_count = {}
        for question in question_set.questions:
            for choice in question.choices:
                nen_type = choice.nen_type
                nen_type_count[nen_type] = nen_type_count.get(nen_type, 0) + 1

        print(f"質問数: {len(question_set.questions)}")
        print("念能力系統の出現回数:")
        for nen_type, count in sorted(nen_type_count.items()):
            print(f"  {nen_type}: {count}回")
        print()

        print("✓ テスト完了")
        return 0

    except ValueError as e:
        print(f"✗ 設定エラー: {e}", file=sys.stderr)
        print()
        print("対処方法:")
        print("1. api/.env.example をコピーして api/.env を作成")
        print("2. https://ai.google.dev/gemini-api/docs/api-key から API キーを取得")
        print("3. api/.env に GOOGLE_API_KEY=<取得したAPIキー> を記載")
        return 1

    except Exception as e:
        print(f"✗ エラー: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
