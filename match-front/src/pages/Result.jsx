// Result.jsx — API統合版（診断結果を動的表示）
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RadarChart } from '../components/ui/RadarChart';
import { findPlayersByAnswers } from '../lib/api';

export const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    // 診断結果を取得
    const diagnosisResult = state?.diagnosisResult;

    // 診断結果がない場合はChatに戻す
    useEffect(() => {
        if (!diagnosisResult) {
            navigate('/chat', { replace: true });
        }
    }, [diagnosisResult, navigate]);

    // 診断結果のコメントをログ出力
    useEffect(() => {
        if (diagnosisResult?.comment) {
            console.log('診断結果コメント:', diagnosisResult.comment);
        }
    }, [diagnosisResult]);

    // レーダーチャート用のデータ
    const labels = ["強化系", "放出系", "変化系", "操作系", "具現化系", "特質系"];
    const values = diagnosisResult?.scores || [0, 0, 0, 0, 0, 0];

    // 最高スコアの系統を取得
    const maxScore = Math.max(...values);
    const maxIndex = values.indexOf(maxScore);
    const maxType = labels[maxIndex];

    // 選手マッチング
    const [matchedPlayers, setMatchedPlayers] = useState([]);

    useEffect(() => {
        const answers = state?.questionAnswers || [];
        findPlayersByAnswers(answers).then(setMatchedPlayers);
    }, [state?.questionAnswers]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, color: 'white', textAlign: 'center'
        }}>
            <div style={{ width: '520px', maxWidth: '100%' }}>
                <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 700 }}>診断結果</h1>

                {/* レーダーチャート */}
                <div style={{ marginBottom: 24 }}>
                    <RadarChart labels={labels} values={values} max={100} size={400} />
                </div>

                {/* スコア詳細 */}
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    padding: '24px',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    marginBottom: 24,
                    textAlign: 'left'
                }}>
                    <h2 style={{ fontSize: 20, marginBottom: 16, fontWeight: 700 }}>あなたの念能力タイプ</h2>
                    <div style={{ 
                        fontSize: 24, 
                        fontWeight: 800, 
                        color: '#facc15', 
                        marginBottom: 16,
                        textAlign: 'center'
                    }}>
                        {maxType} ({maxScore}点)
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: 14 }}>
                        {labels.map((label, i) => (
                            <div key={label} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                background: i === maxIndex ? 'rgba(250, 204, 21, 0.2)' : 'rgba(255,255,255,0.05)',
                                borderRadius: 8,
                                border: i === maxIndex ? '2px solid #facc15' : '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <span>{label}</span>
                                <span style={{ fontWeight: 'bold' }}>{values[i]}点</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 選手マッチング表示 */}
                {matchedPlayers.length > 0 && (
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        padding: '24px',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        marginBottom: 24,
                        textAlign: 'left'
                    }}>
                        <h2 style={{ fontSize: 20, marginBottom: 16, fontWeight: 700 }}>マッチした選手</h2>
                        <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                            {matchedPlayers.map(p => (
                                <li key={p.id} style={{ 
                                    marginBottom: 12, 
                                    padding: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: 8,
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                                        {p.name}
                                    </div>
                                    <div style={{ fontSize: 14, opacity: 0.9 }}>
                                        {p.position} / {p.nationality} / 年齢: {p.age}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={() => navigate('/chat')}
                    style={{
                        width: '100%',
                        borderRadius: 12,
                        background: '#facc15',
                        color: '#1f2937',
                        fontSize: 18,
                        fontWeight: 700,
                        padding: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => {
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={e => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                    }}
                >
                    もう一度診断する
                </button>
            </div>
        </div>
    );
};