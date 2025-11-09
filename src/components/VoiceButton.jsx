import React from "react";

export default function VoiceButton({ onResult, style }) {
  const handleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "auto";
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
  };

  return (
    <button onClick={handleVoice} style={style}>
      🎙️
    </button>
  );
}
