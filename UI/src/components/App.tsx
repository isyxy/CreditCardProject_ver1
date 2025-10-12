// src/App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CardProvider, useCards } from '../context/CardContext';
import HomeScreen from './HomeScreen';
import CardManagementScreen from './CardManagementScreen';
import RecommendationScreen from './RecommendationScreen';
import SearchScreen from './SearchScreen';
import CameraScanner from './CameraScanner';
import SettingsModal from './SettingsModal';

const Stack = createStackNavigator();

// 內部導航元件 (可以使用 useCards Hook)
function AppNavigator() {
  const { settingsVisible, setSettingsVisible, loadCards } = useCards();

  // 啟動時載入已儲存的卡片
  useEffect(() => {
    loadCards();
  }, []);

  return (
    <>
      <Stack.Navigator 
        initialRouteName="Home" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CardManagement" component={CardManagementScreen} />
        <Stack.Screen name="Recommendation" component={RecommendationScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen 
          name="CameraScanner" 
          component={CameraScanner}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
      
      <SettingsModal 
        visible={settingsVisible} 
        onClose={() => setSettingsVisible(false)} 
      />
    </>
  );
}

// 主要 App 元件
export default function App() {
  return (
    <CardProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </CardProvider>
  );
}