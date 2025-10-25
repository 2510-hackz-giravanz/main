"""FastAPI アプリケーション - サッカー診断質問生成API"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.question_generator import generate_questions
from services.diagnosis_service import diagnose_personality
from models.question import QuestionSet
from models.diagnosis import DiagnosisRequest, DiagnosisResponse

app = FastAPI(
    title="サッカー診断質問生成API",
    description="LangChain + Gemini を使用してサッカー診断用の質問を生成します",
    version="1.0.0",
)

# CORS設定（フロントエンドからアクセス可能にする）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切に制限すること
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """ヘルスチェック用エンドポイント"""
    return {"message": "サッカー診断質問生成API is running"}


@app.get("/api/questions/generate", response_model=QuestionSet)
async def generate_questions_endpoint():
    """
    サッカー診断用の質問セット（10個の質問、各4択）を生成する
    
    Returns:
        QuestionSet: 10個の質問を含む質問セット
        
    Raises:
        HTTPException: API キーが未設定、または生成に失敗した場合
    """
    try:
        question_set = generate_questions()
        return question_set
    except ValueError as e:
        # 環境変数未設定などの設定エラー
        raise HTTPException(status_code=500, detail=f"設定エラー: {str(e)}")
    except Exception as e:
        # その他のエラー
        raise HTTPException(status_code=500, detail=f"質問生成に失敗しました: {str(e)}")


@app.post("/api/diagnosis", response_model=DiagnosisResponse)
async def diagnose_endpoint(request: DiagnosisRequest):
    """
    ユーザーの回答を分析して念能力の6系統を診断する
    
    Args:
        request: 質問、選択肢、ユーザーの回答を含むリクエスト
    
    Returns:
        DiagnosisResponse: 6系統のスコアと診断コメント
        
    Raises:
        HTTPException: API キーが未設定、または診断に失敗した場合
    """
    try:
        result = diagnose_personality(request.question_answers)
        return result
    except ValueError as e:
        # 環境変数未設定などの設定エラー
        raise HTTPException(status_code=500, detail=f"設定エラー: {str(e)}")
    except Exception as e:
        # その他のエラー
        raise HTTPException(status_code=500, detail=f"診断に失敗しました: {str(e)}")


