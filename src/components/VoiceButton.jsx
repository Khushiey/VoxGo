import React, { useState } from "react";

export default function VoiceButton({ onResult }) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const recognition =
      new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.start();
  };

  return (
    <button
      className={`button ${listening ? "red listening-animation" : "green"}`}
      onClick={startListening}
    >
      {listening ? "Listening..." : "🎤 Speak"}
    </button>
  );
}
