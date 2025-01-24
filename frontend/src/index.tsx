// frontend/src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si deseas medir el rendimiento de tu aplicación, puedes pasar una función
// a reportWebVitals para registrar resultados (por ejemplo: reportWebVitals(console.log))
reportWebVitals();
