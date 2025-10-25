"""診断サービス - ユーザーの回答を分析して性格診断を行う"""

import os
import json
from typing import List
from langchain_google_genai import ChatGoogleGenerativeAI
from prompts.diagnosis import get_diagnosis_prompt
from models.diagnosis import DiagnosisResponse, QuestionAnswer

# 環境変数を読み込み（ローカル開発時のみ）
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # Lambda環境では dotenv は不要
    pass


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
    structured_llm = llm.with_structured_output(DiagnosisResponse)

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
            result = chain.invoke({"question_answers": qa_text})
            
            # Noneが返ってきた場合はリトライ
            if result is None:
                last_error = Exception(f"LLMが構造化出力の生成に失敗しました（試行 {attempt + 1}/{max_retries}）")
                if attempt < max_retries - 1:
                    print(f"警告: {last_error}. リトライします...")
                    continue
                else:
                    raise last_error
            
            # 正常な結果が返ってきた場合
            return result
            
        except Exception as e:
            last_error = e
            if attempt < max_retries - 1:
                print(f"エラーが発生しました（試行 {attempt + 1}/{max_retries}）: {e}. リトライします...")
                continue
            else:
                raise Exception(f"診断処理に失敗しました（{max_retries}回試行）: {str(e)}") from e
    
    # ここには到達しないはずだが、念のため
    raise Exception(f"診断処理に失敗しました: {last_error}")
