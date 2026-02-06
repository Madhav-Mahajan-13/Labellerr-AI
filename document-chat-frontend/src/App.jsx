import { useState, useEffect } from "react";
import "./App.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function App() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadDocument = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/ocr`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setExtractedText(data.text || "No text extracted");
      setMessages([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const sendQuestion = async () => {
    if (!question.trim()) return;
    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      const botMessage = { role: "bot", content: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = { role: "bot", content: "Sorry, I encountered an error. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="app-container">
      {/* Animated background gradient */}
      <div className="animated-bg"></div>
      
      <div className="content-wrapper">
        {/* Header */}
        <header className="app-header">
          <div className="header-icon">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="header-text">
            <h1 className="app-title">Document Intelligence</h1>
            <p className="app-subtitle">
              Extract insights from your documents with AI-powered analysis
            </p>
          </div>
        </header>

        {/* Upload Section */}
        <section className="upload-section">
          <div
            className={`upload-dropzone ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.heic,.heif"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
            />
            <label htmlFor="fileInput" className="file-label">
              {uploading ? (
                <div className="upload-loading">
                  <div className="spinner-ring"></div>
                  <span className="loading-text">Processing document...</span>
                </div>
              ) : (
                <>
                  <div className="upload-icon-wrapper">
                    <svg
                      width="56"
                      height="56"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="upload-icon"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <span className="upload-primary-text">
                    {file ? (
                      <span className="file-name">{file.name}</span>
                    ) : (
                      "Drop your file here or click to browse"
                    )}
                  </span>
                  <span className="upload-hint">
                    Supports PDF, PNG, JPG, JPEG, WEBP, HEIC, HEIF
                  </span>
                </>
              )}
            </label>
          </div>
          <button
            onClick={uploadDocument}
            disabled={uploading || !file}
            className={`upload-button ${uploading || !file ? "disabled" : ""}`}
            data-testid="upload-button"
          >
            {uploading ? (
              <>
                <div className="button-spinner"></div>
                Processing...
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
                Extract Text
              </>
            )}
          </button>
        </section>

        {/* Extracted Text */}
        {extractedText && (
          <section className="extracted-section fade-in">
            <div className="section-header">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <h3 className="section-title">Extracted Content</h3>
            </div>
            <div className="extracted-text-box" data-testid="extracted-text">
              {extractedText}
            </div>
          </section>
        )}

        {/* Chat Section */}
        {extractedText && (
          <section className="chat-section fade-in">
            <div className="section-header">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h3 className="section-title">Chat with Your Document</h3>
            </div>

            <div className="chat-container" data-testid="chat-container">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="M8 10h.01" />
                      <path d="M12 10h.01" />
                      <path d="M16 10h.01" />
                    </svg>
                  </div>
                  <p className="empty-text">
                    Ask me anything about your document
                  </p>
                  <div className="suggestion-chips">
                    <button 
                      className="suggestion-chip"
                      onClick={() => setQuestion("What is this document about?")}
                    >
                      Summarize this
                    </button>
                    <button 
                      className="suggestion-chip"
                      onClick={() => setQuestion("What are the key points?")}
                    >
                      Key points
                    </button>
                    <button 
                      className="suggestion-chip"
                      onClick={() => setQuestion("How many words are in this document?")}
                    >
                      Word count
                    </button>
                  </div>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message-wrapper ${msg.role === "user" ? "user" : "bot"}`}
                      data-testid={`message-${msg.role}-${index}`}
                    >
                      <div className="message-bubble">
                        <div className="message-avatar">
                          {msg.role === "user" ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 8V4H8" />
                              <rect x="2" y="8" width="20" height="12" rx="2" />
                              <path d="M6 16h.01" />
                              <path d="M10 16h.01" />
                              <path d="M14 16h.01" />
                              <path d="M18 16h.01" />
                            </svg>
                          )}
                        </div>
                        <div className="message-content">
                          <div className="message-label">
                            {msg.role === "user" ? "You" : "AI Assistant"}
                          </div>
                          <div className="message-text">{msg.content}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="message-wrapper bot">
                      <div className="message-bubble">
                        <div className="message-avatar">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 8V4H8" />
                            <rect x="2" y="8" width="20" height="12" rx="2" />
                            <path d="M6 16h.01" />
                            <path d="M10 16h.01" />
                            <path d="M14 16h.01" />
                            <path d="M18 16h.01" />
                          </svg>
                        </div>
                        <div className="message-content">
                          <div className="message-label">AI Assistant</div>
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="chat-input-wrapper">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
              placeholder="Ask a question about the document..."
              className="chat-input"
                disabled={loading}
                data-testid="chat-input"
              />
              <button
                onClick={sendQuestion}
                disabled={loading || !question.trim()}
              className={`send-button ${loading || !question.trim() ? "disabled" : ""}`}
              data-testid="send-button"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}