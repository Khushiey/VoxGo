import React, { useState } from "react";

export default function VoiceButton({
  onResult,
  onStartListening,
  onStopListening,
  style,
}) {
  const [listening, setListening] = useState(false);

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    setListening(true);
    if (onStartListening) onStartListening();

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setListening(false);
      if (onStopListening) onStopListening();
      onResult(text);
    };

    recognition.onend = () => {
      setListening(false);
      if (onStopListening) onStopListening();
    };
  };

  return (
    <button onClick={startRecognition} style={style}>
      {listening ? "🎙️ Listening…" : "🎤 Speak"}
    </button>
  );
}
