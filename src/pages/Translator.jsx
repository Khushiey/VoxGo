import React, { useState } from "react";
import VoiceButton from "../components/VoiceButton";
import TurnBackButton from "../components/ui/backbutton";

export default function Translator() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [romanized, setRomanized] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("hi");

  // --- Function: Speak Text ---
  const speakText = (text, langCode) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    window.speechSynthesis.speak(utterance);
  };

  // --- Function: Romanization (English script version) ---
  const getRomanized = async (text, lang) => {
    try {
      const res = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(
          text
        )}&itc=${lang}-t-i0-und`
      );
      const data = await res.json();

      if (data[0] === "SUCCESS") {
        return data[1][0][1][0];
      }
    } catch (e) {}

    return text; // fallback
  };

  // --- Function: Translate (NEW & FIXED) ---
const handleTranslate = async (input) => {
  setText(input);

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      input
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    const translatedText = data[0]?.map(item => item[0]).join("") || "";

    setTranslated(translatedText);

    // Romanization
    let roman = translatedText;
    try {
      const translit = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(
          translatedText
        )}&itc=${targetLang}-t-i0-und`
      );
      const translitJson = await translit.json();

      if (translitJson[0] === "SUCCESS") {
        roman = translitJson[1][0][1][0];
      }
    } catch (e) {}

    setRomanized(roman);

    speakText(translatedText, targetLang);
  } catch (error) {
    console.error(error);
    setTranslated("❌ Translation failed.");
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
        backgroundImage: "url('https://wallpapercave.com/wp/wp12782258.jpg')",
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

      {/* MEDIA QUERIES (unchanged) */}
      <style>{` /* same media queries */ `}</style>
      <TurnBackButton />
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

// LANGUAGES (same)
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
  ["zh", "Chinese (中文)"],
  ["ja", "Japanese (日本語)"],
  ["ko", "Korean (한국어)"],
  ["fr", "French"],
  ["de", "German"],
  ["es", "Spanish"],
  ["it", "Italian"],
  ["ru", "Russian"],
  ["ar", "Arabic"],
  ["pt", "Portuguese"],
  ["tr", "Turkish"],
  ["id", "Indonesian"],
  ["vi", "Vietnamese"],
  ["fa", "Persian"],
];
