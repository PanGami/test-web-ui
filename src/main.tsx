/**
 * main.tsx — Entry point.
 * Registers GSAP plugins once before React mounts.
 */

import React from "react";
import ReactDOM from "react-dom/client";

// Register GSAP plugins before any component that uses them
import "./animations/registerGsap";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
