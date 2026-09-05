import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { theme as defaultTheme, Theme } from './theme';
import { FONT_FAMILY, typography } from './typography';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

const ThemeContext = createContext<Theme>(defaultTheme);

export interface ThemeProviderProps {
  children: ReactNode;
  overrideTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, overrideTheme }) => {
  const [fontsLoaded] = useFonts({
    [FONT_FAMILY.regular]: Inter_400Regular,
    [FONT_FAMILY.medium]: Inter_500Medium,
    [FONT_FAMILY.semiBold]: Inter_600SemiBold,
    [FONT_FAMILY.bold]: Inter_700Bold,
  });

  const [activeTheme, setActiveTheme] = useState<Theme>(overrideTheme || defaultTheme);

  useEffect(() => {
    if (fontsLoaded) {
      // Swap system fonts → Inter once loaded
      const updatedTheme: Theme = {
        ...(overrideTheme || defaultTheme),
        typography: {
          ...typography,
          fonts: FONT_FAMILY,
        },
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTheme(updatedTheme);
    }
  }, [fontsLoaded, overrideTheme]);

  // Progressive enhancement: render immediately with system fonts,
  // upgrade to Inter once loaded. No blank loading screen.
  return (
    <ThemeContext.Provider value={activeTheme}>
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
