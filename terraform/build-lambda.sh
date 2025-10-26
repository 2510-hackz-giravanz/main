#!/bin/bash
set -e

echo "Building Lambda deployment package..."

# 作業ディレクトリ
TERRAFORM_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$TERRAFORM_DIR")"
API_DIR="$PROJECT_ROOT/api"
BUILD_DIR="$PROJECT_ROOT/build/lambda"

# クリーンアップ
echo "Cleaning up previous build..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Python 依存関係をインストール
echo "Installing Python dependencies..."
cd "$API_DIR"

# requirements.txt 生成（pyproject.toml から）
cat > "$BUILD_DIR/requirements.txt" <<EOF
fastapi==0.120.0
google-genai==1.46.0
langchain==1.0.2
langchain-core==1.0.0
langchain-google-genai==3.0.0
pydantic==2.12.3
mangum==0.18.0
boto3==1.35.0
EOF

# 依存関係をインストール
pip install -r "$BUILD_DIR/requirements.txt" -t "$BUILD_DIR" --upgrade

# アプリケーションコードをコピー
echo "Copying application code..."
cp -r "$API_DIR/models" "$BUILD_DIR/"
cp -r "$API_DIR/services" "$BUILD_DIR/"
cp -r "$API_DIR/prompts" "$BUILD_DIR/"
cp "$API_DIR/main.py" "$BUILD_DIR/"
cp "$API_DIR/lambda_handler.py" "$BUILD_DIR/"

# 不要なファイルを削除（サイズ削減）
echo "Removing unnecessary files..."
cd "$BUILD_DIR"
find . -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete
find . -type f -name "*.pyo" -delete
find . -type f -name "*.dist-info" -exec rm -rf {} + 2>/dev/null || true

# ZIP ファイル作成
echo "Creating deployment package..."
PACKAGE_FILE="$PROJECT_ROOT/build/lambda-deployment.zip"
rm -f "$PACKAGE_FILE"
zip -r "$PACKAGE_FILE" . -q

# サイズ確認
PACKAGE_SIZE=$(du -h "$PACKAGE_FILE" | cut -f1)
echo "✅ Deployment package created: $PACKAGE_FILE ($PACKAGE_SIZE)"

# Lambda の制限を確認
PACKAGE_BYTES=$(stat -f%z "$PACKAGE_FILE" 2>/dev/null || stat -c%s "$PACKAGE_FILE")
MAX_SIZE=$((250 * 1024 * 1024))  # 250 MB

if [ "$PACKAGE_BYTES" -gt "$MAX_SIZE" ]; then
    echo "⚠️  Warning: Package size ($PACKAGE_SIZE) exceeds Lambda limit (250 MB)"
    exit 1
else
    echo "✅ Package size is within Lambda limits"
fi

echo "Build complete!"
