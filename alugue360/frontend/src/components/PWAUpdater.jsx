import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PWAUpdater() {
  const location = useLocation();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(reg => {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          if (newSW) {
            newSW.addEventListener("statechange", () => {
              if (newSW.state === "installed" && navigator.serviceWorker.controller) {
                newSW.postMessage({ type: "SKIP_WAITING" });
              }
            });
          }
        });
      });
    }
  }, []);

  return null;
}