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
        `}
      </style>
    </nav>
  );
}
