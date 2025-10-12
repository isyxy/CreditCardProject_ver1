// src/context/CardContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定義信用卡資料結構
export interface CreditCard {
  id: string;
  bankName: string;
  cardName: string;
  logo: any; // require() 引入的圖片
  cashback: {
    [category: string]: number; // 例如 { "超商": 3, "餐廳": 5 }
  };
  isActive: boolean;
}

// 定義 Context 類型
interface CardContextType {
  cards: CreditCard[];
  addCard: (card: CreditCard) => void;
  removeCard: (id: string) => void;
  toggleCard: (id: string) => void;
  loadCards: () => Promise<void>;
  settingsVisible: boolean;
  setSettingsVisible: (visible: boolean) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

// Provider 元件
export const CardProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // 從 AsyncStorage 載入卡片
  const loadCards = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('creditCards');
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error('載入卡片失敗:', error);
    }
  };

  // 儲存卡片到 AsyncStorage
  const saveCards = async (newCards: CreditCard[]) => {
    try {
      await AsyncStorage.setItem('creditCards', JSON.stringify(newCards));
    } catch (error) {
      console.error('儲存卡片失敗:', error);
    }
  };

  // 新增卡片
  const addCard = (card: CreditCard) => {
    const newCards = [...cards, card];
    setCards(newCards);
    saveCards(newCards);
  };

  // 移除卡片
  const removeCard = (id: string) => {
    const newCards = cards.filter(card => card.id !== id);
    setCards(newCards);
    saveCards(newCards);
  };

  // 切換卡片啟用狀態
  const toggleCard = (id: string) => {
    const newCards = cards.map(card =>
      card.id === id ? { ...card, isActive: !card.isActive } : card
    );
    setCards(newCards);
    saveCards(newCards);
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        addCard,
        removeCard,
        toggleCard,
        loadCards,
        settingsVisible,
        setSettingsVisible,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

// 自訂 Hook
export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards 必須在 CardProvider 內使用');
  }
  return context;
};