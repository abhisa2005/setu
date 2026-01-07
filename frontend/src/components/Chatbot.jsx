import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5001/chat", {
        message: userMsg.text,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error. Try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Icon */}
      {!open && (
        <div style={styles.icon} onClick={() => setOpen(true)}>
          <img src="/chatbot.png" alt="Chatbot" style={styles.iconImg} />
        </div>
      )}

      {/* Chat Window */}
      {open && (
        <div style={styles.container}>
          <div style={styles.header}>
            <span>SETU Chatbot</span>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div style={styles.chatBox}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  background: m.sender === "user" ? "#DCF8C6" : "#eee",
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && <div style={styles.typing}>Bot typing...</div>}
          </div>

          <div style={styles.inputBox}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button style={styles.button} onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  icon: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  iconImg: {
    width: "45px",
    height: "45px",
  },
  container: {
    width: "320px",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "#4f46e5",
    color: "white",
    padding: "10px",
    borderRadius: "8px 8px 0 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  chatBox: {
    height: "250px",
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  message: {
    padding: "8px",
    borderRadius: "6px",
    maxWidth: "80%",
  },
  typing: {
    fontSize: "12px",
    color: "#999",
  },
  inputBox: {
    display: "flex",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "none",
    outline: "none",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
};
