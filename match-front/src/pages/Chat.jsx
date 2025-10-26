import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../lib/api';


export const Chat = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]); // インデックス配列に変更
    const [shuffledChoices, setShuffledChoices] = useState([]); // シャッフルされた選択肢のマッピング
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Fisher-Yatesシャッフルアルゴリズム
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // 質問データを取得
    useEffect(() => {
        // キャッシュをチェック
        const cachedQuestions = sessionStorage.getItem('questions');
        if (cachedQuestions) {
            try {
                const data = JSON.parse(cachedQuestions);
                setQuestions(data);
                // 各質問の選択肢をシャッフルし、元のインデックスとのマッピングを保存
                const shuffledMappings = data.map(q => {
                    const indices = q.choices.map((_, i) => i);
                    return shuffleArray(indices);
                });
                setShuffledChoices(shuffledMappings);
                setIsLoading(false);
                return;
            } catch (e) {
                console.error('Failed to parse cached questions:', e);
                sessionStorage.removeItem('questions');
            }
        }

        // キャッシュがない場合のみAPIを呼ぶ
        fetchQuestions()
            .then(data => {
                sessionStorage.setItem('questions', JSON.stringify(data));
                setQuestions(data);
                // 各質問の選択肢をシャッフルし、元のインデックスとのマッピングを保存
                const shuffledMappings = data.map(q => {
                    const indices = q.choices.map((_, i) => i);
                    return shuffleArray(indices);
                });
                setShuffledChoices(shuffledMappings);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    const currentQuestion = questions[currentQuestionIndex];
    const currentShuffledIndices = shuffledChoices[currentQuestionIndex] || [];

    const handleAnswer = (displayIndex) => {
        // 表示上のインデックスから元のインデックスに変換
        const originalIndex = currentShuffledIndices[displayIndex];
        const newAnswers = [...answers, originalIndex]; // 元のインデックスを保存
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleGoResult = () => {
        // API送信用のデータ形式に変換
        const questionAnswers = answers.map((selectedIndex, i) => ({
            question: questions[i],
            selected_choice_index: selectedIndex
        }));

        navigate("/loading", { state: { questionAnswers } });
        
        // handleRestart(); ← 削除: navigate後なので不要
    }

    // ローディング中または質問が空の場合
    if (isLoading || questions.length === 0) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <div style={{
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '480px',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    padding: '2.5rem 1.5rem',
                    borderRadius: '1rem',
                    backdropFilter: 'blur(6px)'
                }}>
                    <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: '#facc15', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ fontSize: '1.2rem', color: '#fef9c3', marginBottom: '0.5rem' }}>読み込み中...</p>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    // エラー時
    if (error) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 1rem 2rem', color: 'white' }}>
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>エラーが発生しました</h2>
                    <p style={{ marginBottom: '1.5rem' }}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: '2px solid #facc15',
                            background: 'linear-gradient(to right, #dc2626, #ea580c)',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        再読み込み
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 1rem 2rem' }}>
            <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center', color: 'white', margin: '0 auto' }}>
                {!isComplete ? (
                    <>
                        <div style={{ marginBottom: '1.5rem' }}>
                            {/* 質問 %文字の表示 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fef9c3', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                <span>質問 {currentQuestionIndex + 1} / {questions.length}</span>
                                <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                            </div>
                            {/* プログレスバー */}
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, background: 'linear-gradient(to right, #facc15, white)', transition: 'width 0.4s ease' }}></div>
                            </div>
                        </div>

                        {/* 質問 */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1rem 1rem', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', wordWrap: 'break-word' }}>{currentQuestion.question_text}</h2>
                            </div>
                        </div>

                        {/* 選択肢 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                            {currentShuffledIndices.map((originalIndex, displayIndex) => (
                                <button
                                    key={displayIndex}
                                    onClick={() => handleAnswer(displayIndex)}
                                    style={{ 
                                        width: '100%', 
                                        minHeight: '3.5rem', 
                                        padding: '0.75rem 1rem',
                                        fontSize: '1.1rem', 
                                        background: 'white', 
                                        color: '#dc2626', 
                                        border: '2px solid #facc15', 
                                        borderRadius: '0.5rem', 
                                        cursor: 'pointer', 
                                        fontWeight: 'bold', 
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)', 
                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                        lineHeight: 1.4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
                                    }}
                                >
                                    {currentQuestion.choices[originalIndex]}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 > 全ての質問が完了しました！</h2>
                        <p>結果を表示するには下のボタンを押してください。</p>
                        <button
                            onClick={handleGoResult}
                            style={{
                                marginTop: "1rem",
                                padding: "0.75rem 1.5rem",
                                borderRadius: "8px",
                                border: "2px solid #facc15",
                                background: "linear-gradient(to right, #dc2626, #ea580c)",
                                color: "white",
                                fontWeight: "bold",
                                width: '100%',
                                boxSizing: 'border-box',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                fontSize: '1.2rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                        >
                            結果を見る →
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
