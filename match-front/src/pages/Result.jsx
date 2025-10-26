// Result.jsx — API統合版（診断結果を動的表示）
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RadarChart } from '../components/ui/RadarChart';
import { matchPlayerWithDiagnosis } from '../lib/matching';

export const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    // 診断結果を取得
    const diagnosisResult = state?.diagnosisResult;
    
    console.log('診断結果全体:', diagnosisResult);
    console.log('diagnosisResult?.primary:', diagnosisResult?.primary);

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
    const labels = ["強化系", "変化系", "具現化系", "特質系", "操作系", "放出系"];
    const values = diagnosisResult?.scores || [0, 0, 0, 0, 0, 0];

    // 最高スコアの系統を取得
    const maxScore = Math.max(...values);
    const maxIndex = values.indexOf(maxScore);
    const maxType = labels[maxIndex];
    
    console.log('計算されたmaxType:', maxType);

    // 選手マッチング
    const [matchedPlayers, setMatchedPlayers] = useState([]);
    const [isCommentExpanded, setIsCommentExpanded] = useState(false);
    const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);
    const [isPlayerDetailExpanded, setIsPlayerDetailExpanded] = useState(false);

    useEffect(() => {
        if (maxType) {
            console.log('maxTypeでマッチング開始:', maxType);
            setIsLoadingPlayer(true);
            matchPlayerWithDiagnosis(maxType).then(player => {
                console.log('マッチした選手:', player);
                if (player) {
                    setMatchedPlayers([player]);
                }
                setIsLoadingPlayer(false);
            }).catch(error => {
                console.error('選手マッチングエラー:', error);
                setMatchedPlayers([]);
                setIsLoadingPlayer(false);
            });
        }
    }, [maxType]);

    // マッチした選手を取得（デフォルト値を設定）
    const matchedPlayer = matchedPlayers[0] || null;
    
    console.log('現在のmatchedPlayer:', matchedPlayer);
    console.log('matchedPlayers配列:', matchedPlayers);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem 1rem 2rem', color: 'white', textAlign: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
                <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 700 }}>診断結果</h1>

                {/* レーダーチャート */}
                <div style={{ marginBottom: 24 }}>
                    <RadarChart labels={labels} values={values} max={100} size={320} />
                </div>

                {/* マッチした選手の表示 */}
                {isLoadingPlayer ? (
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        padding: '48px 24px',
                        marginBottom: 24,
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: 18, opacity: 0.8 }}>選手をマッチング中...</div>
                    </div>
                ) : matchedPlayer ? (
                    <>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: 16,
                            backdropFilter: 'blur(6px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            marginBottom: 24,
                            overflow: 'hidden',
                        }}>
                            {/* 選手画像 */}
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: 'min(500px, 60vh)',
                                background: 'rgba(0,0,0,0.3)',
                            }}>
                                <img
                                    src={matchedPlayer.photo || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop'}
                                    alt={matchedPlayer.name}
                                    style={{ 
                                        width: '100%', 
                                        height: '100%',
                                        display: 'block',
                                        objectFit: 'cover',
                                        objectPosition: 'top center'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)',
                                    padding: '24px 16px 16px',
                                    boxSizing: 'border-box',
                                    textAlign: 'left'
                                }}> 
                                    <div style={{ 
                                        fontSize: 18, 
                                        fontWeight: 600, 
                                        marginBottom: 8,
                                        opacity: 0.9
                                    }}>
                                        {matchedPlayer.position}
                                    </div>
                                    <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                                        {matchedPlayer.name}
                                    </div>
                                    {matchedPlayer.nickname && (
                                        <div style={{ 
                                            fontSize: 16, 
                                            opacity: 0.95,
                                            color: '#facc15'
                                        }}>
                                            ニックネーム: {matchedPlayer.nickname}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 選手詳細情報（展開可能） */}
                            <div style={{ padding: '24px', textAlign: 'left' }}>
                                <button
                                    onClick={() => setIsPlayerDetailExpanded(!isPlayerDetailExpanded)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 8,
                                        background: 'rgba(250, 204, 21, 0.2)',
                                        border: '1px solid #facc15',
                                        color: '#facc15',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: isPlayerDetailExpanded ? 16 : 0
                                    }}
                                    onMouseEnter={e => {
                                        e.target.style.background = 'rgba(250, 204, 21, 0.3)';
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.background = 'rgba(250, 204, 21, 0.2)';
                                    }}
                                >
                                    <span>選手の詳細情報</span>
                                    <span>{isPlayerDetailExpanded ? '▲' : '▼'}</span>
                                </button>

                                {isPlayerDetailExpanded && (
                                    <div>
                                        {matchedPlayer.description && (
                                            <div style={{
                                                fontSize: 14,
                                                lineHeight: 1.6,
                                                padding: 12,
                                                background: 'rgba(0,0,0,0.2)',
                                                borderRadius: 8,
                                                marginBottom: 12
                                            }}>
                                                {matchedPlayer.description.title && (
                                                    <div style={{ fontWeight: 700, marginBottom: 8 }}>
                                                        {matchedPlayer.description.title}
                                                    </div>
                                                )}
                                                {matchedPlayer.description.text && (
                                                    <div>{matchedPlayer.description.text}</div>
                                                )}
                                            </div>
                                        )}
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: '1fr 1fr', 
                                            gap: 8,
                                            fontSize: 13,
                                            opacity: 0.9
                                        }}>
                                            {matchedPlayer.birth && <div>生年月日: {matchedPlayer.birth}</div>}
                                            {matchedPlayer.height && <div>身長: {matchedPlayer.height}cm</div>}
                                            {matchedPlayer.weight && <div>体重: {matchedPlayer.weight}kg</div>}
                                            {matchedPlayer.from && <div>出身: {matchedPlayer.from}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        padding: '48px 24px',
                        marginBottom: 24,
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: 18, opacity: 0.8 }}>選手情報を読み込めませんでした</div>
                    </div>
                )}

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

                {/* 診断コメント */}
                {diagnosisResult?.comment && (
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        padding: '24px',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        marginBottom: 24,
                        textAlign: 'left'
                    }}>
                        <h2 style={{ fontSize: 20, marginBottom: 16, fontWeight: 700 }}>診断コメント</h2>
                        <div style={{
                            fontSize: 15,
                            lineHeight: 1.7,
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: isCommentExpanded ? 'unset' : 3,
                            WebkitBoxOrient: 'vertical',
                            transition: 'all 0.3s ease'
                        }}>
                            {diagnosisResult.comment}
                        </div>
                        <button
                            onClick={() => setIsCommentExpanded(!isCommentExpanded)}
                            style={{
                                marginTop: 12,
                                padding: '8px 16px',
                                borderRadius: 8,
                                background: 'rgba(250, 204, 21, 0.2)',
                                border: '1px solid #facc15',
                                color: '#facc15',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => {
                                e.target.style.background = 'rgba(250, 204, 21, 0.3)';
                            }}
                            onMouseLeave={e => {
                                e.target.style.background = 'rgba(250, 204, 21, 0.2)';
                            }}
                        >
                            {isCommentExpanded ? '▲ 閉じる' : '▼ 続きを読む'}
                        </button>
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