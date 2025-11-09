"use client";

import { useState, useEffect, useRef } from "react";
import AIVoiceInput from "../components/ui/ai-voice-input";

const QAPage = () => {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.lang = "en-US";
        rec.continuous = true;
        rec.interimResults = false;

        rec.onresult = (event) => {
          const lastResultIndex = event.results.length - 1;
          const transcript =
            event.results[lastResultIndex][0].transcript.trim().toLowerCase();

          if (!transcript) return;
          handleCommand(transcript);
        };

        rec.onend = () => {
          if (isRecording) rec.start(); // auto-restart for continuous listening
        };

        recognitionRef.current = rec;
      }
    }
  }, [isRecording]);

  const handleCommand = (command) => {
    setRecordings((prev) => [
      ...prev.slice(-4),
      { timestamp: new Date(), transcript: `🗣️ ${command}` },
    ]);

    const response = getQuickResponse(command);
    setRecordings((prev) => [
      ...prev,
      { timestamp: new Date(), transcript: `🤖 ${response}` },
    ]);

    speakText(response);
  };

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
    setTextInput("");
    speechSynthesis.cancel();
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    handleCommand(textInput.trim().toLowerCase());
    setTextInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Voice Input & Controls */}
        <div className="flex flex-col items-center justify-center gap-4">
          <AIVoiceInput onStart={handleStart} onStop={handleStop} />
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
          >
            Reset
          </button>

          {/* Text Area for Written Commands */}
          <form
            onSubmit={handleTextSubmit}
            className="w-full flex flex-col items-center gap-3 mt-4"
          >
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your command here..."
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Send
            </button>
          </form>
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

// Quick Personal Assistant Logic
const getQuickResponse = (text) => {
  const now = new Date();
  if (text.includes("time")) return `Current time is ${now.toLocaleTimeString()}`;
  if (text.includes("date")) return `Today is ${now.toLocaleDateString()}`;
  if (text.includes("hello") || text.includes("hi")) return "Hello! How can I help you?";
  if (text.includes("your name")) return "I am your personal AI assistant.";
  if (text.includes("weather")) return "I can’t fetch live weather right now.";
  if (text.includes("joke")) return "Why did the developer go broke? Because he used up all his cache!";
  if (text.includes("who is")) return "Sorry, I can’t search that right now.";
  if (text.includes("reminder") || text.includes("remember"))
    return "I can’t store reminders yet, but I’ll be able to soon!";
  return "Sorry, I don’t know the answer. Try something else.";
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
