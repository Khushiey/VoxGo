import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        width: "100%",
        padding: "18px 0",
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: "0 2px 16px rgba(67,233,123,0.15)",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
        flexWrap: "wrap",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: "3.5vw",
          color: "#fff",
          letterSpacing: "4px",
          textShadow: "0 2px 12px #43e97b",
          marginLeft: "40px",
        }}
      >
        🚀 VoxGo
      </div>

      {/* Hamburger Button */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none",
          flexDirection: "column",
          cursor: "pointer",
          marginRight: "25px",
          gap: "6px",
        }}
      >
        <div style={{ width: "28px", height: "3px", background: "#43e97b", borderRadius: "2px" }}></div>
        <div style={{ width: "28px", height: "3px", background: "#43e97b", borderRadius: "2px" }}></div>
        <div style={{ width: "28px", height: "3px", background: "#43e97b", borderRadius: "2px" }}></div>
      </div>

      {/* Navigation Links */}
      <div
        className={`nav-links ${menuOpen ? "open" : ""}`}
        style={{
          display: "flex",
          gap: "2vw",
          marginRight: "40px",
          alignItems: "center",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Link to="/" style={linkStyle} onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/location" style={linkStyle} onClick={() => setMenuOpen(false)}>
          Location
        </Link>

        <Link to="/translator" style={linkStyle} onClick={() => setMenuOpen(false)}>
          Translator
        </Link>

        <Link to="/qa" style={linkStyle} onClick={() => setMenuOpen(false)}>
          Q/A
        </Link>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;500&display=swap');

          nav a:hover {
            background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
            color: #222 !important;
          }

          @media (min-width: 769px) {
            .nav-links {
              display: flex !important;
            }
          }

          @media (max-width: 768px) {
            nav {
              flex-direction: row;
              justify-content: space-between;
              padding: 12px 20px;
            }

            .nav-links {
              position: absolute;
              top: 70px;
              left: 0;
              width: 100%;
              background: rgba(0, 0, 0, 0.9);
              flex-direction: column;
              align-items: center;
              gap: 15px;
              padding: 20px 0;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
              border-top: 1px solid rgba(67, 233, 123, 0.2);
              opacity: 0;
              transform: translateY(-20px);
              pointer-events: none;
              transition: all 0.3s ease;
            }

            .nav-links.open {
              opacity: 1;
              transform: translateY(0);
              pointer-events: all;
            }

            .hamburger {
              display: flex !important;
            }

            nav div:first-child {
              font-size: 6vw;
              text-shadow: 0 0 15px #43e97b, 0 0 35px #38f9d7;
              color: #00ffae;
              animation: glowPulse 2s infinite alternate;
              margin-left: 10px;
            }

            nav a {
              font-size: 4.2vw !important;
              padding: 2.5vw 6vw;
              width: 70%;
              text-align: center;
              background: rgba(67,233,123,0.12);
              border-radius: 10px;
            }
          }

          @keyframes glowPulse {
            0% { text-shadow: 0 0 8px #43e97b, 0 0 20px #38f9d7; }
            100% { text-shadow: 0 0 20px #38f9d7, 0 0 40px #43e97b; }
          }
        `}
      </style>
    </nav>
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
