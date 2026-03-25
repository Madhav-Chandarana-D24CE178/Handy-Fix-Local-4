import { createRoot } from "react-dom/client";
import { AppProvider } from "./contexts/AppContext.tsx";
import App from "./App.tsx";
import "./index.css";
import "./styles/tokens.css";
import "./styles/components.css";
import "./styles/typography.css";
import "./styles/responsive-layouts.css";
import "./styles/accessibility.css";
import "./styles/performance.css";

// Initialize shared database
declare global {
  interface Window {
    HF_DB?: any;
  }
}

if (window.HF_DB && !window.HF_DB._initialized) {
  window.HF_DB.init();
  window.HF_DB._initialized = true;
}

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
