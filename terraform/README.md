# Terraform Infrastructure for Giravanz Match

このディレクトリには、Giravanz Match アプリケーションの AWS インフラストラクチャを管理する Terraform 設定が含まれています。

## Phase 1: 基盤セットアップ ✅

### デプロイされるリソース
- **AWS Secrets Manager**: Google Gemini API Key の安全な保管

### 前提条件
- AWS CLI がインストールされている
- AWS 認証情報が設定されている (`aws configure`)
- Terraform >= 1.0 がインストールされている

### セットアップ手順

#### 1. Terraform 初期化
```bash
cd terraform
terraform init
```

#### 2. 変数ファイル作成
```bash
cp terraform.tfvars.example terraform.tfvars
# 必要に応じて terraform.tfvars を編集
```

#### 3. デプロイプラン確認
```bash
terraform plan
```

#### 4. デプロイ実行
```bash
terraform apply
```

#### 5. Google API Key を手動設定
Terraform は Secret の箱のみを作成します。実際の API キーは手動で設定してください:

```bash
# シークレット名を確認
terraform output secret_name

# API キーを設定
aws secretsmanager put-secret-value \
  --secret-id $(terraform output -raw secret_name) \
  --secret-string "{\"GOOGLE_API_KEY\":\"YOUR_ACTUAL_API_KEY_HERE\"}"
```

#### 6. 確認
```bash
# Secret が作成されたことを確認
aws secretsmanager describe-secret --secret-id $(terraform output -raw secret_name)

# Secret の値を取得（マスクされた状態で確認）
aws secretsmanager get-secret-value --secret-id $(terraform output -raw secret_name)
```

### セキュリティノート
- API キーは Terraform State に保存されません（`lifecycle.ignore_changes` を使用）
- Secret の削除には 7 日間の猶予期間があります
- すべてのリソースには自動的にタグが付与されます

### リソース削除
```bash
terraform destroy
```

## 次のフェーズ
- Phase 2: Lambda 関数デプロイ
- Phase 3: API Gateway 統合
- Phase 4: フロントエンド (S3 + CloudFront)
