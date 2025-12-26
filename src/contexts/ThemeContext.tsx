import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'pink';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('default');
  const [isDark, setIsDarkState] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedIsDark = localStorage.getItem('isDark') === 'true';
    if (savedTheme && ['default', 'blue', 'green', 'purple', 'pink'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
    setIsDarkState(savedIsDark);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setIsDark = (newIsDark: boolean) => {
    setIsDarkState(newIsDark);
    localStorage.setItem('isDark', newIsDark.toString());
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', isDark);
  }, [theme, isDark]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};