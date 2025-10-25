// Intro.jsx — 説明だけのイントロページ（質問の選択肢なし）
// 依存: react-router-dom（useNavigate）
import { useNavigate } from 'react-router-dom';

export const Intro = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                color: 'white',
            }}
        >
            <div style={{ width: '520px', maxWidth: '100%' }}>
                {/* Header（Chat/Resultとトーン統一） */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div
                        style={{
                            width: '8rem',
                            height: '8rem',
                            margin: '0 auto 1rem',
                            borderRadius: '50%',
                            background: 'linear-gradient(to bottom right, #facc15, #dc2626)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                        }}
                    >
                        <div
                            style={{
                                width: '6rem',
                                height: '6rem',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <span style={{ fontSize: '3rem' }}>
                                <img src="https://www.giravanz.jp/assets/img/common/logo-giravanz.svg" alt="Giravanzロゴ" style={{ width: '3rem', height: '3rem', display: 'block', margin: '0 auto' }} />
                            </span>

                        </div>
                    </div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 6 }}>ギラヴァンツ北九州 マッチング</h1>
                    <p style={{ color: '#fef9c3' }}>あなたの回答から、ピッタリの選手を推測します</p>
                </div>

                {/* 説明カード */}
                <div
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        borderRadius: 16,
                        padding: '1.25rem',
                        backdropFilter: 'blur(6px)',
                        boxShadow: '0 0 20px rgba(0,0,0,0.25)',
                    }}
                >
                    <h2 style={{ fontSize: 20, marginBottom: 8, fontWeight: 700 }}>遊び方</h2>
                    <ol style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7 }}>
                        <li>質問に順番に答えてください（全 {10} 問）</li>
                        <li>最後に「結果を見る」を押すと、推測結果が表示されます</li>
                        <li>結果では選手の写真（四角）に、名前とメッセージが表示されます</li>
                    </ol>

                    <div style={{ height: 12 }} />

                    <h2 style={{ fontSize: 20, marginBottom: 8, fontWeight: 700 }}>注意事項</h2>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.7 }}>
                        <li>選手名・メッセージはデモ用です。API接続後に正式データを表示します。</li>
                        <li>途中で戻ることも可能です（「前の質問に戻る」ボタン）。</li>
                    </ul>

                    <div style={{ height: 16 }} />

                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={() => navigate('/chat')}
                            style={{
                                padding: '0.9rem 1.5rem',
                                borderRadius: 10,
                                border: '2px solid #facc15',
                                background: 'linear-gradient(to right, #dc2626, #ea580c)',
                                color: 'white',
                                fontWeight: 800,
                                cursor: 'pointer',
                                minWidth: 220,
                                boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
                            }}
                        >
                            スタート
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
