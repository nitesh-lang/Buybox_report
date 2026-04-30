import React, { useState } from "react";
import Dashboard from "./nexlev_ads_dashboard";

const HELP_ITEMS = [
  {
    question: "Questions about login access?",
    answer: "Contact your admin or team lead to confirm your username and password.",
  },
  {
    question: "Dashboard not opening after sign in?",
    answer: "Refresh once and try again. If it still fails, ask the ops team to verify access.",
  },
  {
    question: "Need a new report or brand added?",
    answer: "Share the brand name and report type with the analytics team for setup.",
  },
];

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Enter username and password.");
      return;
    }

    setError("");
    onLogin();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.22), transparent 28%), linear-gradient(135deg, #050816 0%, #0B1024 48%, #111827 100%)",
        padding: "32px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#E5EEF8",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 540 }}>
        <div
          style={{
            borderRadius: 30,
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0 28px 80px rgba(15,23,42,0.45)",
          }}
        >
          <div
            style={{
              padding: "44px 44px 30px",
              background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
              color: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 26,
                }}
              >
                B
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.8 }}>BrandIQ Hub</div>
                <div style={{ fontSize: 11, opacity: 0.78, letterSpacing: 2, marginTop: 4 }}>
                  AMAZON PERFORMANCE INTELLIGENCE
                </div>
              </div>
            </div>

            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -2, lineHeight: 0.98 }}>
              Welcome back
            </div>
            <div style={{ marginTop: 12, fontSize: 19, color: "rgba(255,255,255,0.82)" }}>
              Sign in to access your dashboard
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
              {["Live Data", "Buy Box Analytics", "BSR Tracker"].map((item, index) => (
                <span
                  key={item}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: index === 0 ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.08)",
                    color: index === 0 ? "#B7F7CD" : "#E5EEFF",
                  }}
                >
                  {index === 0 ? "• " : ""}
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div style={{ padding: "34px 44px 40px", color: "#0F172A" }}>
            <form onSubmit={handleSubmit}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 1.2, marginBottom: 10 }}>
                USERNAME
              </label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                style={{
                  width: "100%",
                  height: 58,
                  borderRadius: 18,
                  border: "1px solid #D7DFEA",
                  padding: "0 18px",
                  fontSize: 16,
                  color: "#0F172A",
                  outline: "none",
                  marginBottom: 22,
                }}
              />

              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 1.2, marginBottom: 10 }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  height: 58,
                  borderRadius: 18,
                  border: "1px solid #D7DFEA",
                  padding: "0 18px",
                  fontSize: 16,
                  color: "#0F172A",
                  outline: "none",
                }}
              />

              {error ? (
                <div style={{ marginTop: 12, color: "#DC2626", fontSize: 13, fontWeight: 600 }}>{error}</div>
              ) : null}

              <button
                type="submit"
                style={{
                  width: "100%",
                  marginTop: 24,
                  height: 62,
                  borderRadius: 18,
                  border: "none",
                  background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 18px 28px rgba(37,99,235,0.25)",
                }}
              >
                Sign In →
              </button>
            </form>

            <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1, height: 1, background: "#D7DFEA" }} />
              <div style={{ fontSize: 12, color: "#94A3B8", letterSpacing: 2 }}>CAMBIUM RETAIL</div>
              <div style={{ flex: 1, height: 1, background: "#D7DFEA" }} />
            </div>

            <div style={{ marginTop: 20, textAlign: "center", color: "#64748B", fontSize: 14, lineHeight: 1.7 }}>
              Restricted access. Authorised team members only.
              <br />
              Contact your admin for access issues.
            </div>

            <div
              style={{
                marginTop: 28,
                borderRadius: 22,
                border: "1px solid #D7DFEA",
                background: "linear-gradient(180deg, #F8FAFC 0%, #EEF4FF 100%)",
                padding: "20px 22px",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                Questions? Quick help
              </div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>
                Answers for the most common login and access questions.
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {HELP_ITEMS.map((item) => (
                  <div
                    key={item.question}
                    style={{
                      borderRadius: 16,
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      padding: "14px 16px",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>
                      {item.question}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: "#64748B" }}>{item.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Dashboard />;
}
