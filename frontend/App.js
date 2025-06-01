import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import timerScreen from "./screens/timerScreen";
import historyScreens from "./screens/historyScreens";
import settings from "./screens/settings";
import projects from "./screens/projects";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "react-native";

const Stack = createBottomTabNavigator();

// Create the main app component that uses the theme
function MainApp() {
  const { theme, isDark } = useTheme();

  // Create custom navigation themes
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: theme.primary,
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: theme.primary,
    },
  };

  return (
    <NavigationContainer theme={isDark ? customDarkTheme : customLightTheme}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />
      <Stack.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.inactive,
          tabBarStyle: {
            height: 60,
            paddingVertical: 5,
            elevation: 10,
            shadowOpacity: 0.1,
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.border,
          },
          headerStyle: {
            backgroundColor: theme.headerBackground,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomColor: theme.border,
            borderBottomWidth: 0.5,
          },
          headerTintColor: theme.text,
        }}
      >
        <Stack.Screen
          name="Timer"
          component={timerScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="clock" size={22} color={color} />
            ),
          }}
        />
        <Stack.Screen
          name="History"
          component={historyScreens}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="history" size={22} color={color} />
            ),
          }}
        />
        <Stack.Screen
          name="Settings"
          component={settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="cog" size={22} color={color} />
            ),
          }}
        />
        <Stack.Screen
          name="Projects"
          component={projects}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="tasks" size={22} color={color} />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Wrap the app with the theme provider
export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
