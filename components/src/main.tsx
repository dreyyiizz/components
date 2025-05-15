import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Main from "./App.tsx";
import "whatwg-fetch";

declare global {
  interface Window {
    Cypress?: unknown;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
// Always import whatwg-fetch if Cypress is present, but use static import at the top
if (window.Cypress) {
  // whatwg-fetch is already imported at the top if needed
}

