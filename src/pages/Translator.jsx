import React, { useState } from "react";
import VoiceButton from "../components/VoiceButton";
import { speak } from "../utils/Speech";

export default function Translator() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");

  const handleTranslate = (input) => {
    setText(input);
    const translation = input.split("").reverse().join(""); // dummy translation
    setTranslated(translation);
    speak(translation);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "url('https://wallpapercave.com/wp/wp12782258.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          width: "40vw",
          minHeight: "40vh",
          borderRadius: "32px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          padding: "40px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "3vw",
            color: "#fff",
            fontWeight: "bold",
            marginBottom: "32px",
            letterSpacing: "4px",
            textShadow: "0 2px 12px #43e97b",
            animation: "fadeInDown 1s",
          }}
        >
          Translator
        </h2>
        <div
          style={{
            display: "flex",
            gap: "18px",
            marginBottom: "32px",
            justifyContent: "center",
            alignItems: "center",
            animation: "fadeIn 1.5s",
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            style={{
              fontSize: "1.2vw",
              padding: "0.8vw 1.2vw",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              background: "rgba(255,255,255,0.85)",
              color: "#222",
              fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
              boxShadow: "0 2px 8px rgba(67,233,123,0.10)",
              width: "16vw",
              transition: "box-shadow 0.2s",
            }}
          />
          <VoiceButton
            onResult={handleTranslate}
            style={{
              fontSize: "3vw",
              padding: "1.5vw 3vw",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
              color: "#222",
              fontWeight: "600",
              boxShadow: "0 4px 16px rgba(67,233,123,0.15)",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s, background 0.3s",
              fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
            }}
          />
        </div>
        {translated && (
          <div
            style={{
              background: "rgba(67,233,123,0.12)",
              color: "#fff",
              fontSize: "1.5vw",
              fontWeight: "500",
              borderRadius: "16px",
              padding: "2vw",
              boxShadow: "0 4px 16px rgba(67,233,123,0.15)",
              marginTop: "12px",
              animation: "fadeInUp 1s",
              textShadow: "0 2px 12px #38f9d7",
            }}
          >
            {translated}
          </div>
        )}
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
            input:focus {
              box-shadow: 0 4px 16px #43e97b;
            }
          `}
        </style>
      </div>
    </div>
  );
}
