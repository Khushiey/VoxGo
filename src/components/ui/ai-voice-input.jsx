"use client";
import { useState } from "react";

export default function QAPage() {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState([
    { q: "Hello.", a: "Hi there!" },
    { q: "What is the capital of India?", a: "New Delhi." }
  ]);

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      // stop recording and save mock answer
      setHistory((prev) => [
        ...prev,
        { q: "Sample Question?", a: "Sample Answer." }
      ]);
      setTime(0);
    } else {
      setRecording(true);
      let sec = 0;
      const timer = setInterval(() => {
        sec++;
        setTime(sec);
        if (!recording) clearInterval(timer);
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="qa-page">
      <div className="qa-card">
        <h1 className="qa-title">Q/A Voice Assistant</h1>
        <p className="qa-subtitle">
          Speak your question to interact with the AI. Conversation history is below.
        </p>

        <div className="voice-box">
          <button className="mic-btn" onClick={toggleRecording}>
            {recording ? "🎤 Stop" : "🎙 Speak"}
          </button>
          <p className="timer">{formatTime(time)}</p>
          <p className="status">
            {recording ? "Listening..." : "Not Recording"}
          </p>
        </div>

        <div className="history-box">
          <h2 className="history-title">Conversation History</h2>
          <div className="history-list">
            {history.map((item, i) => (
              <div key={i} className="history-item">
                <p className="q">🧑 {item.q}</p>
                <p className="a">🤖 {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap");

        .qa-page {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          font-family: "Montserrat", sans-serif;
          padding: 2rem;
        }

        .qa-card {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          padding: 40px;
          max-width: 50vw;
          width: 100%;
          text-align: center;
          color: #fff;
        }

        .qa-title {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #43e97b;
          text-shadow: 0 0 10px rgba(67, 233, 123, 0.7);
        }

        .qa-subtitle {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #b5f5d0;
        }

        .voice-box {
          margin-bottom: 2rem;
        }

        .mic-btn {
          background: linear-gradient(90deg, #43e97b, #38f9d7);
          border: none;
          padding: 14px 28px;
          font-size: 2.5rem;
          font-weight: 600;
          color: #0f0f0f;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mic-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(67, 233, 123, 0.6);
        }

        .timer {
          margin: 1rem 0 0.5rem;
          font-size: 2rem;
          font-weight: bold;
        }

        .status {
          font-size: 2rem;
          color: #a0f1e0;
        }

        .history-box {
          text-align: left;
          margin-top: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          max-height: 250px;
          overflow-y: auto;
        }

        .history-title {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #38f9d7;
          text-shadow: 0 0 6px rgba(56, 249, 215, 0.6);
        }

        .history-item {
          margin-bottom: 2rem;
        }

        .q {
          color: #fff;
          font-weight: 600;
          font-size: 2rem;
        }

        .a {
          color: #43e97b;
          margin-left: 1rem;
          font-size: 2rem;
        }
      `}</style>
    </div>
  );
}
