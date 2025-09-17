import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CreditCard {
  id: string;
  name: string;
  bank: string;
  cashback: number;
  conditions: string;
  paymentMethod?: string;
  isRecommended?: boolean;
}

const mockRecommendations: CreditCard[] = [
  {
    id: '1',
    name: '永豐 DAWAY卡',
    bank: '永豐銀行',
    cashback: 6,
    conditions: '指定通路、需綁定數位帳戶消費',
    paymentMethod: 'LINE Pay 綁定',
    isRecommended: true,
  },
  {
    id: '2',
    name: '遠東 快樂信用卡',
    bank: '遠東商銀',
    cashback: 5,
    conditions: '指定通路、需綁定數位帳戶消費',
    paymentMethod: '行動支付',
    isRecommended: false,
  },
  {
    id: '3',
    name: '國泰 CUBE卡',
    bank: '國泰世華',
    cashback: 3,
    conditions: '指定通路、需綁定數位帳戶消費',
    paymentMethod: 'LINE 綁定',
    isRecommended: false,
  },
  {
    id: '4',
    name: '台新 GoGo卡',
    bank: '台新銀行',
    cashback: 4,
    conditions: '網路購物、需登入活動',
    paymentMethod: '網路購物',
    isRecommended: false,
  },
  {
    id: '5',
    name: '玉山 U Bear卡',
    bank: '玉山銀行',
    cashback: 3.5,
    conditions: '指定通路、需綁定數位帳戶消費',
    paymentMethod: 'LINE Pay',
    isRecommended: false,
  },
];

export default function RecommendationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>推薦信用卡</Text>
      <ScrollView style={styles.list}>
        {mockRecommendations.map(card => (
          <View key={card.id} style={[styles.cardBox, card.isRecommended && styles.recommendBox]}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardBank}>{card.bank}</Text>
              <Text style={styles.cardCashback}>{card.cashback}% 回饋</Text>
              <Text style={styles.cardCond}>{card.conditions}</Text>
              {card.paymentMethod && (
                <Text style={styles.cardPay}>支付方式：{card.paymentMethod}</Text>
              )}
            </View>
            {card.isRecommended && (
              <Feather name="star" size={28} color="#FFD700" style={{ marginLeft: 8 }} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingTop: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 18,
  },
  list: {
    paddingHorizontal: 16,
  },
  cardBox: {
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
  recommendBox: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  cardBank: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  cardCashback: {
    color: '#4F8EF7',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 4,
  },
  cardCond: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cardPay: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
