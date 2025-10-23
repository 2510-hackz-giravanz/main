// src/pages/Loading.jsx
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Result } from "./Result";

export const Loading = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.answers) {
      navigate("/chat", { replace: true });
    }
  }, [navigate, state]);

  
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
      <div style={{ width: "520px", maxWidth: "100%" }}>
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

        <h1 style={{ fontSize: 28, marginBottom: 8, fontWeight: 700 }}>マッチング中…</h1>
        <p style={{ color: "#fef9c3", marginBottom: 24 }}>
          AIがあなたの回答をもとに結果を生成しています
        </p>

        <button
          onClick={() => navigate('/result')}
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
          結果を見る →
        </button>
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
