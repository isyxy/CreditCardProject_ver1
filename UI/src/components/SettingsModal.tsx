// src/components/SettingsModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCards } from '../context/CardContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const navigation = useNavigation();
  const { cards } = useCards();

  const handleNavigateToCardManagement = () => {
    onClose();
    navigation.navigate('CardManagement' as never);
  };

  const menuItems = [
    {
      icon: 'credit-card',
      title: '信用卡管理',
      description: `已新增 ${cards.length} 張信用卡`,
      onPress: handleNavigateToCardManagement,
    },
    {
      icon: 'bell',
      title: '通知設定',
      description: '管理推播通知',
      onPress: () => {
        // TODO: 實作通知設定
      },
    },
    {
      icon: 'map-pin',
      title: '定位服務',
      description: '開啟以顯示附近商家',
      onPress: () => {
        // TODO: 實作定位設定
      },
    },
    {
      icon: 'help-circle',
      title: '使用說明',
      description: '了解如何使用本 App',
      onPress: () => {
        // TODO: 實作使用說明
      },
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.modalBg}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBox}
          onPress={(e) => e.stopPropagation()}
        >
          {/* 標題列 */}
          <View style={styles.header}>
            <Text style={styles.title}>設定</Text>
            <TouchableOpacity style={styles.closeIconBtn} onPress={onClose}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* 選單項目 */}
          <ScrollView style={styles.content}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconWrapper}>
                  <Feather name={item.icon as any} size={20} color="#4F8EF7" />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}

            {/* 關於區塊 */}
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>關於信用卡回饋導航</Text>
              <Text style={styles.aboutText}>
                幫助您在消費時選擇最佳的信用卡,{'\n'}
                自動計算回饋並推薦最划算的付款方式。
              </Text>
              <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
          </ScrollView>

          {/* 底部按鈕 */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>關閉</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 13,
    color: '#888',
  },
  aboutSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
  closeBtn: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: '#4F8EF7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});