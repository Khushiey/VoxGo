import React from "react";

export default function Footer() {
  return (
    <footer
      className="footer"
      style={{
        background: "rgba(0,0,0,0.75)",
        color: "#fff",
        textAlign: "center",
        padding: "20px 0",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
        boxShadow: "0 -2px 16px rgba(67,233,123,0.15)",
        position: "relative",
        bottom: 0,
        width: "100%",
      }}
    >
      <div
        className="footer-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "1vw",
            textShadow: "0 2px 10px #43e97b",
          }}
        >
          © 2025 <strong>VoxGo</strong>. All rights reserved.
        </p>

        <div
          className="footer-links"
          style={{
            display: "flex",
            gap: "2vw",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a href="#home" style={linkStyle}>
            Home
          </a>
          <a href="#location" style={linkStyle}>
            Location
          </a>
          <a href="#translator" style={linkStyle}>
            Translator
          </a>
          <a href="#qa" style={linkStyle}>
            Q/A
          </a>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;500&display=swap');

          footer a:hover {
            background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
            color: #222 !important;
          }

          /* ✅ Medium screens (tablets, small laptops) */
          @media (max-width: 1024px) {
            .footer-container {
              flex-direction: column;
              text-align: center;
            }
            footer p {
              font-size: 1.5vw !important;
            }
            .footer-links a {
              font-size: 1.6vw !important;
            }
          }

          /* ✅ Small tablets & large phones */
          @media (max-width: 768px) {
            .footer-container {
              flex-direction: column;
              gap: 10px;
              padding: 10px 0;
            }
            footer p {
              font-size: 2.8vw !important;
            }
            .footer-links {
              flex-wrap: wrap;
              justify-content: center;
              gap: 4vw;
            }
            .footer-links a {
              font-size: 3vw !important;
              padding: 1.5vw 3.5vw;
            }
          }

          /* ✅ Android phones & small screens */
          @media (max-width: 480px) {
            .footer-container {
              flex-direction: column;
              align-items: center;
              gap: 8px;
              padding: 8px 0;
            }
            footer p {
              font-size: 3.5vw !important;
              text-align: center;
            }
            .footer-links {
              flex-direction: column;
              gap: 10px;
              width: 100%;
              align-items: center;
            }
            .footer-links a {
              font-size: 4.2vw !important;
              padding: 2vw 5vw;
              width: 70%;
              text-align: center;
              border-radius: 8px;
              background: rgba(67,233,123,0.12);
            }
          }

          /* ✅ Very small Android devices (320–360px width) */
          @media (max-width: 360px) {
            footer p {
              font-size: 4vw !important;
            }
            .footer-links a {
              font-size: 4.6vw !important;
              padding: 2.5vw 6vw;
            }
          }
        `}
      </style>
    </footer>
  );
}

const linkStyle = {
  color: "#fff",
  fontSize: "1vw",
  fontWeight: 500,
  textDecoration: "none",
  padding: "0.5vw 1vw",
  borderRadius: "8px",
  transition: "background 0.2s, color 0.2s",
  background: "rgba(67,233,123,0.08)",
};
