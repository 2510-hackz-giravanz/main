// Result.jsx — 元の赤×黄配色 + Tapple風（1人表示・写真にテキストオーバーレイ）
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RadarChart } from '../components/ui/RadarChart';
import { getPlayers, findPlayersByAnswers } from '../lib/api';

export const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const answers = state?.answers || [];

    // 仮APIから選手データ取得
    const [matchedPlayers, setMatchedPlayers] = useState([]);

    useEffect(() => {
        // answersに応じて絞り込み
        findPlayersByAnswers(answers).then(setMatchedPlayers);
    }, [answers]);

    // ダミー1人（API後はここを書き換え）
    const guessed = {
        name: 'FW 佐藤 太郎',
        message: 'いつも応援ありがとう！次の試合も全力で！',
        confidence: 0.92,
        photo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
    };
    const labels = ["強化系", "放出系", "変化系", "操作系", "具現化系", "特質系"];
    const values = [82, 76, 68, 74, 80, 90];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, color: 'white', textAlign: 'center'
        }}>
            <div style={{ width: '520px', maxWidth: '100%' }}>
                <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 700 }}>マッチング結果</h1>

                {/* 既存のダミー表示 */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    border: '4px solid #facc15',
                    marginBottom: 24,
                }}>
                    <img
                        src={guessed.photo}
                        alt={guessed.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                        padding: '16px 12px',
                        boxSizing: 'border-box',
                        textAlign: 'left'
                    }}> 
                        {/* matchedPlayers[0]が存在する場合のみ表示 ? がないとバグるよ！ */}
                        <div style={{ fontSize: 22, fontWeight: 700 }}>{matchedPlayers[0]?.name}</div>
                        <div style={{ fontSize: 14, marginTop: 4, opacity: 0.9 }}>{guessed.message}</div>
                    </div>
                </div>

                <div style={{ marginBottom: 12, fontSize: 18 }}>確信度: {Math.round(guessed.confidence * 100)}%</div>

                {/* 仮APIの選手データ表示 */}
                <div style={{ margin: '32px 0 0', textAlign: 'left' }}>
                    <h2 style={{ fontSize: 20, marginBottom: 8 }}>仮API選手データ</h2>
                    {matchedPlayers.length === 0 ? (
                        <div style={{ color: '#fff6f6', fontSize: 16 }}>該当する選手データはありません</div>
                    ) : (
                        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                            {matchedPlayers.map(p => (
                                <li key={p.id} style={{ marginBottom: 8, fontSize: 16 }}>
                                    <span style={{ fontWeight: 700 }}>{p.name}</span>（{p.position} / {p.nationality} / 年齢: {p.age}）
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: 16,
                        padding: '0.8rem 1.2rem',
                        borderRadius: 8,
                        border: '2px solid #facc15',
                        background: 'linear-gradient(to right, #dc2626, #ea580c)',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%',
                        maxWidth: 360,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
                    }}
                >
                    もう一度プレイする
                </button>
                <div style={{ marginTop: 24 }}>
                    <RadarChart labels={labels} values={values} max={100} size={320} />
                </div>
            </div>
        </div>
    );
};