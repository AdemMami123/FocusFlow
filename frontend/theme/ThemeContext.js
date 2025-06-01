import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './colors';

const THEME_PREFERENCE_KEY = '@dev_timer_theme_preference';
const SYSTEM_THEME_KEY = '@dev_timer_use_system_theme';

// Create context with default values
const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setSystemTheme: () => {},
  isSystemTheme: true,
});

export const ThemeProvider = ({ children }) => {
  // Get the initial color scheme from the device
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme() || 'light');
  // Track if we're using system theme or manually set theme
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  // Loading state while restoring preferences
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load saved preferences when app starts
  useEffect(() => {
    const loadSavedPreferences = async () => {
      try {
        const [themePreference, useSystemTheme] = await Promise.all([
          AsyncStorage.getItem(THEME_PREFERENCE_KEY),
          AsyncStorage.getItem(SYSTEM_THEME_KEY),
        ]);
        
        // Apply saved system theme preference if it exists
        if (useSystemTheme !== null) {
          setIsSystemTheme(useSystemTheme === 'true');
        }
        
        // Apply saved theme if not using system theme
        if (!isSystemTheme && themePreference !== null) {
          setColorScheme(themePreference);
          // Also update the app-wide appearance
          Appearance.setColorScheme(themePreference);
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load theme preferences:', error);
        setIsLoaded(true);
      }
    };
    
    loadSavedPreferences();
  }, []);
  
  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (isSystemTheme && newColorScheme) {
        setColorScheme(newColorScheme);
      }
    });

    return () => subscription.remove();
  }, [isSystemTheme]);

  // Determine if dark mode is active
  const isDark = isSystemTheme ? colorScheme === 'dark' : colorScheme === 'dark';
  
  // Set the current theme based on dark mode status
  const theme = isDark ? darkTheme : lightTheme;

  // Toggle between light and dark mode
  const toggleTheme = async () => {
    try {
      const newColorScheme = isDark ? 'light' : 'dark';
      setIsSystemTheme(false);
      setColorScheme(newColorScheme);
      
      // Save preferences
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newColorScheme);
      await AsyncStorage.setItem(SYSTEM_THEME_KEY, 'false');
      
      // Force the app-wide theme
      Appearance.setColorScheme(newColorScheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Reset to system theme
  const setSystemTheme = async () => {
    try {
      setIsSystemTheme(true);
      const systemColorScheme = Appearance.getColorScheme() || 'light';
      setColorScheme(systemColorScheme);
      
      // Save preferences
      await AsyncStorage.setItem(SYSTEM_THEME_KEY, 'true');
      
      // Reset to system preference
      Appearance.setColorScheme(null);
    } catch (error) {
      console.error('Failed to save system theme preference:', error);
    }
  };

  // Show a loading state or fallback while loading preferences
  if (!isLoaded) {
    return null; // Or return a splash screen/loading indicator
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark,
      toggleTheme,
      setSystemTheme,
      isSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for accessing theme context
export const useTheme = () => useContext(ThemeContext);
