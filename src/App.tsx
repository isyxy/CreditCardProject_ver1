import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import CardManagementScreen from './components/CardManagementScreen';
import RecommendationScreen from './components/RecommendationScreen';
import SearchScreen from './components/SearchScreen';
import SettingsModal from './components/SettingsModal';

const Stack = createStackNavigator();

export default function App() {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CardManagement" component={CardManagementScreen} />
        <Stack.Screen name="Recommendation" component={RecommendationScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </NavigationContainer>
  );
}
