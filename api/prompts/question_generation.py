"""質問生成用のプロンプトテンプレート"""

import random
from langchain_core.prompts import ChatPromptTemplate


def get_question_generation_prompt(seed: int = None) -> ChatPromptTemplate:
    """
    サッカー診断用の質問を生成するためのプロンプトテンプレートを返す

    Args:
        seed: ランダムシード（指定すると毎回異なる質問の視点を促す）

    Returns:
        ChatPromptTemplate: 質問生成用のプロンプト
    """
    # シードが指定されていない場合はランダムに生成
    if seed is None:
        seed = random.randint(1, 1000000)

    # 多様性を持たせるためのテーマ候補（観戦者・ファン視点）
    themes = [
        "試合観戦の楽しみ方",
        "好きな選手のタイプ",
        "応援スタイル",
        "試合の見どころ",
        "サッカーの魅力",
        "チーム選びの基準",
        "観戦時の感情",
        "サッカー文化への関わり方",
        "理想のプレースタイル",
        "サッカーから学ぶこと",
        "日常生活での価値観",
        "人間関係の築き方",
    ]

    # シードを使って毎回異なるテーマの組み合わせを選択
    random.seed(seed)
    selected_themes = random.sample(themes, min(6, len(themes)))
    themes_hint = "、".join(selected_themes)

    system_message = f"""あなたはサッカーと心理学の専門家です。
サッカーにちなんだ質問を10個作成し、各質問に4つの選択肢を用意してください。

重要な制約:
- 各質問には必ず4つの選択肢を用意すること
- 質問文と選択肢は日本語で作成すること
- 質問は多様性を持たせること（プレースタイル、練習方法、メンタル、チームでの役割など）

**創造性のためのヒント（毎回異なる視点で質問を作成すること）**:
- 以下のテーマを参考に、ユニークで新鮮な質問を考えてください: {themes_hint}
- 同じような質問や選択肢の繰り返しを避け、毎回異なる角度から性格を診断できる質問を作成してください
- 具体的なシチュエーションや状況設定を工夫して、回答者が自分を投影しやすい質問にしてください
- ランダム性ID: {seed}（このIDを参考に、他の生成とは異なる独自の質問セットを作成してください）
"""

    human_message = "サッカー診断用の質問セット（10個の質問、各4択）を生成してください。必ず前回とは異なる、新鮮でユニークな質問を作成してください。"

    return ChatPromptTemplate.from_messages(
        [
            ("system", system_message),
            ("human", human_message),
        ]
    )
