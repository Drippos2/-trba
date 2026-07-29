import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Importuj BrowserRouter
import "./index.css";
import App from "./App";
import { LangProvider } from "./LangContext"; // 2. Importuj svoj LangProvider (uprav cestu ak treba)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* 3. Obal aplikáciu routerom */}
      <LangProvider>
        <App />
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>
);