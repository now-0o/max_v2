import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// ✅ Kakao SDK init
console.log("All env:", process.env);

if (window.Kakao) {
  if (!window.Kakao.isInitialized()) {
    console.log("Kakao JS Key:", process.env.REACT_APP_KAKAO_JS_KEY);
    window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
    console.log("✅ Kakao SDK initialized");
  }
} else {
  console.error("❌ Kakao SDK not loaded");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
