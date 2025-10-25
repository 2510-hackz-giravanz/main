"""診断リクエスト・レスポンスのデータモデル定義"""

from typing import List
from pydantic import BaseModel, Field
from models.question import Question


class QuestionAnswer(BaseModel):
    """質問と回答のペア"""

    question: Question = Field(description="質問データ")
    selected_choice_index: int = Field(
        description="ユーザーが選択した選択肢のインデックス（0-3）", ge=0, le=3
    )


class DiagnosisRequest(BaseModel):
    """診断リクエスト - 質問、選択肢、ユーザーの回答をすべて含む"""

    question_answers: List[QuestionAnswer] = Field(
        description="質問と回答のペアのリスト", min_length=10, max_length=10
    )


class DiagnosisResponse(BaseModel):
    """診断レスポンス - 念能力の6系統スコアと診断コメント"""

    scores: List[int] = Field(
        description="6つの念能力系統のスコア（強化系、変化系、具現化系、特質系、操作系、放出系の順）",
        min_length=6,
        max_length=6,
    )
    comment: str = Field(description="診断理由と性格分析のコメント")
