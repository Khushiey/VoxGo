import React, { useState } from "react";
import VoiceButton from "../components/VoiceButton";

export default function Translator() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [romanized, setRomanized] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("hi");

  // Function to speak translated text
  const speakText = (text, langCode) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = {
      hi: "hi-IN",
      gu: "gu-IN",
      bn: "bn-BD",
      ta: "ta-IN",
      te: "te-IN",
      ml: "ml-IN",
      kn: "kn-IN",
      pa: "pa-IN",
      or: "or-IN",
      ur: "ur-PK",
      en: "en-US",
      fr: "fr-FR",
      es: "es-ES",
      de: "de-DE",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
    };
    utterance.lang = langMap[langCode] || "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleTranslate = async (input) => {
    setText(input);

    try {
      // Google Translate API
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
          input
        )}`
      );
      const data = await res.json();
      const translation = data[0][0][0];
      setTranslated(translation);

      // Romanized version using Google Input Tools for Indian languages
      const indianLanguages = ["hi", "gu", "bn", "ta", "te", "mr", "ml", "kn", "pa", "or"];
      if (indianLanguages.includes(targetLang)) {
        const translitRes = await fetch(
          `https://inputtools.google.com/request?text=${encodeURIComponent(
            translation
          )}&itc=${targetLang}-t-i0-und`
        );
        const translitData = await translitRes.json();
        if (translitData[0] === "SUCCESS" && translitData[1].length > 0) {
          setRomanized(translitData[1][0][1][0]);
        } else {
          setRomanized(translation);
        }
      } else {
        // For other languages, fallback to the translated text itself
        setRomanized(translation);
      }

      // Speak translated text
      speakText(translation, targetLang);
    } catch (error) {
      console.error(error);
      setTranslated("❌ Translation failed. Please try again.");
      setRomanized("");
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter" && text.trim()) handleTranslate(text);
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
          background: "rgba(0,0,0,0.55)",
          width: "50vw",
          minHeight: "55vh",
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
            fontSize: "2.8vw",
            color: "#fff",
            fontWeight: "bold",
            marginBottom: "28px",
            letterSpacing: "3px",
            textShadow: "0 2px 12px #43e97b",
          }}
        >
          🌍 Universal Translator
          <br />
          <span style={{ fontSize: "1.2vw", color: "#aef2ae" }}>
            (सभी भाषाओं के लिए अनुवादक)
          </span>
        </h2>

        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            style={dropdownStyle}
          >
            <option value="auto">Detect Language / भाषा पहचानें</option>
            {languages.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            style={dropdownStyle}
          >
            {languages.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: "18px",
            marginBottom: "32px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleEnterPress}
            placeholder="Speak or type here... / यहाँ बोलें या लिखें..."
            style={inputStyle}
          />
          <VoiceButton
            onResult={handleTranslate}
            style={{
              fontSize: "4vw",
              padding: "1.8vw 3.5vw",
              borderRadius: "14px",
              background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
              color: "#222",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
            }}
          />
        </div>

       {translated && (
  <div style={outputBox}>
    <p style={{ fontSize: "1.6vw", color: "#fff", marginBottom: "6px" }}>
      <strong>🌐 Translation:</strong> {translated}
    </p>
    {romanized && (
      <p style={{ fontSize: "1.4vw", color: "#b2f2bb" }}>
        <strong>🔡 Romanized:</strong> {romanized}
      </p>
    )}
  </div>
)}

      </div>
    </div>
  );
}

const dropdownStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "rgba(255,255,255,0.85)",
  fontWeight: "600",
  fontSize: "1vw",
};

const inputStyle = {
  fontSize: "1.2vw",
  padding: "0.8vw 1.2vw",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  background: "rgba(255,255,255,0.85)",
  color: "#222",
  width: "20vw",
};

const outputBox = {
  background: "rgba(67,233,123,0.12)",
  borderRadius: "16px",
  padding: "2vw",
  boxShadow: "0 4px 16px rgba(67,233,123,0.15)",
  marginTop: "12px",
  textShadow: "0 2px 12px #38f9d7",
};

const languages = [
  ["en", "English (अंग्रेज़ी)"],
  ["hi", "Hindi (हिन्दी)"],
  ["gu", "Gujarati (ગુજરાતી)"],
  ["bn", "Bengali (বাংলা)"],
  ["ta", "Tamil (தமிழ்)"],
  ["te", "Telugu (తెలుగు)"],
  ["mr", "Marathi (मराठी)"],
  ["ml", "Malayalam (മലയാളം)"],
  ["kn", "Kannada (ಕನ್ನಡ)"],
  ["pa", "Punjabi (ਪੰਜਾਬੀ)"],
  ["or", "Odia (ଓଡ଼ିଆ)"],
  ["ur", "Urdu (اردو)"],
  ["ne", "Nepali (नेपाली)"],
  ["si", "Sinhala (සිංහල)"],
  ["th", "Thai (ไทย)"],
  ["zh-CN", "Chinese (中文)"],
  ["ja", "Japanese (日本語)"],
  ["ko", "Korean (한국어)"],
  ["ru", "Russian (Русский)"],
  ["fr", "French (Français)"],
  ["es", "Spanish (Español)"],
  ["de", "German (Deutsch)"],
  ["it", "Italian (Italiano)"],
  ["ar", "Arabic (العربية)"],
  ["pt", "Portuguese (Português)"],
  ["tr", "Turkish (Türkçe)"],
  ["vi", "Vietnamese (Tiếng Việt)"],
  ["id", "Indonesian (Bahasa Indonesia)"],
  ["fa", "Persian (فارسی)"],
];
