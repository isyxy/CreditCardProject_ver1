import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function CameraScanner({ onScan }: { onScan: () => void }) {
  return (
    <View style={styles.container}>
      <View style={styles.simBox}>
        <Image source={require('../../assets/banks/Icon-1.png')} style={styles.icon} />
        <Text style={styles.text}>相機功能模擬</Text>
      </View>
      <TouchableOpacity style={styles.scanBtn} onPress={onScan}>
        <Text style={styles.scanBtnText}>模擬掃描</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  simBox: {
    alignItems: 'center',
    marginBottom: 18,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: '#4F8EF7',
    marginBottom: 10,
  },
  text: {
    color: '#888',
    fontSize: 15,
  },
  scanBtn: {
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  scanBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
