import React from "react";
import { useNavigate } from "react-router-dom";

export default function TurnBackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go to previous page
  };

  return (
    <button
      onClick={goBack}
      style={{
        padding: "10px 20px",
        borderRadius: "12px",
        background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
        color: "#000",
        fontWeight: "700",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        transition: "0.3s",
        fontSize: "1.1rem",
      }}
      onMouseOver={(e) => {
        e.target.style.transform = "scale(1.05)";
        e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
      }}
      onMouseOut={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      }}
    >
      🔙 Back
    </button>
  );
}
