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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import { getCashbackSummary } from '../utils/cashbackCalculator';
import BottomNav from './BottomNav';

export default function CardManagementScreen({ navigation }: any) {
  const { cards, toggleCard } = useCards();
  const [searchText, setSearchText] = useState('');

  // 只顯示已新增的卡片
  const filteredCards = cards.filter((card) => {
    const matchSearch =
      searchText === '' ||
      card.cardName.toLowerCase().includes(searchText.toLowerCase()) ||
      card.bankName.toLowerCase().includes(searchText.toLowerCase());
    return matchSearch;
  });

  const handleToggleCard = (cardId: string) => {
    toggleCard(cardId);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>我的信用卡</Text>
          <Text style={styles.subtitle}>管理您的信用卡並選擇要啟用的卡片</Text>
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
            ) : null}
          </View>
        </View>

        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 80 }}>

          {filteredCards.map((card, index) => (
            <View key={`${card.bankName}-${card.cardName}-${index}`} style={styles.cardBox}>
              <Image source={card.logo as any} style={styles.cardLogo} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{card.cardName}</Text>
                <Text style={styles.cardBank}>{card.bankName}</Text>
                <Text style={styles.cardCashback}>{getCashbackSummary(card.cashback)}</Text>
              </View>

              <TouchableOpacity
                style={[styles.toggleBtn, card.isActive && styles.toggleBtnActive]}
                onPress={() => handleToggleCard(card.id)}
              >
                <Feather
                  name={card.isActive ? 'check-circle' : 'circle'}
                  size={20}
                  color={card.isActive ? '#4F8EF7' : '#ccc'}
                />
                <Text style={[styles.toggleText, card.isActive && styles.toggleTextActive]}>
                  {card.isActive ? '已啟用' : '已停用'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {filteredCards.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="credit-card" size={48} color="#ccc" />
              <Text style={styles.emptyText}>
                {cards.length === 0 ? '尚無信用卡' : '找不到相關卡片'}
              </Text>
            </View>
          )}
        </ScrollView>

        <BottomNav activeTab="cards" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888' },
  searchBarRow: { marginBottom: 16, marginTop: 16, paddingHorizontal: 16 },
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
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  toggleBtnActive: { backgroundColor: '#E8F4FF' },
  toggleText: { fontSize: 14, color: '#999', marginLeft: 6 },
  toggleTextActive: { color: '#4F8EF7', fontWeight: '600' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 12 },
});