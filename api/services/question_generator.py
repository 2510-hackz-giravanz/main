"""質問生成サービス"""

import os
import random
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

from models.question import QuestionSet
from prompts.question_generation import get_question_generation_prompt


# 環境変数をロード
load_dotenv()


def generate_questions(seed: int = None) -> QuestionSet:
    """
    LangChain + Gemini を使ってサッカー診断用の質問セット（10個）を生成する

    Args:
        seed: ランダムシード（指定すると毎回異なる質問を生成）

    Returns:
        QuestionSet: 10個の質問を含む質問セット

    Raises:
        ValueError: GOOGLE_API_KEY が設定されていない場合
        Exception: LLM呼び出しに失敗した場合
    """
    # API キーの確認
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY が設定されていません。"
            ".env ファイルを作成して API キーを設定してください。"
        )

    # シードが指定されていない場合はランダムに生成
    if seed is None:
        seed = random.randint(1, 1000000)

    # LLM の初期化（temperatureを高めに設定して多様性を確保）
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        temperature=0.9,  # 創造的で多様な質問生成のため高めに設定
        google_api_key=api_key,
    )

    # 構造化出力を使用
    structured_llm = llm.with_structured_output(QuestionSet)

    # プロンプトを取得（シードを渡して毎回異なるテーマを選択）
    prompt = get_question_generation_prompt(seed=seed)

    # チェーンを構築
    chain = prompt | structured_llm

    # 質問セットを生成
    try:
        question_set = chain.invoke({})
        return question_set
    except Exception as e:
        raise Exception(f"質問生成に失敗しました: {str(e)}") from e
