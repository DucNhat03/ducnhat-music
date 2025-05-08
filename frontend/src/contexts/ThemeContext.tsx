import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Check local storage for saved theme preference, default to dark
  const getSavedTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' ? 'light' : 'dark') as Theme;
  };

  const [theme, setTheme] = useState<Theme>(getSavedTheme());

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme class to the document when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Force re-render by removing both classes first
    root.classList.remove('dark');
    root.classList.remove('light');
    
    // Then add the appropriate class
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#fff';
    } else {
      root.classList.add('light');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#333';
    }
    
    // Update CSS variables for components that use them
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--bg-primary', '#121212');
      document.documentElement.style.setProperty('--bg-secondary', '#1e1e1e');
      document.documentElement.style.setProperty('--text-primary', '#ffffff');
      document.documentElement.style.setProperty('--text-secondary', '#a0aec0');
    } else {
      document.documentElement.style.setProperty('--bg-primary', '#ffffff');
      document.documentElement.style.setProperty('--bg-secondary', '#f7fafc');
      document.documentElement.style.setProperty('--text-primary', '#1a202c');
      document.documentElement.style.setProperty('--text-secondary', '#4a5568');
    }
    
    // Also update the meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
    }
    
    console.log('Theme toggled to:', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme === 'dark'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 