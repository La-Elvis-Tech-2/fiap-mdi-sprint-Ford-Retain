import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/services/AppContext';
import TabBar from './src/components/TabBar';
import HomeScreen     from './src/screens/HomeScreen';
import CompareScreen  from './src/screens/CompareScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';  
import VehicleScreen  from './src/screens/VehicleScreen';    
import { Colors } from './src/theme';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navigate = (tab) => setActiveTab(tab);

  const screens = {
    home:     <HomeScreen />,
    compare:  <CompareScreen />,
    schedule: <ScheduleScreen navigate={navigate} />,   
    vehicle:  <VehicleScreen />,                         
  };

  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={styles.root}>
          <StatusBar style="dark" backgroundColor={Colors.bg} />
          <View style={styles.screen}>
            {screens[activeTab]}
          </View>
          <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  screen: { flex: 1 },
});