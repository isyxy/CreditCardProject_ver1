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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

interface CreditCard {
  id: string;
  name: string;
  bank: string;
  image?: any;
  isOwned: boolean;
}

const bankLogos: Record<string, any> = {
  '中信': require('../../assets/banks/中信LOGO.png'),
  '國泰': require('../../assets/banks/國泰LOGO.png'),
  '台新': require('../../assets/banks/台新LOGO.png'),
  '玉山': require('../../assets/banks/玉山LOGO.png'),
  '聯邦': require('../../assets/banks/聯邦LOGO.png'),
  '永豐': require('../../assets/banks/永豐LOGO.png'),
  '匯豐': require('../../assets/banks/匯豐LOGO.png'),
};

const availableCards: CreditCard[] = [
  { id: '1', name: 'LINE Pay', bank: '中信', isOwned: false },
  { id: '2', name: 'CUBE', bank: '國泰', isOwned: false },
  { id: '3', name: 'Unicard', bank: '玉山', isOwned: false },
  { id: '4', name: '熊本熊', bank: '玉山', isOwned: false },
  { id: '5', name: 'U Bear', bank: '玉山', isOwned: false },
  { id: '6', name: 'Pi錢包', bank: '玉山', isOwned: false },
  { id: '7', name: '太陽/玫瑰', bank: '台新', isOwned: false },
  { id: '8', name: 'GoGo', bank: '台新', isOwned: false },
  { id: '9', name: '吉鶴', bank: '聯邦', isOwned: false },
  { id: '10', name: 'LINE Bank', bank: '聯邦', isOwned: false },
  { id: '11', name: 'DAWAY', bank: '永豐', isOwned: false },
  { id: '12', name: 'DAWHO', bank: '永豐', isOwned: false },
  { id: '13', name: 'Live+現金回饋', bank: '匯豐', isOwned: false },
  { id: '14', name: '匯鑽', bank: '匯豐', isOwned: false }
];

const bankTags = [
  { key: '全部', label: '全部' },
  { key: '中信', label: '中國信託', icon: require('../../assets/banks/中信LOGO.png') },
  { key: '國泰', label: '國泰世華', icon: require('../../assets/banks/國泰LOGO.png') },
  { key: '台新', label: '台新', icon: require('../../assets/banks/台新LOGO.png') },
  { key: '玉山', label: '玉山', icon: require('../../assets/banks/玉山LOGO.png') },
  { key: '聯邦', label: '聯邦', icon: require('../../assets/banks/聯邦LOGO.png') },
  { key: '永豐', label: '永豐', icon: require('../../assets/banks/永豐LOGO.png') },
  { key: '匯豐', label: '匯豐', icon: require('../../assets/banks/匯豐LOGO.png') },
];

export default function CardManagementScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState('');
  const [selectedBank, setSelectedBank] = useState('全部');
  const [cards, setCards] = useState<CreditCard[]>(availableCards);
  const [showCamera, setShowCamera] = useState(false);
  const [ownedCards, setOwnedCards] = useState<CreditCard[]>([]);

  useEffect(() => {
    loadOwnedCards();
  }, []);

  const loadOwnedCards = async () => {
    try {
      const stored = await AsyncStorage.getItem('ownedCards');
      if (stored) {
        const owned = JSON.parse(stored);
        setOwnedCards(owned);
        setCards(prevCards =>
          prevCards.map(card => ({
            ...card,
            isOwned: owned.some((ownedCard: CreditCard) => ownedCard.id === card.id)
          }))
        );
      }
    } catch (error) {
      console.error('載入已持有卡片失敗:', error);
    }
  };

  const saveOwnedCards = async (newOwnedCards: CreditCard[]) => {
    try {
      await AsyncStorage.setItem('ownedCards', JSON.stringify(newOwnedCards));
      setOwnedCards(newOwnedCards);
      setCards(prevCards =>
        prevCards.map(card => ({
          ...card,
          isOwned: newOwnedCards.some((ownedCard: CreditCard) => ownedCard.id === card.id)
        }))
      );
    } catch (error) {
      console.error('儲存已持有卡片失敗:', error);
    }
  };

  const handleAddCard = (card: CreditCard) => {
    if (!ownedCards.some(c => c.id === card.id)) {
      const newOwned = [...ownedCards, { ...card, isOwned: true }];
      saveOwnedCards(newOwned);
    }
  };

  const handleRemoveCard = (card: CreditCard) => {
    const newOwned = ownedCards.filter(c => c.id !== card.id);
    saveOwnedCards(newOwned);
  };

  // 搜尋功能：發卡銀行或卡片名稱都能搜尋
  const filteredCards = cards.filter(card =>
    (selectedBank === '全部' || card.bank === selectedBank) &&
    (card.name.toLowerCase().includes(searchText.toLowerCase()) || card.bank.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <View style={styles.container}>
        <Text style={styles.title}>管理信用卡</Text>
        {/* 搜尋列 */}
        <View style={styles.searchBarRow}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="搜尋銀行"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={{ marginLeft: 8 }}>
              <Feather name="search" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => setShowCamera(true)}>
              <Feather name="camera" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>
        {/* 銀行標籤列（在搜尋欄下方，非橫向滑動，全部展開） */}
        <View style={styles.bankTagBarWrap}>
          <View style={styles.bankTagBarGrid}>
            {bankTags.map(tag => (
              <TouchableOpacity
                key={tag.key}
                style={[styles.bankTag, selectedBank === tag.key && styles.bankTagActive]}
                onPress={() => setSelectedBank(tag.key)}
                activeOpacity={0.7}
              >
                {tag.icon && (
                  <Image source={tag.icon} style={styles.bankTagIcon} />
                )}
                <Text style={[styles.bankTagText, selectedBank === tag.key && styles.bankTagTextActive]}>{tag.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ScrollView style={styles.list}>
          {filteredCards.map(card => (
            <View key={card.id} style={styles.cardBox}>
              <Image source={bankLogos[card.bank]} style={styles.cardLogo} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardBank}>{card.bank}</Text>
              </View>
              {card.isOwned ? (
                <TouchableOpacity style={styles.ownedBtn} onPress={() => handleRemoveCard(card)}>
                  <Feather name="trash-2" size={18} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.addBtn} onPress={() => handleAddCard(card)}>
                  <Feather name="plus" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
        {/* 底部導覽列 */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Home')}>
            <Feather name="home" size={24} color="#666" />
            <Text style={styles.navText}>首頁</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Settings')}>
            <Feather name="settings" size={24} color="#666" />
            <Text style={styles.navText}>設定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
    marginBottom: 8,
  },
  bankTagBarWrap: {
    marginBottom: 12,
    marginTop: 0,
    paddingHorizontal: 8,
  },
  bankTagBarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bankTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    minWidth: 44,
    minHeight: 32,
    // 不會因選取變大
    transform: [{ scale: 1 }],
  },
  bankTagActive: {
    backgroundColor: '#4F8EF7',
    borderColor: '#4F8EF7',
  },
  bankTagIcon: {
    width: 22,
    height: 22,
    marginRight: 4,
    resizeMode: 'contain',
  },
  bankTagText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  bankTagTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBarRow: {
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
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
  cardLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: 'contain',
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
  addBtn: {
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  ownedBtn: {
    backgroundColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 32,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBtn: {
    alignItems: 'center',
    width: 60,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
