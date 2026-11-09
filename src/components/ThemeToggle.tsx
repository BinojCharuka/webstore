import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="shrink-0 rounded-full text-foreground"
    >
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
