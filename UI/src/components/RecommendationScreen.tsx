// src/components/RecommendationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCards } from '../context/CardContext';
import { Merchant } from '../types';
import {
  rankCardsByCategory,
  calculateCashbackAmount,
  formatCashbackRate,
} from '../utils/cashbackCalculator';
import BottomNav from './BottomNav';

export default function RecommendationScreen({ route, navigation }: any) {
  const { merchant } = route.params || {};
  const { cards } = useCards();
  const [recommendedCards, setRecommendedCards] = useState<any[]>([]);
  const [amount, setAmount] = useState(1000);
  const [amountInput, setAmountInput] = useState('1000');

  useEffect(() => {
    if (merchant) {
      calculateRecommendations();
    }
  }, [merchant, cards]);

  const calculateRecommendations = () => {
    if (!merchant) {
      setRecommendedCards([]);
      return;
    }

    // 使用新的回饋計算函數
    const ranked = rankCardsByCategory(cards, merchant.category);
    setRecommendedCards(ranked);
  };

  // 計算消費回饋金額
  const calculateCashback = (amount: number, rate: number) => {
    return calculateCashbackAmount(amount, rate);
  };

  if (!merchant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#222" />
            </TouchableOpacity>
            <Text style={styles.title}>推薦信用卡</Text>
            <View style={styles.backBtn} />
          </View>

          <View style={styles.emptyState}>
            <Feather name="credit-card" size={64} color="#ccc" />
            <Text style={styles.emptyText}>請先選擇商家</Text>
            <TouchableOpacity
              style={styles.backToHomeBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.backToHomeText}>返回首頁</Text>
            </TouchableOpacity>
          </View>
          <BottomNav />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <View style={styles.container}>
        {/* 標題列 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.title}>推薦信用卡</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 80 }}>
          {/* 商家資訊 */}
          <View style={styles.merchantCard}>
            <Feather name="map-pin" size={24} color="#4F8EF7" />
            <View style={styles.merchantInfo}>
              <Text style={styles.merchantName}>{merchant.name}</Text>
              <Text style={styles.merchantMeta}>
                {merchant.category} • {merchant.distance}
              </Text>
            </View>
          </View>

          {/* 消費金額試算 */}
          <View style={styles.calculatorCard}>
            <Text style={styles.sectionTitle}>預估回饋試算</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>NT$</Text>
              <TextInput
                style={styles.amountInput}
                value={amountInput}
                onChangeText={(text) => {
                  // 只允許數字
                  const numericText = text.replace(/[^0-9]/g, '');
                  setAmountInput(numericText);
                  const numValue = parseInt(numericText) || 0;
                  setAmount(numValue);
                }}
                keyboardType="numeric"
                placeholder="輸入金額"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* 推薦卡片列表 */}
          {recommendedCards.length > 0 ? (
            <>
              <Text style={styles.listTitle}>為您推薦 ({recommendedCards.length})</Text>
              {recommendedCards.map((card, index) => (
                <View
                  key={card.id}
                  style={[
                    styles.cardBox,
                    card.isRecommended && styles.recommendedBox,
                    index === 0 && styles.topCard,
                  ]}
                >
                  {card.isRecommended && (
                    <View style={styles.recommendedBadge}>
                      <Feather name="star" size={14} color="#fff" />
                      <Text style={styles.recommendedBadgeText}>最推薦</Text>
                    </View>
                  )}

                  <View style={styles.cardHeader}>
                    <Image source={card.logo} style={styles.cardLogo} />
                    <View style={styles.cardHeaderInfo}>
                      <Text style={styles.cardName}>{card.cardName}</Text>
                      <Text style={styles.cardBank}>{card.bankName}</Text>
                    </View>
                  </View>

                  <View style={styles.cashbackInfo}>
                    <View style={styles.cashbackRow}>
                      <Text style={styles.cashbackLabel}>回饋類別</Text>
                      <Text style={styles.cashbackCategory}>{card.matchedCategory}</Text>
                    </View>
                    <View style={styles.cashbackRow}>
                      <Text style={styles.cashbackLabel}>回饋比例</Text>
                      <Text style={styles.cashbackRate}>{card.cashbackRate}%</Text>
                    </View>
                    <View style={[styles.cashbackRow, styles.highlightRow]}>
                      <Text style={styles.cashbackLabel}>消費 ${amount} 可獲得</Text>
                      <Text style={styles.cashbackAmount}>
                        ${calculateCashback(amount, card.cashbackRate)}
                      </Text>
                    </View>
                  </View>

                  {/* 權益提醒 */}
                  {card.categoryNote && (
                    <View style={styles.noteBox}>
                      <Feather name="alert-circle" size={14} color="#FF9500" />
                      <Text style={styles.noteText}>{card.categoryNote}</Text>
                    </View>
                  )}

                  {/* 消費上限警告 */}
                  {card.categoryLimit && (
                    <View style={styles.limitBox}>
                      <Feather name="info" size={14} color="#4F8EF7" />
                      <Text style={styles.limitText}>
                        消費上限：每月 {card.categoryLimit} 點
                      </Text>
                    </View>
                  )}

                  {/* 一般性提醒 */}
                  {card.generalNotes && card.generalNotes.length > 0 && (
                    <View style={styles.generalNotesBox}>
                      {card.generalNotes.map((note: string, idx: number) => (
                        <View key={idx} style={styles.generalNoteRow}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.generalNoteText}>{note}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {card.cashbackRate === 0 && (
                    <View style={styles.noRewardNote}>
                      <Feather name="info" size={14} color="#888" />
                      <Text style={styles.noRewardText}>此卡在本商家無特殊回饋</Text>
                    </View>
                  )}
                </View>
              ))}
            </>
          ) : (
            <View style={styles.noCardsState}>
              <Feather name="credit-card" size={48} color="#ccc" />
              <Text style={styles.noCardsText}>尚未新增任何信用卡</Text>
              <TouchableOpacity
                style={styles.addCardBtn}
                onPress={() => navigation.navigate('CardManagement')}
              >
                <Feather name="plus" size={18} color="#fff" />
                <Text style={styles.addCardBtnText}>新增信用卡</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
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
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  content: {
    flex: 1,
  },
  merchantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  merchantInfo: {
    marginLeft: 12,
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  merchantMeta: {
    fontSize: 13,
    color: '#888',
  },
  calculatorCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4F8EF7',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginLeft: 16,
    marginBottom: 12,
  },
  cardBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  recommendedBox: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  topCard: {
    marginTop: 0,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  recommendedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLogo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  cardHeaderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  cardBank: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  cashbackInfo: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  cashbackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightRow: {
    backgroundColor: '#E8F4FF',
    marginHorizontal: -12,
    marginBottom: -12,
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  cashbackLabel: {
    fontSize: 13,
    color: '#666',
  },
  cashbackCategory: {
    fontSize: 13,
    color: '#4F8EF7',
    fontWeight: '600',
  },
  cashbackRate: {
    fontSize: 15,
    color: '#4F8EF7',
    fontWeight: 'bold',
  },
  cashbackAmount: {
    fontSize: 18,
    color: '#4F8EF7',
    fontWeight: 'bold',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 10,
    backgroundColor: '#FFF9E6',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
  },
  noteText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  limitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 10,
    backgroundColor: '#E8F4FF',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4F8EF7',
  },
  limitText: {
    fontSize: 12,
    color: '#004085',
    marginLeft: 8,
    fontWeight: '600',
  },
  generalNotesBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  generalNoteRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
    lineHeight: 18,
  },
  generalNoteText: {
    fontSize: 11,
    color: '#666',
    flex: 1,
    lineHeight: 18,
  },
  noRewardNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF9E6',
    borderRadius: 6,
  },
  noRewardText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  backToHomeBtn: {
    backgroundColor: '#4F8EF7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backToHomeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  noCardsState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noCardsText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F8EF7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addCardBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
});