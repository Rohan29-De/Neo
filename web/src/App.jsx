import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const TABS = [
  { id: "explain", label: "Explain", emoji: "🔍", desc: "Understand any code instantly" },
  { id: "debug",   label: "Debug",   emoji: "🐛", desc: "Find & fix bugs fast" },
  { id: "docgen",  label: "DocGen",  emoji: "📄", desc: "Auto-generate docs" },
  { id: "testgen", label: "TestGen", emoji: "🧪", desc: "Write tests automatically" },
  { id: "chat",    label: "Chat",    emoji: "💬", desc: "Ask Neo anything" },
];

const PLACEHOLDERS = {
  explain: `// Paste your code — Neo will break it down\nfunction mystery(arr) {\n  return arr.reduce((a, b) => a + b, 0) / arr.length;\n}`,
  debug:   `// Paste buggy code — Neo will find the issue\nfunction getUser(id) {\n  return users[id].name;\n}`,
  docgen:  `// Paste code — Neo will document it\nfunction calculateTax(income, rate) {\n  return income * rate;\n}`,
  testgen: `// Paste code — Neo will write tests\nfunction isPrime(n) {\n  for(let i = 2; i < n; i++)\n    if(n % i === 0) return false;\n  return n > 1;\n}`,
};

const DOT_COLORS = {
  explain: "#818cf8", debug: "#fb7185",
  docgen: "#34d399", testgen: "#a78bfa", chat: "#fbbf24"
};

export default function App() {
  const [activeTab, setActiveTab] = useState("explain");
  const [code, setCode] = useState("");
  const [filename, setFilename] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatContext, setChatContext] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const chatEndRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setCode(ev.target.result);
    reader.readAsText(file);
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const payload = { code, filename };
      if (activeTab === "debug") payload.error = errorMsg;
      const { data } = await axios.post(`/api/${activeTab}`, payload);
      setResult(data.result);
    } catch (err) {
      setResult("**Error:** " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim() || loading) return;
    const userMsg = { role: "user", content: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/chat", { messages: newMessages, context: chatContext });
      setChatMessages([...newMessages, { role: "assistant", content: data.result }]);
    } catch (err) {
      setChatMessages([...newMessages, { role: "assistant", content: "Error: " + err.message }]);
    }
    setLoading(false);
  };

  const tab = TABS.find(t => t.id === activeTab);
  const accentColor = DOT_COLORS[activeTab];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", transition: "background 0.3s, color 0.3s" }}>

      {/* Header */}
      <header style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        height: "62px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(20px)",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="float" style={{ fontSize: "1.5rem", lineHeight: 1 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: "1.25rem", letterSpacing: "-0.03em", lineHeight: 1 }}>
              <span className="gradient-text">Neo</span>
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text3)", fontFamily: "DM Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              AI Dev Agent
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setResult(""); }}
              className={`btn-pop ${activeTab === t.id ? `tab-active-${t.id}` : ""}`}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "99px",
                border: "1px solid",
                borderColor: activeTab === t.id ? "" : "var(--border)",
                background: activeTab === t.id ? "" : "transparent",
                color: activeTab === t.id ? "" : "var(--text2)",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "0.3rem",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Right side: theme toggle + status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => setDarkMode(d => !d)}
            className="btn-pop"
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "99px",
              border: "1px solid var(--border)",
              background: "var(--surface2)",
              color: "var(--text2)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              fontFamily: "Nunito, sans-serif",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: "0.35rem",
            }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem", color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d39988" }}></div>
            llama-3.3-70b · groq
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", gap: "1.25rem", padding: "1.25rem 1.75rem", maxWidth: "1440px", width: "100%", margin: "0 auto" }}>

        {activeTab === "chat" ? (
          /* ── CHAT ── */
          <div style={{ flex: 1, display: "flex", gap: "1.25rem" }}>
            {/* Context panel */}
            <div style={{ width: "300px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.75rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.1rem", transition: "background 0.3s, border-color 0.3s" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                📎 Code Context
              </div>
              <textarea
                value={chatContext}
                onChange={e => setChatContext(e.target.value)}
                placeholder="Paste code here for Neo to reference..."
                className="font-mono"
                style={{ flex: 1, background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.75rem", fontSize: "0.76rem", color: "var(--text)", resize: "none", outline: "none", lineHeight: 1.7, minHeight: "180px", transition: "background 0.3s, border-color 0.3s, color 0.3s" }}
              />
              {chatMessages.length > 0 && (
                <button
                  onClick={() => setChatMessages([])}
                  style={{ padding: "0.5rem", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--text2)", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
                >
                  🗑 Clear Chat
                </button>
              )}
            </div>

            {/* Chat messages */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", overflow: "hidden", transition: "background 0.3s, border-color 0.3s" }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {chatMessages.length === 0 && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                    <div style={{ fontSize: "3rem", opacity: 0.2 }}>💬</div>
                    <div style={{ fontWeight: 700, color: "var(--text3)", fontSize: "0.9rem" }}>Ask Neo anything</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text3)", opacity: 0.7 }}>Paste context on the left for grounded answers</div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className="fade-slide" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: "0.6rem", alignItems: "flex-start" }}>
                    {msg.role === "assistant" && (
                      <div style={{ width: 30, height: 30, borderRadius: "10px", background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0, marginTop: 2 }}>⚡</div>
                    )}
                    <div style={{
                      maxWidth: "74%",
                      padding: "0.7rem 1rem",
                      borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.role === "user" ? "var(--chat-user-bg)" : "var(--chat-bot-bg)",
                      color: msg.role === "user" ? "var(--chat-user-color)" : "var(--text)",
                      fontSize: "0.87rem",
                      fontWeight: msg.role === "user" ? 600 : 400,
                      border: `1px solid ${msg.role === "user" ? "var(--chat-user-border)" : "var(--border)"}`,
                      lineHeight: 1.6,
                      transition: "background 0.3s, border-color 0.3s, color 0.3s",
                    }}>
                      {msg.role === "assistant"
                        ? <div className="markdown"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                        : msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div style={{ width: 30, height: 30, borderRadius: "10px", background: "var(--chat-user-bg)", border: "1px solid var(--chat-user-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0, marginTop: 2 }}>👤</div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="fade-slide" style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "10px", background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>⚡</div>
                    <div style={{ padding: "0.7rem 1rem", borderRadius: "16px 16px 16px 4px", background: "var(--chat-bot-bg)", border: "1px solid var(--border)", display: "flex", gap: "5px", alignItems: "center" }}>
                      {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#fbbf24", animation: `blink 0.9s ${i * 0.2}s infinite` }}></div>)}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div style={{ padding: "0.9rem 1.1rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.6rem", background: "var(--surface)", transition: "background 0.3s, border-color 0.3s" }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleChat()}
                  placeholder="Ask Neo about your code..."
                  style={{ flex: 1, padding: "0.65rem 1rem", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--input-bg)", fontSize: "0.87rem", fontWeight: 600, color: "var(--text)", outline: "none", fontFamily: "Nunito, sans-serif", transition: "all 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#fbbf2466"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button
                  onClick={handleChat}
                  disabled={loading || !chatInput.trim()}
                  className="btn-pop run-chat"
                  style={{ padding: "0.65rem 1.1rem", borderRadius: "12px", border: "none", color: "#1a1000", fontWeight: 800, fontSize: "0.87rem", cursor: "pointer", opacity: loading || !chatInput.trim() ? 0.4 : 1, transition: "all 0.15s", fontFamily: "Nunito, sans-serif" }}
                >
                  Send ↑
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── TOOL MODE ── */
          <div style={{ flex: 1, display: "flex", gap: "1.25rem" }}>
            {/* Left: Input */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.9rem", minWidth: 0 }}>

              {/* Tool header */}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", padding: "0.85rem 1.1rem", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.3s, border-color 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "12px", background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                    {tab?.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: "0.95rem", color: accentColor }}>{tab?.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{tab?.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {filename && (
                    <div style={{ padding: "0.3rem 0.7rem", borderRadius: "99px", background: "var(--surface2)", border: "1px solid var(--border)", fontSize: "0.72rem", fontFamily: "DM Mono, monospace", color: "var(--text2)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      📎 {filename}
                      <button onClick={() => { setFilename(""); setCode(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: "1rem", lineHeight: 1, padding: 0 }}>×</button>
                    </div>
                  )}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="btn-pop"
                    style={{ padding: "0.4rem 0.85rem", borderRadius: "99px", border: "1px solid var(--border)", background: "var(--surface2)", fontSize: "0.76rem", fontWeight: 700, cursor: "pointer", color: "var(--text2)", display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "Nunito, sans-serif", transition: "all 0.15s" }}
                  >
                    📁 Upload
                  </button>
                  <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFileUpload} accept=".js,.jsx,.ts,.tsx,.py,.go,.rs,.java,.cpp,.c,.json,.md" />
                </div>
              </div>

              {/* Code editor */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", overflow: "hidden", minHeight: "320px", transition: "background 0.3s, border-color 0.3s" }}>
                <div style={{ padding: "0.55rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--editor-bg)", borderRadius: "18px 18px 0 0", transition: "background 0.3s, border-color 0.3s" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fb7185", opacity: 0.8 }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24", opacity: 0.8 }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34d399", opacity: 0.8 }}></div>
                  <span style={{ fontSize: "0.7rem", fontFamily: "DM Mono, monospace", color: "var(--text3)", marginLeft: "0.5rem" }}>{filename || "untitled"}</span>
                </div>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder={PLACEHOLDERS[activeTab] || "// Paste your code here..."}
                  className="font-mono"
                  style={{ flex: 1, padding: "1rem", fontSize: "0.81rem", lineHeight: 1.75, color: "var(--text)", background: "transparent", resize: "none", outline: "none", border: "none", transition: "color 0.3s" }}
                />
              </div>

              {/* Error input for debug */}
              {activeTab === "debug" && (
                <input
                  value={errorMsg}
                  onChange={e => setErrorMsg(e.target.value)}
                  placeholder="🐛 Paste error message here (optional)..."
                  style={{ padding: "0.7rem 1rem", borderRadius: "12px", border: "1px solid var(--error-border)", background: "var(--error-bg)", fontSize: "0.82rem", fontWeight: 600, color: "var(--error-color)", outline: "none", fontFamily: "DM Mono, monospace", transition: "all 0.3s" }}
                />
              )}

              {/* Run button */}
              <button
                onClick={handleRun}
                disabled={loading || !code.trim()}
                className={`btn-pop run-${activeTab}`}
                style={{ padding: "0.85rem", borderRadius: "14px", border: "none", color: activeTab === "chat" ? "#1a1000" : "#fff", fontWeight: 800, fontSize: "0.92rem", cursor: "pointer", opacity: loading || !code.trim() ? 0.4 : 1, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontFamily: "Nunito, sans-serif", boxShadow: `0 4px 20px ${accentColor}30` }}
              >
                {loading ? (
                  <>
                    <div className="spin" style={{ width: 15, height: 15, border: "2.5px solid rgba(255,255,255,0.25)", borderTopColor: "#fff", borderRadius: "50%" }}></div>
                    Analyzing...
                  </>
                ) : (
                  <>{tab?.emoji} Run {tab?.label}</>
                )}
              </button>
            </div>

            {/* Right: Output */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "18px", overflow: "hidden", minWidth: 0, transition: "background 0.3s, border-color 0.3s" }}>
              <div style={{ padding: "0.65rem 1.1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--editor-bg)", borderRadius: "18px 18px 0 0", transition: "background 0.3s, border-color 0.3s" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: result ? accentColor : "var(--border2)", boxShadow: result ? `0 0 8px ${accentColor}88` : "none", transition: "all 0.3s" }}></div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text3)", fontFamily: "DM Mono, monospace", letterSpacing: "0.05em" }}>neo · output</span>
                {result && <span style={{ fontSize: "0.65rem", color: accentColor, fontFamily: "DM Mono, monospace", marginLeft: "auto", opacity: 0.7 }}>✓ done</span>}
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem" }}>
                {!result && !loading && (
                  <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                    <div style={{ fontSize: "2.5rem", opacity: 0.15 }}>{tab?.emoji}</div>
                    <div style={{ fontWeight: 700, color: "var(--text3)", fontSize: "0.85rem" }}>Output will appear here</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text3)", opacity: 0.6 }}>Paste code on the left and hit run</div>
                  </div>
                )}
                {loading && (
                  <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                    <div style={{ fontSize: "2.5rem" }} className="float">{tab?.emoji}</div>
                    <div style={{ fontWeight: 800, color: "var(--text2)", fontSize: "0.9rem" }}>Neo is analyzing...</div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {[0,1,2,3].map(i => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor, animation: `blink 0.8s ${i * 0.15}s infinite`, opacity: 0.7 }}></div>
                      ))}
                    </div>
                  </div>
                )}
                {result && (
                  <div className="markdown fade-slide">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}