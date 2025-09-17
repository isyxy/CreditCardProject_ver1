import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface MerchantCardProps {
  name: string;
  category: string;
  logo: any;
  onPress?: () => void;
}

export default function MerchantCard({ name, category, logo, onPress }: MerchantCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  category: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});
