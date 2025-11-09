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
        }}
      >
        🚀 VoxGo
      </div>
      <div
        className="nav-links"
        style={{
          display: "flex",
          gap: "2vw",
          marginRight: "40px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#fff",
            fontSize: "1vw",
            fontWeight: 500,
            textDecoration: "none",
            padding: "0.5vw 1vw",
            borderRadius: "8px",
            transition: "background 0.2s, color 0.2s",
            background: "rgba(67,233,123,0.08)",
          }}
        >
          Home
        </Link>
        <Link
          to="/location"
          style={{
            color: "#fff",
            fontSize: "1vw",
            fontWeight: 500,
            textDecoration: "none",
            padding: "0.5vw 1vw",
            borderRadius: "8px",
            transition: "background 0.2s, color 0.2s",
            background: "rgba(67,233,123,0.08)",
          }}
        >
          Location
        </Link>
        <Link
          to="/translator"
          style={{
            color: "#fff",
            fontSize: "1vw",
            fontWeight: 500,
            textDecoration: "none",
            padding: "0.5vw 1vw",
            borderRadius: "8px",
            transition: "background 0.2s, color 0.2s",
            background: "rgba(67,233,123,0.08)",
          }}
        >
          Translator
        </Link>
        <Link
          to="/qa"
          style={{
            color: "#fff",
            fontSize: "1vw",
            fontWeight: 500,
            textDecoration: "none",
            padding: "0.5vw 1vw",
            borderRadius: "8px",
            transition: "background 0.2s, color 0.2s",
            background: "rgba(67,233,123,0.08)",
          }}
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

          /* ✅ Responsive Styles */
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

          @media (max-width: 768px) {
            nav {
              flex-direction: column;
              padding: 12px 0;
            }
            nav div:first-child {
              font-size: 5vw;
              margin-left: 0;
              margin-bottom: 10px;
            }
            .nav-links {
              flex-wrap: wrap;
              justify-content: center;
              gap: 4vw;
              margin: 0;
            }
            nav a {
              font-size: 3.5vw !important;
              padding: 1vw 3vw;
            }
          }

          @media (max-width: 480px) {
            nav {
              padding: 10px 0;
            }
            nav div:first-child {
              font-size: 6vw;
              margin-bottom: 8px;
            }
            .nav-links {
              flex-direction: column;
              align-items: center;
              gap: 10px;
            }
            nav a {
              font-size: 4vw !important;
              padding: 2vw 4vw;
            }
          }
        `}
      </style>
    </nav>
  );
}
