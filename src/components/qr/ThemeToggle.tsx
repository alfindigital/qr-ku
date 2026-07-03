import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

const ORDER: ThemeMode[] = ["light", "dark", "system"];
const DEFAULT_MODE: ThemeMode = "light";

function getSystemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(mode: ThemeMode) {
  const isDark = mode === "dark" || (mode === "system" && getSystemDark());
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("theme", mode);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_MODE);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    const initial: ThemeMode = saved && ORDER.includes(saved) ? saved : DEFAULT_MODE;
    setMode(initial);
    applyTheme(initial);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = localStorage.getItem("theme") as ThemeMode | null;
      if (!current || current === "system") {
        applyTheme("system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
    applyTheme(next);
  }

  const icon =
    mode === "dark" ? (
      <Sun className="h-4 w-4" />
    ) : mode === "light" ? (
      <Moon className="h-4 w-4" />
    ) : (
      <Monitor className="h-4 w-4" />
    );

  const label =
    mode === "dark" ? "Mode gelap" : mode === "light" ? "Mode terang" : "Ikuti sistem";

  return (
    <button
      onClick={cycle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent"
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

