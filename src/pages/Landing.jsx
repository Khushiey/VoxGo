import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);

  const handleVoiceCommand = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    try {
      recognition.start();
      setListening(true);
      console.log("🎤 Voice recognition started...");

      recognition.onresult = (event) => {
        setListening(false);
        const command = event.results[0][0].transcript.toLowerCase().trim();
        console.log("✅ Voice command received:", command);

        if (command.includes("location")) {
          navigate("/location");
        } else if (command.includes("translator")) {
          navigate("/translator");
        } else if (
          command.includes("question") ||
          command.includes("q a") ||
          command.includes("qa")
        ) {
          navigate("/qa");
        } else {
          alert(
            `Unrecognized command: "${command}". Try saying "location", "translator", or "Q A".`
          );
        }
      };

      recognition.onerror = (event) => {
        console.error("❌ Speech recognition error:", event.error);
        setListening(false);
        if (event.error === "not-allowed") {
          alert("Microphone permission denied. Please allow mic access.");
        } else {
          alert(`Voice command failed: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log("🔇 Voice recognition ended.");
        setListening(false);
      };
    } catch (err) {
      console.error("🚫 Failed to start voice recognition:", err);
      alert("Voice recognition could not be started.");
      setListening(false);
    }
  };

  return (
    <div
      className="landing-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('https://wallpapercave.com/wp/wp12782258.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          width: "40vw",
          minHeight: "40vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 10px",
          borderRadius: "32px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          textAlign: "center",
          margin: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "5vw",
            color: "#fff",
            fontWeight: "bold",
            marginBottom: "28px",
            letterSpacing: "6px",
            textShadow: "0 4px 32px #43e97b, 0 2px 8px #222",
            animation: "fadeInDown 1s",
            lineHeight: "1.1",
            fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
            textAlign: "center",
          }}
        >
          🚀 VoxGo
        </h1>

        <p
          style={{
            fontSize: "1.7vw",
            color: "#e0e0e0",
            marginBottom: "36px",
            fontWeight: "500",
            textShadow: "0 2px 12px #38f9d7",
            animation: "fadeIn 2s",
            letterSpacing: "2px",
            fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
            textAlign: "center",
          }}
        >
          Get answers, translate languages, and find locations — all by voice!
        </p>

        <div
          className="flex"
          style={{
            gap: "28px",
            marginTop: "18px",
            justifyContent: "center",
            animation: "fadeInUp 1.5s",
          }}
        >
          <Link className="landing-btn" to="/location">
            Location
          </Link>
          <Link className="landing-btn" to="/translator">
            Translator
          </Link>
          <Link className="landing-btn" to="/qa">
            Q/A
          </Link>
        </div>

        {/* 🎙️ Speak Button */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <button
            onClick={handleVoiceCommand}
            disabled={listening}
            style={{
              background: listening
                ? "linear-gradient(90deg, #ff7eb3 0%, #ff758c 100%)"
                : "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
              border: "none",
              borderRadius: "50px",
              padding: "12px 28px",
              fontSize: "1.3vw",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: listening
                ? "0 0 30px rgba(255, 118, 136, 0.6)"
                : "0 0 20px rgba(67, 233, 123, 0.4)",
              transform: listening ? "scale(1.05)" : "scale(1)",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {listening ? "🎧 Listening..." : "🎙️ Speak"}
          </button>
        </div>
      </div>

      {/* Animations & Font Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;500&display=swap');

          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-40px);}
            to { opacity: 1; transform: translateY(0);}
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }

          @keyframes fadeIn {
            from { opacity: 0;}
            to { opacity: 1;}
          }

          .landing-btn {
            background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
            color: #222;
            font-size: 1vw;
            font-weight: 600;
            padding: 0.6vw 1.5vw;
            border-radius: 12px;
            text-decoration: none;
            box-shadow: 0 4px 16px rgba(67,233,123,0.15);
            transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
            border: none;
            outline: none;
            cursor: pointer;
            font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
          }

          .landing-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 8px 32px rgba(67,233,123,0.25);
            background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
            color: #fff;
          }
        `}
      </style>
    </div>
  );
}
