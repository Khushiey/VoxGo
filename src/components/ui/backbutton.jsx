import React from "react";
import { useNavigate } from "react-router-dom";

export default function TurnBackButton() {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const baseStyle = {
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
    marginBottom: "15px",
  };

  const handleHover = (e, hover) => {
    e.target.style.transform = hover ? "scale(1.05)" : "scale(1)";
    e.target.style.boxShadow = hover
      ? "0 6px 16px rgba(0,0,0,0.25)"
      : "0 4px 12px rgba(0,0,0,0.2)";
  };

  return (
    <>
      <button
        onClick={goBack}
        style={baseStyle}
        onMouseOver={(e) => handleHover(e, true)}
        onMouseOut={(e) => handleHover(e, false)}
        className="turnback-btn"
      >
        🔙 Back
      </button>

      {/* RESPONSIVE STYLES */}
      <style>
        {`
          /* Tablet */
          @media (max-width: 1024px) {
            .turnback-btn {
              font-size: 1rem !important;
              padding: 9px 18px !important;
            }
          }

          /* Mobile */
          @media (max-width: 768px) {
            .turnback-btn {
              font-size: 0.9rem !important;
              padding: 8px 16px !important;
              border-radius: 10px !important;
            }
          }

          /* Small Mobile */
          @media (max-width: 480px) {
            .turnback-btn {
              font-size: 0.85rem !important;
              padding: 7px 14px !important;
              border-radius: 10px !important;
            }
          }
        `}
      </style>
    </>
  );
}
