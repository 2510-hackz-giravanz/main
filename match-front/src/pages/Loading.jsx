// src/pages/Loading.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitDiagnosis } from "../lib/api";

export const Loading = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // questionAnswers が渡されていない場合は Chat に戻す
    if (!state?.questionAnswers) {
      navigate("/chat", { replace: true });
      return;
    }

    // 診断APIを実行
    submitDiagnosis(state.questionAnswers)
      .then(diagnosisResult => {
        // 診断完了後、Result に遷移
        navigate("/result", { 
          state: { diagnosisResult },
          replace: true 
        });
      })
      .catch(err => {
        console.error('Diagnosis error:', err);
        setError(err.message);
      });
  }, [state, navigate]);

  // エラー時
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          color: "white",
          textAlign: "center",
        }}
      >
  <div style={{ width: '100%', maxWidth: 520, minWidth: 280, margin: '0 auto', boxSizing: 'border-box', padding: '2rem 1rem' }}>
          <h1 style={{ fontSize: 28, marginBottom: 16, fontWeight: 700 }}>エラーが発生しました</h1>
          <p style={{ color: "#fef9c3", marginBottom: 24 }}>
            {error}
          </p>

          <button
            onClick={() => navigate('/chat')}
            style={{
              padding: "0.8rem 1.2rem",
              borderRadius: 8,
              border: "2px solid #facc15",
              background: "linear-gradient(to right, #dc2626, #ea580c)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
              maxWidth: 360,
              boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
            }}
          >
            戻る
          </button>
        </div>
      </div>
    );
  }


  // ローディング中
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #dc2626, #f59e0b, #ea580c)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        color: "white",
        textAlign: "center",
      }}
    >
  <div style={{ width: '100%', maxWidth: 520, minWidth: 280, margin: '0 auto', boxSizing: 'border-box', padding: '2rem 1rem' }}>
        {/* スピナー */}
        <div
          style={{
            width: 112,
            height: 112,
            margin: "0 auto 16px",
            borderRadius: "50%",
            border: "4px solid rgba(255,255,255,0.35)",
            borderTopColor: "#facc15",
            animation: "spin 1.1s linear infinite",
            boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
          }}
        />

        <h1 style={{ width: '500px', fontSize: 28, marginBottom: 8, fontWeight: 700 }}>マッチング中…</h1>
        <p style={{ color: "#fef9c3", marginBottom: 24 }}>
          AIがあなたの回答をもとに結果を生成しています  
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
