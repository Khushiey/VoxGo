import React, { useState, useEffect, useRef } from "react";

export default function AIVoiceInput() {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn’t support Speech Recognition. Try using Google Chrome.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (!transcript) return;

      setRecordings((prev) => [
        ...prev,
        { role: "user", text: transcript, timestamp: new Date() },
      ]);

      try {
        const res = await fetch("https://aiaudiochatbot-backend.vercel.app/api/ask-groq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: transcript }),
        });

        const data = await res.json();
        const answer = data.answer || "Sorry, I couldn’t process that.";

        setRecordings((prev) => [
          ...prev,
          { role: "ai", text: answer, timestamp: new Date() },
        ]);

        speakText(answer);
      } catch (err) {
        console.error("Error fetching AI response:", err);
      }
    };

    rec.onend = () => {
      setIsRecording(false);
      stopTimer();
    };

    recognitionRef.current = rec;
  }, []);

  const startTimer = () => {
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };

  const stopTimer = () => clearInterval(timerRef.current);

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const handleStart = () => {
    if (isRecording) return;
    setIsRecording(true);
    recognitionRef.current?.start();
    startTimer();
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    stopTimer();
  };

  const handleReset = () => {
    setRecordings([]);
    setTimer(0);
    stopTimer();
    speechSynthesis.cancel();
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1.1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  return (
    <>
      <style>{`
        .qa-container {
          min-height: 100vh;
          background: linear-gradient(145deg, #0f172a, #0b2538);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .qa-card {
          width: 100%;
          max-width: 1200px;
          background: #0b192f;
          border-radius: 24px;
          box-shadow: 0 8px 50px rgba(0, 0, 0, 0.6);
          padding: 3rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          color: #d1d5db;
        }

        .qa-title {
          text-align: center;
          font-size: 3rem;
          font-weight: 800;
          color: #00ffae;
          text-shadow: 0 0 20px #00ffae, 0 0 40px #00ffae;
        }

        .qa-subtitle {
          text-align: center;
          color: #a3a3a3;
          font-size: 1.4rem;
        }

        .qa-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .qa-btn {
          background-color: #00ffae;
          color: #000;
          font-weight: 700;
          padding: 1.2rem 2.5rem;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 0 25px rgba(0, 255, 174, 0.6);
        }

        .qa-btn:hover {
          background-color: #00e69d;
          box-shadow: 0 0 40px rgba(0, 255, 174, 0.8);
        }

        .qa-btn.stop {
          background-color: #ef4444;
          color: white;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.6);
        }

        .qa-btn.stop:hover {
          background-color: #dc2626;
        }

        .qa-timer {
          text-align: center;
          font-family: monospace;
          color: #9ca3af;
          font-size: 1.4rem;
        }

        .qa-status {
          text-align: center;
          font-weight: 700;
          font-size: 1.2rem;
          color: #00ffae;
        }

        .qa-history {
          max-height: 40rem;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background-color: rgba(17, 24, 39, 0.6);
          border-radius: 16px;
        }

        .qa-message {
          background: #142437;
          border: 2px solid #1e3a8a;
          border-radius: 12px;
          padding: 1rem;
          color: #e5e7eb;
          font-size: 1.2rem;
        }

        .qa-message.ai {
          background: #12283a;
          border-color: #00ffae;
        }

        .qa-message small {
          display: block;
          font-size: 0.9rem;
          color: #6b7280;
          margin-top: 5px;
          text-align: right;
        }

        .qa-reset-btn {
          align-self: center;
          background-color: #ef4444;
          color: #fff;
          padding: 1rem 2rem;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
        }

        .qa-reset-btn:hover {
          background-color: #dc2626;
          box-shadow: 0 0 40px rgba(239, 68, 68, 0.7);
        }

        .qa-history::-webkit-scrollbar {
          width: 12px;
        }

        .qa-history::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 8px;
        }

        /* ✅ Responsive Design */
        @media (max-width: 1024px) {
          .qa-card {
            padding: 2rem 3rem;
          }
          .qa-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .qa-card {
            padding: 2rem;
          }
          .qa-title {
            font-size: 2rem;
          }
          .qa-subtitle {
            font-size: 1.2rem;
          }
          .qa-btn {
            font-size: 1.3rem;
            padding: 1rem 2rem;
          }
        }

        @media (max-width: 480px) {
          .qa-card {
            padding: 1.5rem;
            border-radius: 16px;
          }
          .qa-title {
            font-size: 1.6rem;
          }
          .qa-subtitle {
            font-size: 1rem;
          }
          .qa-btn {
            width: 100%;
            font-size: 1.1rem;
            padding: 0.8rem 1rem;
          }
          .qa-reset-btn {
            width: 100%;
            font-size: 1.1rem;
          }
          .qa-history {
            max-height: 25rem;
          }
          .qa-message {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="qa-container">
        <div className="qa-card">
          <h1 className="qa-title">Q/A Voice Assistant</h1>
          <p className="qa-subtitle">
            Speak your question to interact with the AI. Conversation history is below.
          </p>

          <div className="qa-controls">
            <button
              onClick={isRecording ? handleStop : handleStart}
              className={`qa-btn ${isRecording ? "stop" : ""}`}
            >
              {isRecording ? "🛑 Stop" : "🎤 Speak"}
            </button>

            <div>
              <p className="qa-timer">{formatTime(timer)}</p>
              <p
                className="qa-status"
                style={{ color: isRecording ? "#00ffae" : "#9ca3af" }}
              >
                {isRecording ? "Recording..." : "Not Recording"}
              </p>
            </div>
          </div>

          <div className="qa-history">
            {recordings.length === 0 ? (
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "1.2rem" }}>
                No conversation yet.
              </p>
            ) : (
              recordings.map((rec, i) => (
                <div key={i} className={`qa-message ${rec.role === "ai" ? "ai" : ""}`}>
                  <strong>{rec.role === "ai" ? "🤖 AI:" : "🧠 You:"}</strong>{" "}
                  {rec.text}
                  <small>{rec.timestamp.toLocaleTimeString()}</small>
                </div>
              ))
            )}
          </div>

          <button onClick={handleReset} className="qa-reset-btn">
            🔄 Reset
          </button>
        </div>
      </div>
    </>
  );
}
