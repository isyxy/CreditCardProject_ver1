// src/components/BottomNav.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface BottomNavProps {
  activeTab?: 'home' | 'cards';
}

export default function BottomNav({ activeTab = 'home' }: BottomNavProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navBtn}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Feather
          name="home"
          size={24}
          color={activeTab === 'home' ? '#007AFF' : '#666'}
        />
        <Text style={[styles.navText, activeTab === 'home' && styles.activeText]}>
          首頁
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={styles.navBtn}
        onPress={() => navigation.navigate('CardManagement' as never)}
      >
        <Feather
          name="credit-card"
          size={24}
          color={activeTab === 'cards' ? '#007AFF' : '#666'}
        />
        <Text style={[styles.navText, activeTab === 'cards' && styles.activeText]}>
          信用卡
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 32,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBtn: {
    alignItems: 'center',
    width: 60,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});