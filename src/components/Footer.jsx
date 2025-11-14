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
          justifyContent: "center",
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
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;500&display=swap');

          /* KEEPING ALL RESPONSIVE STYLING SAME — ONLY LINKS REMOVED */

          @media (max-width: 1024px) {
            .footer-container {
              flex-direction: column;
              text-align: center;
            }
            footer p {
              font-size: 1.5vw !important;
            }
          }

          @media (max-width: 768px) {
            .footer-container {
              flex-direction: column;
              gap: 10px;
              padding: 10px 0;
            }
            footer p {
              font-size: 2.8vw !important;
            }
          }

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
          }

          @media (max-width: 360px) {
            footer p {
              font-size: 4vw !important;
            }
          }
        `}
      </style>
    </footer>
  );
}
