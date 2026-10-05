"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export function AppToaster() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return <Toaster theme={theme} position="bottom-right" closeButton richColors toastOptions={{ classNames: { toast: "premium-toast border-[var(--saas-line)]", title: "font-bold", description: "text-sm" } }} />;
}
