import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
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
        flexWrap: "wrap", // ✅ helps small screens adjust
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "2vw",
          color: "#fff",
          letterSpacing: "4px",
          textShadow: "0 2px 12px #43e97b",
          marginLeft: "40px",
          flex: "1",
          textAlign: "left",
        }}
      >
        🚀 VoxGo
      </div>

      <div
        className="nav-links"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2vw",
          marginRight: "40px",
          justifyContent: "flex-end",
          flex: "1",
        }}
      >
        <Link
          to="/"
          style={linkStyle}
        >
          Home
        </Link>
        <Link
          to="/location"
          style={linkStyle}
        >
          Location
        </Link>
        <Link
          to="/translator"
          style={linkStyle}
        >
          Translator
        </Link>
        <Link
          to="/qa"
          style={linkStyle}
        >
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

          /* ✅ Medium devices (tablets) */
          @media (max-width: 1024px) {
            nav {
              padding: 14px 0;
            }
            nav div:first-child {
              font-size: 3vw;
              margin-left: 20px;
            }
            .nav-links {
              gap: 3vw;
              margin-right: 20px;
            }
            nav a {
              font-size: 1.4vw !important;
            }
          }

          /* ✅ Small tablets & large phones */
          @media (max-width: 768px) {
            nav {
              flex-direction: column;
              align-items: center;
              padding: 12px 0;
            }
            nav div:first-child {
              font-size: 5vw;
              margin: 0 0 10px 0;
              text-align: center;
            }
            .nav-links {
              justify-content: center;
              gap: 4vw;
              margin: 0;
              flex-wrap: wrap;
            }
            nav a {
              font-size: 3.5vw !important;
              padding: 1.5vw 3.5vw;
            }
          }

          /* ✅ Android & small phones (up to 480px) */
          @media (max-width: 480px) {
            nav {
              flex-direction: column;
              justify-content: center;
              padding: 10px 0;
            }
            nav div:first-child {
              font-size: 6vw;
              margin-bottom: 10px;
              text-align: center;
            }
            .nav-links {
              flex-direction: column;
              align-items: center;
              gap: 10px;
              margin: 0;
              width: 100%;
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

          /* ✅ Ultra-small devices (320px–360px width) */
          @media (max-width: 360px) {
            nav div:first-child {
              font-size: 6.5vw;
            }
            nav a {
              font-size: 4.6vw !important;
              padding: 3vw 5vw;
            }
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
