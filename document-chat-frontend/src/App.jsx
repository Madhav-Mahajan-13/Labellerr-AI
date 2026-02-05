import { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadDocument = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setExtractedText(data.text || "No text extracted");
      setMessages([]);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const botMessage = { role: "bot", content: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      alert("Chat failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📄 Document Intelligence Chat</h2>

      {/* Upload Section */}
      <div style={styles.card}>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={uploadDocument} disabled={loading}>
          {loading ? "Processing..." : "Upload & Extract"}
        </button>
      </div>

      {/* Extracted Text */}
      {extractedText && (
        <div style={styles.card}>
          <h4>Extracted Text</h4>
          <div style={styles.textBox}>{extractedText}</div>
        </div>
      )}

      {/* Chat Section */}
      {extractedText && (
        <div style={styles.card}>
          <h4>Chat with Document</h4>

          <div style={styles.chatBox}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  marginBottom: "8px",
                }}
              >
                <b>{msg.role === "user" ? "You" : "AI"}:</b>{" "}
                {msg.content}
              </div>
            ))}
          </div>

          <div style={styles.chatInput}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the document..."
            />
            <button onClick={sendQuestion} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    padding: "16px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  textBox: {
    maxHeight: "200px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    background: "#f9f9f9",
    padding: "10px",
    borderRadius: "6px",
  },
  chatBox: {
    maxHeight: "200px",
    overflowY: "auto",
    marginBottom: "10px",
    padding: "10px",
    background: "#f4f4f4",
    borderRadius: "6px",
  },
  chatInput: {
    display: "flex",
    gap: "8px",
  },
};