// src/components/CardManagementScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import { availableCreditCards, type AvailableCreditCard } from '../data/creditCards';
import { CreditCard } from '../types';
import { getCashbackSummary } from '../utils/cashbackCalculator';
import BottomNav from './BottomNav';

// 只保留目前 5 張卡片對應的銀行
const bankTags = [
  { key: '全部', label: '全部' },
  { key: '中國信託', label: '中國信託', icon: require('../../assets/banks/中信LOGO.png') },
  { key: '台新銀行', label: '台新銀行', icon: require('../../assets/banks/台新LOGO.png') },
  { key: '玉山銀行', label: '玉山銀行', icon: require('../../assets/banks/玉山LOGO.png') },
  { key: '國泰世華', label: '國泰世華', icon: require('../../assets/banks/國泰LOGO.png') },
];

export default function CardManagementScreen({ navigation }: any) {
  const { cards, addCard, removeCard, toggleCard } = useCards();
  const [searchText, setSearchText] = useState('');
  const [selectedBank, setSelectedBank] = useState('全部');

  const filteredCards = availableCreditCards.filter((card) => {
    const matchBank = selectedBank === '全部' || card.bankName === selectedBank;
    const matchSearch =
      searchText === '' ||
      card.cardName.toLowerCase().includes(searchText.toLowerCase()) ||
      card.bankName.toLowerCase().includes(searchText.toLowerCase());
    return matchBank && matchSearch;
  });

  const isCardAdded = (cardName: string, bankName: string) => {
    return cards.some((c) => c.cardName === cardName && c.bankName === bankName);
  };

  const getAddedCard = (cardName: string, bankName: string) => {
    return cards.find((c) => c.cardName === cardName && c.bankName === bankName);
  };

  const handleAddCard = (card: AvailableCreditCard) => {
    const newCard: CreditCard = {
      ...card,
      id: `${card.bankName}_${card.cardName}_${Date.now()}`,
      isActive: true,
    };
    addCard(newCard);
    Alert.alert('成功', `已新增 ${card.bankName} ${card.cardName}`);
  };

  const handleRemoveCard = (cardId: string, cardName: string) => {
    Alert.alert('確認移除', `確定要移除 ${cardName} 嗎?`, [
      { text: '取消', style: 'cancel' },
      {
        text: '移除',
        style: 'destructive',
        onPress: () => removeCard(cardId),
      },
    ]);
  };

  const handleToggleCard = (cardId: string) => {
    toggleCard(cardId);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.title}>管理信用卡</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{cards.length}</Text>
            <Text style={styles.statLabel}>已新增</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{cards.filter((c) => c.isActive).length}</Text>
            <Text style={styles.statLabel}>已啟用</Text>
          </View>
        </View>

        <View style={styles.searchBarRow}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="搜尋卡片或銀行"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#888"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Feather name="x" size={20} color="#888" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('CameraScanner')}>
                <Feather name="camera" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bankTagScroll}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {bankTags.map((tag) => (
            <TouchableOpacity
              key={tag.key}
              style={[styles.bankTag, selectedBank === tag.key && styles.bankTagActive]}
              onPress={() => setSelectedBank(tag.key)}
              activeOpacity={0.7}
            >
              {tag.icon && <Image source={tag.icon as any} style={styles.bankTagIcon} />}
              <Text style={[styles.bankTagText, selectedBank === tag.key && styles.bankTagTextActive]}>
                {tag.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 80 }}>
          <Text style={styles.sectionTitle}>可用卡片 ({filteredCards.length})</Text>

          {filteredCards.map((card, index) => {
            const added = isCardAdded(card.cardName, card.bankName);
            const addedCard = getAddedCard(card.cardName, card.bankName);

            return (
              <View key={`${card.bankName}-${card.cardName}-${index}`} style={styles.cardBox}>
                <Image source={card.logo as any} style={styles.cardLogo} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{card.cardName}</Text>
                  <Text style={styles.cardBank}>{card.bankName}</Text>
                  <Text style={styles.cardCashback}>{getCashbackSummary(card.cashback)}</Text>
                </View>

                {added && addedCard ? (
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={[styles.toggleBtn, addedCard.isActive && styles.toggleBtnActive]}
                      onPress={() => handleToggleCard(addedCard.id)}
                    >
                      <Feather
                        name={addedCard.isActive ? 'check-circle' : 'circle'}
                        size={18}
                        color={addedCard.isActive ? '#4F8EF7' : '#ccc'}
                      />
                      <Text style={[styles.toggleText, addedCard.isActive && styles.toggleTextActive]}>
                        {addedCard.isActive ? '已啟用' : '未啟用'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => handleRemoveCard(addedCard.id, card.cardName)}
                    >
                      <Feather name="trash-2" size={18} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addBtn} onPress={() => handleAddCard(card)}>
                    <Feather name="plus" size={18} color="#fff" />
                    <Text style={styles.addBtnText}>新增</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {filteredCards.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="credit-card" size={48} color="#ccc" />
              <Text style={styles.emptyText}>找不到相關卡片</Text>
            </View>
          )}
        </ScrollView>

        <BottomNav activeTab="settings" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#4F8EF7' },
  statLabel: { fontSize: 13, color: '#888', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#eee', marginHorizontal: 16 },
  searchBarRow: { marginBottom: 12, paddingHorizontal: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#222', backgroundColor: 'transparent', marginLeft: 8 },
  bankTagScroll: { maxHeight: 50, marginBottom: 12 },
  bankTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bankTagActive: { backgroundColor: '#4F8EF7', borderColor: '#4F8EF7' },
  bankTagIcon: { width: 20, height: 20, marginRight: 6, resizeMode: 'contain' },
  bankTagText: { color: '#666', fontSize: 14, fontWeight: '500' },
  bankTagTextActive: { color: '#fff', fontWeight: '600' },
  list: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#222', marginBottom: 12 },
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardLogo: { width: 48, height: 48, marginRight: 12, resizeMode: 'contain' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#222', marginBottom: 2 },
  cardBank: { fontSize: 13, color: '#888', marginBottom: 4 },
  cardCashback: { fontSize: 12, color: '#4F8EF7' },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  toggleBtnActive: { backgroundColor: '#E8F4FF' },
  toggleText: { fontSize: 13, color: '#999', marginLeft: 4 },
  toggleTextActive: { color: '#4F8EF7', fontWeight: '600' },
  removeBtn: { padding: 8 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12 },
});