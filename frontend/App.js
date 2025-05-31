import { NavigationContainer } from "@react-navigation/native";
import timerScreen from "./screens/timerScreen";
import historyScreens from "./screens/historyScreens";
import settings from "./screens/settings";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from '@expo/vector-icons';

const Stack = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4263EB',
          tabBarInactiveTintColor: '#ADB5BD',
          tabBarStyle: {
            height: 60,
            paddingVertical: 5,
            elevation: 10,
            shadowOpacity: 0.1,
          }
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}