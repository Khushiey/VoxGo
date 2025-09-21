"use client";

import { useState, useEffect, useRef } from "react";
import AIVoiceInput from "../components/ui/ai-voice-input";

const QAPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.lang = "en-US";
        rec.continuous = true;
        rec.interimResults = false;

        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setRecordings((prev) => [...prev.slice(-4), { timestamp: new Date(), transcript }]);

          // Simple local QA logic
          let response = "Sorry, I don’t know.";
          if (transcript.toLowerCase().includes("time")) response = "It’s 10:30 AM.";
          else if (transcript.toLowerCase().includes("hello")) response = "Hi there!";

          setRecordings((prev) => [...prev, { timestamp: new Date(), transcript: response }]);
          speakText(response);
        };

        rec.onend = () => setIsRecording(false);
        recognitionRef.current = rec;
      }
    }
  }, []);

  const handleStart = () => {
    if (isRecording) return;
    setIsRecording(true);
    recognitionRef.current?.start();
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const handleReset = () => {
    setRecordings([]);
    speechSynthesis.cancel();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 space-y-6">
       

        {/* Voice Input & Controls */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <AIVoiceInput onStart={handleStart} onStop={handleStop} />
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
          >
            Reset
          </button>
        </div>

      

        {/* Conversation History */}
        <div>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {recordings.map((rec, i) => (
                <li
                  key={i}
                  className={`p-3 border rounded-md ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } flex items-start gap-2 text-sm text-gray-700`}
                >
                  <span className="font-mono text-gray-500 flex-shrink-0">
                    {rec.timestamp.toLocaleTimeString()}:
                  </span>
                  <span>{rec.transcript || "No transcript"}</span>
                </li>
              ))}
            </ul>
          
        </div>
      </div>
    </div>
  );
};

// Speech synthesis
const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  const voices = speechSynthesis.getVoices();
  const femaleVoice =
    voices.find((v) => v.name.includes("Google US English")) ||
    voices.find((v) => v.gender === "female") ||
    voices.find((v) => v.name.toLowerCase().includes("female"));
  if (femaleVoice) utterance.voice = femaleVoice;
  utterance.pitch = 1.2;
  speechSynthesis.speak(utterance);
};

export default QAPage;
