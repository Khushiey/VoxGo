import React, { useState, useEffect, useRef } from "react";


export default function AIVoiceInput() {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn’t support Speech Recognition. Try using Google Chrome.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (!transcript) return;

      setRecordings((prev) => [
        ...prev,
        { role: "user", text: transcript, timestamp: new Date() },
      ]);

      try {
        const res = await fetch("https://aiaudiochatbot-backend.vercel.app/api/ask-groq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: transcript }),
        });

        const data = await res.json();
        const answer = data.answer || "Sorry, I couldn’t process that.";

        setRecordings((prev) => [
          ...prev,
          { role: "ai", text: answer, timestamp: new Date() },
        ]);

        speakText(answer);
      } catch (err) {
        console.error("Error fetching AI response:", err);
      }
    };

    rec.onend = () => {
      setIsRecording(false);
      stopTimer();
    };

    recognitionRef.current = rec;
  }, []);

  // Update current time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const startTimer = () => {
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };

  const stopTimer = () => clearInterval(timerRef.current);

  const getRealTimeContext = () => {
    const now = new Date();
    return {
      now: now.toISOString(),
      localTime: now.toLocaleString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language || "en-US",
      userAgent: navigator.userAgent,
    };
  };

  // Fetch weather data
  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      // Get user's location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;

      // Fetch weather data (using OpenWeatherMap API)
      // Note: You'll need to get a free API key from https://openweathermap.org/api
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY || 'demo_key';

      if (apiKey === 'demo_key') {
        // Demo mode - simulate weather data
        setWeather({
          temperature: Math.round(20 + Math.random() * 15),
          description: ['sunny', 'cloudy', 'partly cloudy', 'rainy'][Math.floor(Math.random() * 4)],
          city: 'Your Location',
          icon: '01d',
          humidity: Math.round(40 + Math.random() * 40),
          windSpeed: Math.round(5 + Math.random() * 15),
        });
        speakText(`Demo weather: ${Math.round(20 + Math.random() * 15)} degrees Celsius, ${['sunny', 'cloudy', 'partly cloudy', 'rainy'][Math.floor(Math.random() * 4)]}`);
        setWeatherLoading(false);
        return;
      }

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );

      if (!res.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await res.json();
      setWeather({
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        city: data.name,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      });

      speakText(`Current weather in ${data.name}: ${Math.round(data.main.temp)} degrees Celsius, ${data.weather[0].description}`);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setWeather({ error: "Unable to fetch weather data" });
      speakText("Unable to fetch weather information. Please check your location permissions.");
    } finally {
      setWeatherLoading(false);
    }
  };

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const handleStart = () => {
    if (isRecording) return;
    setIsRecording(true);
    recognitionRef.current?.start();
    startTimer();
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
    stopTimer();
  };

  const handleReset = () => {
    setRecordings([]);
    setTimer(0);
    stopTimer();
    speechSynthesis.cancel();
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1.1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userMessage = textInput.trim();
    setTextInput("");
    setIsLoading(true);

    // Add user message
    setRecordings((prev) => [
      ...prev,
      { role: "user", text: userMessage, timestamp: new Date() },
    ]);

    try {
      const res = await fetch("https://aiaudiochatbot-backend.vercel.app/api/ask-groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await res.json();
      const answer = data.answer || "Sorry, I couldn't process that.";

      // Add AI response
      setRecordings((prev) => [
        ...prev,
        { role: "ai", text: answer, timestamp: new Date() },
      ]);

      speakText(answer);
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setRecordings((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Error: Could not connect to the AI service.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .qa-container {
          min-height: 100vh;
          background: linear-gradient(145deg, #0f172a, #0b2538);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .qa-card {
          width: 100%;
          max-width: 1200px;
          background: #0b192f;
          border-radius: 24px;
          box-shadow: 0 8px 50px rgba(0, 0, 0, 0.6);
          padding: 3rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          color: #d1d5db;
        }

        .qa-title {
          text-align: center;
          font-size: 4.5rem;
          font-weight: 800;
          color: #00ffae;
          text-shadow: 0 0 20px #00ffae, 0 0 40px #00ffae;
        }

        .qa-subtitle {
          text-align: center;
          color: #a3a3a3;
          font-size: 1.8rem;
        }

        .qa-info-section {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .qa-time-weather {
          display: flex;
          gap: 2rem;
          background: rgba(17, 24, 39, 0.6);
          border-radius: 16px;
          padding: 1.5rem;
          border: 2px solid #1e3a8a;
          min-width: 600px;
        }

        .qa-time-display, .qa-weather-display {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .qa-time-icon, .qa-weather-icon {
          font-size: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: rgba(0, 255, 174, 0.1);
          border-radius: 12px;
          border: 2px solid #00ffae;
        }

        .qa-weather-icon img {
          width: 60px;
          height: 60px;
          border-radius: 12px;
        }

        .qa-time-content, .qa-weather-content {
          flex: 1;
        }

        .qa-time-label, .qa-weather-label {
          font-size: 1.2rem;
          color: #00ffae;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .qa-time-value {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          font-family: monospace;
        }

        .qa-date-value {
          font-size: 1rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }

        .qa-weather-temp {
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .qa-weather-desc {
          font-size: 1.2rem;
          color: #00ffae;
          text-transform: capitalize;
          margin-bottom: 0.25rem;
        }

        .qa-weather-city {
          font-size: 1rem;
          color: #9ca3af;
        }

        .qa-weather-loading, .qa-weather-error, .qa-weather-placeholder {
          font-size: 1.2rem;
          color: #9ca3af;
          font-style: italic;
        }

        .qa-weather-error {
          color: #ef4444;
        }

        .qa-weather-btn {
          background: rgba(0, 255, 174, 0.1);
          border: 2px solid #00ffae;
          border-radius: 8px;
          color: #00ffae;
          font-size: 1.5rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qa-weather-btn:hover:not(:disabled) {
          background: rgba(0, 255, 174, 0.2);
          transform: scale(1.1);
        }

        .qa-weather-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qa-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .qa-btn {
          background-color: #00ffae;
          color: #000;
          font-weight: 700;
          padding: 1.5rem 3rem;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          font-size: 2rem;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 0 25px rgba(0, 255, 174, 0.6);
        }

        .qa-btn:hover {
          background-color: #00e69d;
          box-shadow: 0 0 40px rgba(0, 255, 174, 0.8);
        }

        .qa-btn.stop {
          background-color: #ef4444;
          color: white;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.6);
        }

        .qa-btn.stop:hover {
          background-color: #dc2626;
        }

        .qa-timer {
          text-align: center;
          font-family: monospace;
          color: #9ca3af;
          font-size: 1.8rem;
        }

        .qa-status {
          text-align: center;
          font-weight: 700;
          font-size: 1.6rem;
          color: #00ffae;
        }

        .qa-history {
          max-height: 40rem;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background-color: rgba(17, 24, 39, 0.6);
          border-radius: 16px;
        }

        .qa-message {
          background: #142437;
          border: 2px solid #1e3a8a;
          border-radius: 12px;
          padding: 1rem;
          color: #e5e7eb;
          font-size: 1.5rem;
        }

        .qa-message.ai {
          background: #12283a;
          border-color: #00ffae;
        }

        .qa-message small {
          display: block;
          font-size: 1.1rem;
          color: #6b7280;
          margin-top: 5px;
          text-align: right;
        }

        .qa-reset-btn {
          align-self: center;
          background-color: #ef4444;
          color: #fff;
          padding: 1.2rem 2.5rem;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
        }

        .qa-reset-btn:hover {
          background-color: #dc2626;
          box-shadow: 0 0 40px rgba(239, 68, 68, 0.7);
        }

        .qa-history::-webkit-scrollbar {
          width: 12px;
        }

        .qa-history::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 8px;
        }

        /* Text Input Form Styles */
        .qa-text-input-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.5rem;
          background-color: rgba(17, 24, 39, 0.6);
          border-radius: 16px;
          border: 2px solid #1e3a8a;
        }

        .qa-text-divider {
          text-align: center;
          color: #6b7280;
          font-size: 1.3rem;
          padding: 0.5rem 0;
        }

        .qa-input-form {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .qa-input-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .qa-input-label {
          color: #9ca3af;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .qa-text-input {
          width: 100%;
          padding: 1rem 1.2rem;
          background-color: #0b192f;
          border: 2px solid #1e3a8a;
          border-radius: 12px;
          color: #e5e7eb;
          font-size: 1.3rem;
          font-family: inherit;
          outline: none;
          transition: all 0.3s ease;
        }

        .qa-text-input:focus {
          border-color: #00ffae;
          box-shadow: 0 0 15px rgba(0, 255, 174, 0.3);
        }

        .qa-text-input::placeholder {
          color: #4b5563;
        }

        .qa-send-btn {
          background-color: #00ffae;
          color: #000;
          font-weight: 700;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 1.4rem;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 0 20px rgba(0, 255, 174, 0.5);
          height: fit-content;
          white-space: nowrap;
        }

        .qa-send-btn:hover:not(:disabled) {
          background-color: #00e69d;
          box-shadow: 0 0 35px rgba(0, 255, 174, 0.8);
        }

        .qa-send-btn:disabled {
          background-color: #6b7280;
          cursor: not-allowed;
          box-shadow: 0 0 15px rgba(107, 114, 128, 0.4);
        }

        /* ✅ Responsive Design */
        @media (max-width: 1024px) {
          .qa-card {
            padding: 2rem 3rem;
          }
          .qa-title {
            font-size: 4rem;
          }
        }

        @media (max-width: 768px) {
          .qa-card {
            padding: 2rem;
          }
          .qa-title {
            font-size: 2.8rem;
          }
          .qa-subtitle {
            font-size: 1.4rem;
          }
          .qa-btn {
            font-size: 1.6rem;
            padding: 1.2rem 2.2rem;
          }
          .qa-time-weather {
            flex-direction: column;
            gap: 1rem;
            min-width: auto;
          }
          .qa-time-value {
            font-size: 1.8rem;
          }
          .qa-weather-temp {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .qa-card {
            padding: 1.5rem;
            border-radius: 16px;
          }
          .qa-title {
            font-size: 2.4rem;
          }
          .qa-subtitle {
            font-size: 1.2rem;
          }
          .qa-btn {
            width: 100%;
            font-size: 1.4rem;
            padding: 1rem 1.5rem;
          }
          .qa-reset-btn {
            width: 100%;
            font-size: 1.3rem;
          }
          .qa-history {
            max-height: 25rem;
          }
          .qa-message {
            font-size: 1.2rem;
          }
          .qa-input-form {
            flex-direction: column;
          }
          .qa-send-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="qa-container">
        <div className="qa-card">
          <h1 className="qa-title">🤖 AI Chat Assistant</h1>
          <p className="qa-subtitle">
            Speak 🎤 or type 📝 your questions and interact with the AI. Conversation history is below.
          </p>

          {/* Current Time and Weather Section */}
          <div className="qa-info-section">
            <div className="qa-time-weather">
              <div className="qa-time-display">
                <div className="qa-time-icon">🕐</div>
                <div className="qa-time-content">
                  <div className="qa-time-label">Current Time</div>
                  <div className="qa-time-value">
                    {currentTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                  <div className="qa-date-value">
                    {currentTime.toLocaleDateString([], {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="qa-weather-display">
                <div className="qa-weather-icon">
                  {weatherLoading ? (
                    '⏳'
                  ) : weather?.error ? (
                    '❌'
                  ) : weather?.icon ? (
                    <img
                      src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt="Weather icon"
                      style={{ width: '60px', height: '60px', borderRadius: '12px' }}
                    />
                  ) : (
                    '🌤️'
                  )}
                </div>
                <div className="qa-weather-content">
                  <div className="qa-weather-label">Weather</div>
                  {weatherLoading ? (
                    <div className="qa-weather-loading">Loading weather...</div>
                  ) : weather?.error ? (
                    <div className="qa-weather-error">{weather.error}</div>
                  ) : weather ? (
                    <div className="qa-weather-info">
                      <div className="qa-weather-temp">{weather.temperature}°C</div>
                      <div className="qa-weather-desc">{weather.description}</div>
                      <div className="qa-weather-city">{weather.city}</div>
                    </div>
                  ) : (
                    <div className="qa-weather-placeholder">Click to get weather</div>
                  )}
                </div>
                <button
                  onClick={fetchWeather}
                  disabled={weatherLoading}
                  className="qa-weather-btn"
                  title="Get current weather"
                >
                  {weatherLoading ? '⏳' : '🔄'}
                </button>
              </div>
            </div>
          </div>

          <div className="qa-controls">
            <button
              onClick={isRecording ? handleStop : handleStart}
              className={`qa-btn ${isRecording ? "stop" : ""}`}
            >
              {isRecording ? "🛑 Stop" : "🎤 Speak"}
            </button>

            <div>
              <p className="qa-timer">{formatTime(timer)}</p>
              <p
                className="qa-status"
                style={{ color: isRecording ? "#00ffae" : "#9ca3af" }}
              >
                {isRecording ? "Recording..." : "Not Recording"}
              </p>
            </div>
          </div>

          {/* Text Input Section */}
          <div className="qa-text-input-section">
            <p className="qa-text-divider">📝 Or Type Your Question Below:</p>
            <form onSubmit={handleTextSubmit} className="qa-input-form">
              <div className="qa-input-wrapper">
                <label className="qa-input-label">Type Your Question/Command</label>
                <input
                  type="text"
                  className="qa-text-input"
                  placeholder="e.g., What is the weather? Tell me a joke..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="qa-send-btn"
                disabled={isLoading || !textInput.trim()}
              >
                {isLoading ? "⏳ Sending..." : "📤 Send"}
              </button>
            </form>
          </div>

          <div className="qa-history">
            {recordings.length === 0 ? (
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "1.5rem" }}>
                No conversation yet.
              </p>
            ) : (
              recordings.map((rec, i) => (
                <div key={i} className={`qa-message ${rec.role === "ai" ? "ai" : ""}`}>
                  <strong>{rec.role === "ai" ? "🤖 AI:" : "🧠 You:"}</strong>{" "}
                  {rec.text}
                  <small>{rec.timestamp.toLocaleTimeString()}</small>
                </div>
              ))
            )}
          </div>

          <button onClick={handleReset} className="qa-reset-btn">
            🔄 Reset
          </button>
        </div>
        
      </div>
    </>
  );
}
