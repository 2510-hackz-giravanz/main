"""質問・選択肢のデータモデル定義"""

from typing import List
from pydantic import BaseModel, Field


class Choice(BaseModel):
    """4択の選択肢"""

    text: str = Field(description="選択肢のテキスト")
    nen_type: str = Field(
        description="この選択肢が示唆する念能力の系統（強化系、放出系、変化系、操作系、具現化系、特質系のいずれか）"
    )


class Question(BaseModel):
    """サッカー診断用の質問"""

    question_text: str = Field(description="サッカーに関する質問文")
    choices: List[Choice] = Field(
        description="4つの選択肢", min_length=4, max_length=4
    )


class QuestionSet(BaseModel):
    """サッカー診断用の質問セット（10個の質問）"""

    questions: List[Question] = Field(
        description="10個の質問", min_length=10, max_length=10
    )
