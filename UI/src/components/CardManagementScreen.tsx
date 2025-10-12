// src/components/CardManagementScreen.tsx
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCards } from '../context/CardContext';
import { availableCreditCards, type AvailableCreditCard } from '../data/creditCards';
import { CreditCard } from '../types';
import BottomNav from './BottomNav';

// 銀行標籤資料，用於篩選功能
const bankTags = [
  { key: '全部', label: '全部' },
  { key: '中國信託', label: '中國信託', icon: require('../../assets/banks/中信LOGO.png') },
  { key: '國泰世華', label: '國泰世華', icon: require('../../assets/banks/國泰LOGO.png') },
  { key: '台新銀行', label: '台新銀行', icon: require('../../assets/banks/台新LOGO.png') },
  { key: '玉山銀行', label: '玉山銀行', icon: require('../../assets/banks/玉山LOGO.png') },
  { key: '聯邦銀行', label: '聯邦銀行', icon: require('../../assets/banks/聯邦LOGO.png') },
  { key: '永豐銀行', label: '永豐銀行', icon: require('../../assets/banks/永豐LOGO.png') },
  { key: '匯豐銀行', label: '匯豐銀行', icon: require('../../assets/banks/匯豐LOGO.png') },
];

// 定義已啟用卡片的儲存 Key
const ACTIVE_CARDS_KEY = 'activeCards';

export default function CardManagementScreen({ navigation }: any) {
  const { cards, addCard, removeCard, toggleCard } = useCards();
  const [searchText, setSearchText] = useState('');
  const [selectedBank, setSelectedBank] = useState('全部');

  // 當卡片狀態改變時，自動儲存已啟用的卡片到檔案
  useEffect(() => {
    saveActiveCardsToFile();
  }, [cards]); // 監聽 cards 的變化

  // 根據銀行和搜尋文字過濾可用的信用卡清單
  const filteredCards = availableCreditCards.filter((card) => {
    const matchBank = selectedBank === '全部' || card.bankName === selectedBank;
    const matchSearch =
      searchText === '' ||
      card.cardName.toLowerCase().includes(searchText.toLowerCase()) ||
      card.bankName.toLowerCase().includes(searchText.toLowerCase());
    return matchBank && matchSearch;
  });

  // 檢查特定卡片是否已被使用者新增
  const isCardAdded = (cardName: string, bankName: string) => {
    return cards.some((c) => c.cardName === cardName && c.bankName === bankName);
  };

  // 取得使用者已新增的特定卡片資料
  const getAddedCard = (cardName: string, bankName: string) => {
    return cards.find((c) => c.cardName === cardName && c.bankName === bankName);
  };

  // 處理新增卡片的功能
  const handleAddCard = (card: AvailableCreditCard) => {
    const newCard: CreditCard = {
      ...card,
      id: `${card.bankName}_${card.cardName}_${Date.now()}`,
      isActive: true,
    };
    addCard(newCard);
    Alert.alert('成功', `已新增 ${card.bankName} ${card.cardName}`);
  };

  // 處理移除卡片的功能
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

  // 處理切換卡片啟用/停用狀態
  const handleToggleCard = (cardId: string) => {
    toggleCard(cardId);
  };

  // 取得卡片回饋摘要（顯示前三高的回饋類別）
  const getCashbackSummary = (cashback: { [key: string]: number }) => {
    const entries = Object.entries(cashback);
    if (entries.length === 0) return '無回饋資訊';
    
    const topThree = entries
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([category, rate]) => `${category} ${rate}%`)
      .join('、');
    
    return topThree;
  };

  // ✨ 核心功能：將已啟用的卡片自動儲存到 AsyncStorage
  const saveActiveCardsToFile = async () => {
    try {
      // 篩選出已啟用的卡片
      const activeCards = cards.filter((card) => card.isActive);

      // 準備要儲存的資料結構
      const dataToSave = {
        lastUpdated: new Date().toISOString(), // 最後更新時間
        totalCount: activeCards.length, // 已啟用卡片總數
        cards: activeCards.map((card) => ({
          id: card.id,
          bankName: card.bankName,
          cardName: card.cardName,
          cashback: card.cashback,
          isActive: card.isActive,
        })),
      };

      // 將資料轉換為 JSON 字串並儲存
      await AsyncStorage.setItem(ACTIVE_CARDS_KEY, JSON.stringify(dataToSave));

      console.log('✅ 已啟用卡片已自動儲存');
      console.log('📊 儲存卡片數量:', activeCards.length);
    } catch (error) {
      console.error('❌ 儲存已啟用卡片失敗:', error);
    }
  };

  // ✨ 讀取已儲存的已啟用卡片（可用於傳送到後端）
  const loadActiveCardsFromFile = async () => {
    try {
      // 從 AsyncStorage 讀取資料
      const jsonString = await AsyncStorage.getItem(ACTIVE_CARDS_KEY);
      
      if (!jsonString) {
        console.log('⚠️ 尚未儲存已啟用卡片資料');
        return null;
      }

      // 解析 JSON
      const data = JSON.parse(jsonString);
      console.log('✅ 成功讀取已啟用卡片:', data);
      
      return data;
    } catch (error) {
      console.error('❌ 讀取已啟用卡片失敗:', error);
      return null;
    }
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <View style={styles.container}>
        {/* 頂部標題列 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.title}>管理信用卡</Text>
          {/* 佔位元素，用於對齊標題置中 */}
          <View style={styles.backBtn} />
        </View>

        {/* 統計資訊欄位 */}
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

        {/* 搜尋列 */}
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

        {/* 銀行標籤橫向滾動列 */}
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

        {/* 卡片清單 */}
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