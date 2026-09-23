import { useEffect, useRef } from "react";
import { legacyMarkup } from "../legacyMarkup";
import legacyAppSource from "../legacy-v1-app.js?raw";
import "../legacy-v1.css";

export default function LegacyHome() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.innerHTML = legacyMarkup;

    try {
      const runLegacyApp = new Function(legacyAppSource);
      runLegacyApp();
    } catch (error) {
      console.error("[CASACAS V1.1.0] Failed to initialize legacy interactions", error);
    }

    return () => {
      root.innerHTML = "";
      document.body.classList.remove("locked");
    };
  }, []);

  return <div ref={rootRef} className="casacas-legacy-root" />;
}
