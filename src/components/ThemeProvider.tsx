import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { resolveTheme, themeStorageKey, type Theme } from "@/lib/theme";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    setTheme(resolveTheme(document.documentElement.dataset["theme"] ?? null));
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset["theme"] = next;
    document.documentElement.classList.toggle("dark", next === "dark");
    setTheme(next);
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      /* Theme switching still works without storage. */
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme requires ThemeProvider");
  return context;
}
