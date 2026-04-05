import React, { useState } from "react";
import VoiceButton from "../components/VoiceButton";
import TurnBackButton from "../components/ui/backbutton";

// Constants defined FIRST
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

export default function Translator() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [romanized, setRomanized] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("hi");
  const [showNativeScript, setShowNativeScript] = useState(false);

  // --- Function: Speak Text ---
  const speakText = (text, langCode) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    window.speechSynthesis.speak(utterance);
  };

  // --- Function: Romanization (English script version) ---
  const getRomanized = (text, lang) => {
    if (!text) return text;
    return transliterateManual(text, lang);
  };

  // --- Manual Transliteration for Common Scripts ---
  const transliterateManual = (text, lang) => {
    const maps = {
      hi: {
        अ: "a", आ: "aa", इ: "i", ई: "ee", उ: "u", ऊ: "oo",
        ए: "e", ऐ: "ai", ओ: "o", औ: "au",
        क: "ka", ख: "kha", ग: "ga", घ: "gha", ङ: "nga",
        च: "cha", छ: "chha", ज: "ja", झ: "jha", ञ: "nya",
        ट: "ta", ठ: "tha", ड: "da", ढ: "dha", ण: "na",
        त: "ta", थ: "tha", द: "da", ध: "dha", न: "na",
        प: "pa", फ: "pha", ब: "ba", भ: "bha", म: "ma",
        य: "ya", र: "ra", ल: "la", व: "va",
        श: "sha", ष: "sha", स: "sa", ह: "ha"
      },
      bn: {
        অ: "a", আ: "aa", ই: "i", ঈ: "ee", উ: "u", ঊ: "oo",
        ঋ: "ri", এ: "e", ঐ: "ai", ও: "o", ঔ: "ou",
        ক: "ka", খ: "kha", গ: "ga", ঘ: "gha", ঙ: "nga",
        চ: "cha", ছ: "chha", জ: "ja", ঝ: "jha", ঞ: "nya",
        ট: "ta", ঠ: "tha", ড: "da", ঢ: "dha", ণ: "na",
        ত: "ta", থ: "tha", দ: "da", ধ: "dha", ন: "na",
        প: "pa", ফ: "pha", ব: "ba", ভ: "bha", ম: "ma",
        য: "ya", র: "ra", ল: "la"
      },
      ta: {
        அ: "a", ஆ: "aa", இ: "i", ஈ: "ii", உ: "u", ஊ: "uu",
        எ: "e", ஏ: "ee", ஒ: "o", ஓ: "oo", ஔ: "au",
        க: "ka", ங: "nga", ச: "cha", ஞ: "nya", ட: "ta",
        ண: "na", த: "tha", ந: "na", ப: "pa", ம: "ma",
        ய: "ya", ர: "ra", ல: "la", வ: "va", ழ: "la",
        ற: "ra", ன: "na"
      },
      te: {
        అ: "a", ఆ: "aa", ఇ: "i", ఈ: "ii", ఉ: "u", ఊ: "uu",
        ఎ: "e", ఏ: "ee", ఒ: "o", ఓ: "oo", ఔ: "au",
        కా: "kaa", కి: "ki", కీ: "kee", కు: "ku", కూ: "koo",
        క: "ka", ఖ: "kha", గ: "ga", ఘ: "gha", ఙ: "nga",
        చా: "chaa", చి: "chi", చీ: "chee", చు: "chu", చూ: "choo",
        చ: "cha", ఛ: "chha", జ: "ja", ఝ: "jha", ఞ: "nya",
        టా: "taa", టి: "ti", టీ: "tee", టు: "tu", టూ: "too",
        ట: "ta", ఠ: "tha", డ: "da", ఢ: "dha", ణ: "na",
        తా: "taa", తి: "ti", తీ: "tee", తు: "tu", తూ: "too",
        త: "ta", థ: "tha", ద: "da", ధ: "dha", న: "na",
        పా: "paa", పి: "pi", పీ: "pee", పు: "pu", పూ: "poo",
        ప: "pa", ఫ: "pha", బ: "ba", భ: "bha", మ: "ma",
        మా: "maa", మి: "mi", మీ: "mee", ము: "mu", మూ: "moo",
        య: "ya", ర: "ra", ల: "la", వ: "va",
        శ: "sha", ష: "sha", స: "sa", హ: "ha"
      },
      gu: {
        અ: "a", આ: "aa", ઇ: "i", ઈ: "ii", ઉ: "u", ઊ: "uu",
        એ: "e", ઐ: "ai", ઓ: "o", ઔ: "au",
        ક: "ka", ખ: "kha", ગ: "ga", ઘ: "gha", ઙ: "nga",
        ચ: "cha", છ: "chha", જ: "ja", ઝ: "jha", ઞ: "nya",
        ટ: "ta", ઠ: "tha", ડ: "da", ઢ: "dha", ણ: "na",
        ત: "ta", થ: "tha", દ: "da", ધ: "dha", ન: "na",
        પ: "pa", ફ: "pha", બ: "ba", ભ: "bha", મ: "ma",
        ય: "ya", ર: "ra", લ: "la", વ: "va", શ: "sha", ષ: "sha", સ: "sa", હ: "ha"
      },
      ml: {
        അ: "a", ആ: "aa", ഇ: "i", ഈ: "ii", ഉ: "u", ഊ: "uu",
        ഋ: "ri", എ: "e", ഏ: "ee", ഒ: "o", ഓ: "oo", ഔ: "au",
        ക: "ka", ഖ: "kha", ഗ: "ga", ഘ: "gha", ങ: "nga",
        ച: "cha", ഛ: "chha", ജ: "ja", ഝ: "jha", ഞ: "nya",
        ട: "ta", ഠ: "tha", ഡ: "da", ഢ: "dha", ണ: "na",
        ത: "ta", ഥ: "tha", ദ: "da", ധ: "dha", ന: "na",
        പ: "pa", ഫ: "pha", ബ: "ba", ഭ: "bha", മ: "ma",
        യ: "ya", ര: "ra", ല: "la", വ: "va", ശ: "sha", ഷ: "sha", സ: "sa", ഹ: "ha"
      },
      kn: {
        ಅ: "a", ಆ: "aa", ಇ: "i", ಈ: "ii", ಉ: "u", ಊ: "uu",
        ಋ: "ri", ಎ: "e", ಏ: "ee", ಒ: "o", ಓ: "oo", ಔ: "au",
        ಕ: "ka", ಖ: "kha", ಗ: "ga", ಘ: "gha", ಙ: "nga",
        ಚ: "cha", ಛ: "chha", ಜ: "ja", ಝ: "jha", ಞ: "nya",
        ಟ: "ta", ಠ: "tha", ಡ: "da", ಢ: "dha", ಣ: "na",
        ತ: "ta", ಥ: "tha", ದ: "da", ಧ: "dha", ನ: "na",
        ಪ: "pa", ಫ: "pha", ಬ: "ba", ಭ: "bha", ಮ: "ma",
        ಯ: "ya", ರ: "ra", ಲ: "la", ವ: "va", ಶ: "sha", ಷ: "sha", ಸ: "sa", ಹ: "ha"
      },
      mr: {
        अ: "a", आ: "aa", इ: "i", ई: "ii", उ: "u", ऊ: "uu",
        ए: "e", ऐ: "ai", ओ: "o", औ: "au",
        क: "ka", ख: "kha", ग: "ga", घ: "gha", ङ: "nga",
        च: "cha", छ: "chha", ज: "ja", झ: "jha", ञ: "nya",
        ट: "ta", ठ: "tha", ड: "da", ढ: "dha", ण: "na",
        त: "ta", थ: "tha", द: "da", ध: "dha", न: "na",
        प: "pa", फ: "pha", ब: "ba", भ: "bha", म: "ma",
        य: "ya", र: "ra", ल: "la", व: "va", श: "sha", ष: "sha", स: "sa", ह: "ha"
      }
    };

    if (!maps[lang]) return text;

    let result = text;
    const map = maps[lang];
    
    // Sort by length (longer strings first) to handle multi-character sequences
    const sortedChars = Object.keys(map).sort((a, b) => b.length - a.length);
    
    for (let char of sortedChars) {
      const regex = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, map[char]);
    }
    
    // Remove any remaining diacritical marks from all Indic scripts
    result = result.replace(/[\u0900-\u097F\u0980-\u09FF\u0A80-\u0AFF\u0A00-\u0A7F\u0B80-\u0BFF\u0B00-\u0B7F\u0C80-\u0CFF\u0C00-\u0C7F]/g, '');
    
    return result || text;
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

    // Use romanization function (now synchronous)
    const roman = getRomanized(translatedText, targetLang);
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
            marginBottom: "12px",
            letterSpacing: "3px",
            textShadow: "0 2px 12px #43e97b",
          }}
        >
          🌍 Universal Translator
        </h2>
        <p style={{ fontSize: "1.1vw", color: "#aef2ae", marginBottom: "20px" }}>
          📝 Translations shown in English letters (Romanized) • नई सुविधा!
        </p>

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
            <p style={{ fontSize: "1.6vw", color: "#fff", marginBottom: "12px", fontWeight: "bold" }}>
              <strong>🔡 English Letters:</strong> {romanized || translated}
            </p>

            {translated !== romanized && (
              <>
                <button
                  onClick={() => setShowNativeScript(!showNativeScript)}
                  style={{
                    padding: "0.6vw 1.4vw",
                    background: showNativeScript ? "#43e97b" : "rgba(255,255,255,0.2)",
                    color: showNativeScript ? "#000" : "#fff",
                    border: "1px solid #43e97b",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.9vw",
                    fontWeight: "600",
                    marginBottom: "10px",
                    transition: "all 0.3s"
                  }}
                >
                  {showNativeScript ? "✓ Showing Native Script" : "Show Native Script"}
                </button>

                {showNativeScript && (
                  <p style={{ fontSize: "1.4vw", color: "#b2f2bb", marginTop: "10px" }}>
                    <strong>📝 Native Script:</strong> {translated}
                  </p>
                )}
              </>
            )}
          </div>
        )}
         <TurnBackButton />
      </div>

      {/* MEDIA QUERIES (unchanged) */}
      <style>{` /* same media queries */ `}</style>
     
    </div>
    
  );
}
