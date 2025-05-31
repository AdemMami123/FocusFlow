import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme color schemes
export const themes = {
  light: {
    name: 'light',
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#212529',
    secondaryText: '#6C757D',
    accent: '#4263EB',
    accentSecondary: '#38D9A9',
    buttonText: '#FFFFFF',
    warning: '#FA5252',
    border: '#CED4DA',
    inputBg: '#F8F9FA',
    modalBg: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    name: 'dark',
    background: '#121212',
    card: '#1E1E1E',
    text: '#E9ECEF',
    secondaryText: '#ADB5BD',
    accent: '#5C7CFA',
    accentSecondary: '#63E6BE',
    buttonText: '#FFFFFF',
    warning: '#FF8787',
    border: '#495057',
    inputBg: '#2D2D2D',
    modalBg: 'rgba(0, 0, 0, 0.7)',
  },
  blue: {
    name: 'blue',
    background: '#E7F5FF',
    card: '#FFFFFF',
    text: '#1A1B1E',
    secondaryText: '#495057',
    accent: '#339AF0',
    accentSecondary: '#20C997',
    buttonText: '#FFFFFF',
    warning: '#FF6B6B',
    border: '#ADB5BD',
    inputBg: '#F1F3F5',
    modalBg: 'rgba(0, 0, 0, 0.5)',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.light);

  useEffect(() => {
    // Load saved theme from AsyncStorage
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setCurrentTheme(themes[savedTheme] || themes.light);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, []);

  const changeTheme = async (themeName) => {
    const newTheme = themes[themeName];
    if (newTheme) {
      setCurrentTheme(newTheme);
      try {
        await AsyncStorage.setItem('theme', themeName);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);