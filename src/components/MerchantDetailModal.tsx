import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native';

interface MerchantDetailModalProps {
  visible: boolean;
  onClose: () => void;
  merchant: {
    name: string;
    category: string;
    logo: any;
    description?: string;
  } | null;
}

export default function MerchantDetailModal({ visible, onClose, merchant }: MerchantDetailModalProps) {
  if (!merchant) return null;
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBg}>
        <View style={styles.modalBox}>
          <Image source={merchant.logo} style={styles.logo} />
          <Text style={styles.name}>{merchant.name}</Text>
          <Text style={styles.category}>{merchant.category}</Text>
          {merchant.description && <Text style={styles.desc}>{merchant.description}</Text>}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>關閉</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  category: {
    fontSize: 15,
    color: '#888',
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 18,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
