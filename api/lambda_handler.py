"""
AWS Lambda ハンドラー
FastAPI アプリケーションを Lambda 上で実行するためのエントリーポイント
"""
import os
import json
import boto3
from mangum import Mangum
from main import app

# Secrets Manager から環境変数を取得
def load_secrets():
    """AWS Secrets Manager から Google API Key を取得して環境変数に設定"""
    secret_name = os.environ.get("SECRET_NAME", "giravanz-match/dev/google-api-key")
    region_name = os.environ.get("AWS_DEFAULT_REGION", "ap-northeast-1")
    
    # Lambda 実行時のみ Secrets Manager から取得
    if "AWS_LAMBDA_FUNCTION_NAME" in os.environ:
        try:
            session = boto3.session.Session()
            client = session.client(
                service_name='secretsmanager',
                region_name=region_name
            )
            
            get_secret_value_response = client.get_secret_value(
                SecretId=secret_name
            )
            
            secret = json.loads(get_secret_value_response['SecretString'])
            os.environ['GOOGLE_API_KEY'] = secret['GOOGLE_API_KEY']
            
        except Exception as e:
            print(f"Error loading secrets: {e}")
            raise

# Secrets をロード
load_secrets()

# Mangum ハンドラー（FastAPI を Lambda 用に変換）
handler = Mangum(app, lifespan="off")
