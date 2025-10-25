import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const questions = [
    {
        id: 1,
        text: "あなたが考えているのは実在する人物ですか？",
        options: ["はい", "いいえ", "わからない", "たぶん", "たぶん違う"],
    },
    {
        id: 2,
        text: "その人物は日本人ですか？",
        options: ["はい", "いいえ", "わからない", "たぶん", "たぶん違う"],
    },
    {
        id: 3,
        text: "その人物は有名人ですか？",
        options: ["はい", "いいえ", "わからない", "たぶん", "たぶん違う"],
    },
    {
        id: 4,
        text: "その人物は芸能界で活動していますか？",
        options: ["はい", "いいえ", "わからない", "たぶん", "たぶん違う"],
    },
    {
        id: 5,
        text: "その人物は男性ですか？",
        options: ["はい", "いいえ", "わからない", "たぶん", "たぶん違う"],
    },
];



export const Chat = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const navigate = useNavigate();

    const handleAnswer = (answer) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setIsComplete(false);
    };

    const handleGoResult = () => {
        const snapshot = answers.slice();
        navigate("/loading", { state: { answers: snapshot } })
        handleRestart();
    }


    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setAnswers(answers.slice(0, -1));
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ width: '520px', maxWidth: '100%', textAlign: 'center', color: 'white' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ width: '8rem', height: '8rem', margin: '0 auto 1rem', borderRadius: '50%', background: 'linear-gradient(to bottom right, #facc15, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
                        <div style={{ width: '6rem', height: '6rem', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '3rem' }}>🔮</span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ギラヴァンツ北九州</h1>
                    <p style={{ color: '#fef9c3' }}>選手とのマッチング中...</p>
                </div>

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
                            {/* 前に戻るボタン */}
                            {currentQuestionIndex > 0 && (
                                <button
                                    onClick={handleBack}
                                    style={{ marginTop: '0.75rem', background: '#dc2626', color: 'white', border: '2px solid #facc15', padding: '0.25rem 0.75rem', fontSize: '0.9rem', cursor: 'pointer', borderRadius: '0.375rem' }}
                                >
                                    ← 前の質問に戻る
                                </button>
                            )}
                        </div>
                        
                        {/* 質問 */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ width: '520px', maxWidth: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 0 20px rgba(0,0,0,0.3)' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', wordWrap: 'break-word' }}>{currentQuestion.text}</h2>
                            </div>
                        </div>
                        
                        {/* 選択肢 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    style={{ width: '520px', maxWidth: '100%', height: '3.5rem', fontSize: '1.1rem', background: 'white', color: '#dc2626', border: '2px solid #facc15', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h2>全ての質問が完了しました！</h2>
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
