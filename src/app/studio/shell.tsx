"use client";

import { useEffect, useState } from "react";

export function StudioShell() {
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setHint(!standalone && window.matchMedia("(max-width: 900px)").matches);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/studio-sw.js", { scope: "/studio" }).catch(() => {});
    }
  }, []);

  if (!hint) return null;

  return (
    <p className="bd-install">
      To keep this on your phone, open the Chrome menu and tap Add to Home screen. The Studio icon then opens straight
      to these numbers.
    </p>
  );
}
