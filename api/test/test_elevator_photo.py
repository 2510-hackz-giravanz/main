"""エレベーターフォト生成のテストスクリプト

Gemini API の gemini-2.5-flash-image モデルを使用して、
2枚の人物画像からエレベーターフォトを生成するテスト。
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from PIL import Image

# 環境変数を読み込み
load_dotenv()


def generate_elevator_photo():
    """2枚の人物画像からエレベーターフォトを生成"""
    
    # Google API キーの確認
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY が設定されていません。.env ファイルを確認してください。"
        )
    
    # クライアント初期化
    client = genai.Client(api_key=api_key)
    
    # 画像パス
    base_dir = Path(__file__).parent.parent
    image1_path = base_dir / "public" / "person1.png"
    image2_path = base_dir / "public" / "person2.png"
    
    # 画像の存在確認
    if not image1_path.exists():
        raise FileNotFoundError(f"画像が見つかりません: {image1_path}")
    if not image2_path.exists():
        raise FileNotFoundError(f"画像が見つかりません: {image2_path}")
    
    print(f"📷 画像1を読み込み: {image1_path}")
    print(f"📷 画像2を読み込み: {image2_path}")
    
    # 画像を読み込み
    image1 = Image.open(image1_path)
    image2 = Image.open(image2_path)
    
    # プロンプト
    prompt = """
天井に設置された防犯カメラの記録映像のようなハイアングル視点。ドアの閉じられたエレベーター内で、2人のモデルが肩を寄せ合って仲睦まじく立っており、オリジナルの自然なポーズをとっている。2人とも顔をカメラに向け、視線がはっきりとこちらに届く。表情は自然でリアル、肌質や髪のディテールまで写し出される。環境は蛍光灯の光で均一に照らされ、ステンレスの壁と床が微妙に反射。映像は8Kの超高精細、フォトリアリスティックで、切り抜きやレタッチは一切行われていない。
"""
    
    print("\n🎬 エレベーターフォトを生成中...")
    print(f"モデル: gemini-2.5-flash-image")
    print(f"プロンプト: {prompt.strip()[:100]}...")
    
    try:
        # 画像生成（複数画像 + テキスト）
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[prompt, image1, image2],
        )
        
        # 生成された画像を保存
        output_path = base_dir / "public" / "elevator_photo_result.png"
        
        for part in response.candidates[0].content.parts:
            # テキスト応答がある場合
            if part.text is not None:
                print(f"\n💬 モデルからのメッセージ:\n{part.text}")
            
            # 生成画像がある場合
            elif part.inline_data is not None:
                from io import BytesIO
                generated_image = Image.open(BytesIO(part.inline_data.data))
                generated_image.save(output_path)
                print(f"\n✅ エレベーターフォトを生成しました!")
                print(f"📁 保存先: {output_path}")
                print(f"📏 サイズ: {generated_image.size}")
                print(f"🎨 モード: {generated_image.mode}")
                return output_path
        
        print("\n⚠️  画像が生成されませんでした")
        return None
        
    except Exception as e:
        print(f"\n❌ エラーが発生しました: {e}")
        raise


if __name__ == "__main__":
    print("=" * 60)
    print("🏢 エレベーターフォト生成テスト")
    print("=" * 60)
    
    try:
        result_path = generate_elevator_photo()
        
        if result_path:
            print("\n" + "=" * 60)
            print("🎉 テスト成功!")
            print("=" * 60)
            print(f"\n生成された画像: {result_path}")
            print("\nヒント: 画像を確認するには:")
            print(f"  open {result_path}  # macOS")
            print(f"  xdg-open {result_path}  # Linux")
        else:
            print("\n" + "=" * 60)
            print("⚠️  テスト失敗: 画像が生成されませんでした")
            print("=" * 60)
            
    except Exception as e:
        print("\n" + "=" * 60)
        print("❌ テスト失敗")
        print("=" * 60)
        print(f"エラー: {e}")
