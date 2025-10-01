import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { colors, radius, shadow, spacing } from "../constants/theme";

type ThemeMode = "light" | "dark";

type AppThemeContextValue = {
  theme: ThemeMode;
  toggle: () => void;
  colors: typeof colors;
  radius: typeof radius;
  shadow: typeof shadow;
  spacing: typeof spacing;
};

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>(system === "dark" ? "dark" : "light");

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<AppThemeContextValue>(() => ({ theme, toggle, colors, radius, shadow, spacing }), [theme, toggle]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    // Fallback to constants if provider is missing; theme defaults to system light.
    return {
      theme: "light" as ThemeMode,
      toggle: () => {},
      colors,
      radius,
      shadow,
      spacing,
    };
  }
  return ctx;
}



