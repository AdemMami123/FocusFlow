import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Appearance,
  Switch,
  ScrollView,
  useColorScheme as _useColorScheme
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Our custom hook to manage theme
const useColorScheme = () => {
  // Get system color scheme
  const systemScheme = _useColorScheme();
  
  // State to store our current theme
  const [colorScheme, setColorScheme] = useState('system');
  
  // Effect to load saved theme preference
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme) {
          setColorScheme(savedTheme);
          if (savedTheme !== 'system') {
            Appearance.setColorScheme(savedTheme);
          }
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };
    
    loadSavedTheme();
    
    // Listen for appearance changes
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (colorScheme === 'system') {
        // Only update if we're following system
        setColorScheme('system');
      }
    });
    
    return () => subscription.remove();
  }, []);
  
  // Function to change theme
  const changeTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('themePreference', newTheme);
      setColorScheme(newTheme);
      
      if (newTheme === 'system') {
        // Reset to system preference
        Appearance.setColorScheme(null);
      } else {
        // Force specific theme
        Appearance.setColorScheme(newTheme);
      }
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };
  
  // Calculate the effective theme (what's actually shown)
  const effectiveTheme = colorScheme === 'system' ? systemScheme || 'light' : colorScheme;
  
  return {
    colorScheme,
    effectiveTheme,
    changeTheme,
    systemScheme
  };
};

export default function Settings() {
  const { colorScheme, effectiveTheme, changeTheme } = useColorScheme();
  const [followSystem, setFollowSystem] = useState(colorScheme === 'system');
  
  // Toggle between following system or using explicit theme
  const toggleFollowSystem = (value) => {
    setFollowSystem(value);
    if (value) {
      changeTheme('system');
    } else {
      // If disabling system following, set to effective theme
      changeTheme(effectiveTheme);
    }
  };
  
  // Theme options
  const themeOptions = [
    { id: 'light', label: 'Light', icon: 'sun' },
    { id: 'dark', label: 'Dark', icon: 'moon' }
  ];
  
  // Theme-based colors for our UI
  const colors = {
    background: effectiveTheme === 'dark' ? '#121212' : '#F8F9FA',
    card: effectiveTheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
    text: effectiveTheme === 'dark' ? '#F1F3F5' : '#212529',
    subText: effectiveTheme === 'dark' ? '#ADB5BD' : '#6C757D',
    primary: '#4263EB',
    border: effectiveTheme === 'dark' ? '#343A40' : '#DEE2E6'
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Settings</Text>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Theme
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <FontAwesome5 
              name="palette" 
              size={18} 
              color={colors.primary}
              style={styles.settingIcon} 
            />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Follow system theme
            </Text>
          </View>
          
          <Switch
            value={followSystem}
            onValueChange={toggleFollowSystem}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor="#f4f3f4"
          />
        </View>
        
        {!followSystem && (
          <View style={styles.themeOptions}>
            {themeOptions.map(theme => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: colorScheme === theme.id ? colors.primary : 'transparent',
                    borderColor: colors.border
                  }
                ]}
                onPress={() => changeTheme(theme.id)}
              >
                <FontAwesome5 
                  name={theme.icon}
                  size={16}
                  color={colorScheme === theme.id ? '#FFFFFF' : colors.text}
                />
                <Text 
                  style={[
                    styles.themeOptionText, 
                    { color: colorScheme === theme.id ? '#FFFFFF' : colors.text }
                  ]}
                >
                  {theme.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <Text style={[styles.helpText, { color: colors.subText }]}>
          {followSystem 
            ? 'Your app will match your device theme settings' 
            : 'Select your preferred app theme'}
        </Text>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          About
        </Text>
        
        <View style={styles.settingRow}>
          
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <FontAwesome5 
              name="code" 
              size={18} 
              color={colors.primary}
              style={styles.settingIcon} 
            />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Developer
            </Text>
          </View>
          <Text style={[styles.settingValue, { color: colors.subText }]}>Adem Mami</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 16,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeOptionText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  }
});