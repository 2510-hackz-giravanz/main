# 【ユーザーが行うべき作業】質問生成機能のセットアップ

実装が完了しました！以下の手順に従って、質問生成機能を動作させてください。

---

## 1. Google AI API キーの取得

### 手順
1. ブラウザで以下のURLを開く:  
   https://ai.google.dev/gemini-api/docs/api-key

2. 「Get API key」または「APIキーを取得」ボタンをクリック

3. Google アカウントでログイン

4. API キーが表示されるので、コピーする（例: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`）

---

## 2. 環境変数ファイルの作成

### 手順
1. `api/.env.example` をコピーして `api/.env` を作成:
   ```bash
   cd api
   cp .env.example .env
   ```

2. `api/.env` ファイルを開いて、取得した API キーを貼り付ける:
   ```
   GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
   （`your_api_key_here` の部分を実際の API キーに置き換える）

3. ファイルを保存

---

## 3. テスト実行

### 手順
以下のコマンドを実行して、質問生成が正しく動作するか確認します:

```bash
cd /home/yotu/github/2510-hackz-giravanz/main/api
../.venv/bin/python test_question_generator.py
```

### 期待される出力
成功すると、以下のような出力が表示されます:

```
============================================================
サッカー診断用質問生成テスト
============================================================

質問を生成中...
✓ 質問生成成功！ (10個の質問)

============================================================
生成された質問セット（JSON形式）
============================================================
{
  "questions": [
    {
      "question_text": "試合中、相手が強力なディフェンスをしてきたら?",
      "choices": [
        {
          "text": "フィジカルで押し切る",
          "nen_type": "強化系"
        },
        {
          "text": "正確なパスで崩す",
          "nen_type": "放出系"
        },
        ...
      ]
    },
    ...
  ]
}

============================================================
統計情報
============================================================
質問数: 10
念能力系統の出現回数:
  強化系: 7回
  放出系: 6回
  変化系: 8回
  操作系: 5回
  具現化系: 7回
  特質系: 7回

✓ テスト完了
```

---

## 4. エラーが出た場合のトラブルシューティング

### エラー: `GOOGLE_API_KEY が設定されていません`
**原因**: `.env` ファイルが作成されていないか、API キーが正しく記載されていない

**対処**:
1. `api/.env` ファイルが存在するか確認
2. ファイル内に `GOOGLE_API_KEY=...` が正しく記載されているか確認
3. API キーの前後にスペースや引用符がないか確認

### エラー: `ImportError: No module named 'langchain_google_genai'`
**原因**: パッケージがインストールされていない

**対処**:
```bash
cd api
uv add langchain-google-genai langchain-core pydantic python-dotenv
```

### エラー: `API key not valid`
**原因**: API キーが無効または期限切れ

**対処**:
1. https://ai.google.dev/gemini-api/docs/api-key で新しい API キーを生成
2. `api/.env` を更新

---

## 5. VSCode でのインポートエラーを解消する（オプション）

もし VSCode で `from langchain_google_genai import ...` などのインポートに赤い波線が出る場合:

1. VSCode を再読み込み:  
   `Ctrl+Shift+P` → `Developer: Reload Window`

2. Python 言語サーバーを再起動:  
   `Ctrl+Shift+P` → `Python: Restart Language Server`

3. 左下のインタプリタ表示が `api/.venv` を指しているか確認

---

## 6. 次のステップ（今後の開発）

質問生成が動作したら、以下の機能を順次実装していきます:

- [ ] FastAPI エンドポイント化（`POST /api/questions/generate`）
- [ ] 診断ロジックの実装（ユーザーの回答を分析）
- [ ] 選手マッチング機能
- [ ] フロントエンド連携

---

## まとめ

### ユーザーが今すぐやるべきこと
1. ✅ Google AI API キーを取得
2. ✅ `api/.env` を作成して API キーを設定
3. ✅ テストスクリプトを実行して動作確認

### 所要時間
約 5〜10 分

何か問題があれば、エラーメッセージを共有してください！
