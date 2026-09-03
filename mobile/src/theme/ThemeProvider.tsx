import React, { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from './theme';

const ThemeContext = createContext<Theme>(theme);

export interface ThemeProviderProps {
  children: ReactNode;
  overrideTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, overrideTheme }) => {
  return (
    <ThemeContext.Provider value={overrideTheme || theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
