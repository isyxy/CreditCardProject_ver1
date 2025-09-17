import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Merchant {
  id: string;
  name: string;
  distance: string;
  address: string;
}

const mockMerchants: Merchant[] = [
  { id: '1', name: '星巴克starbucks斗六門市', distance: '0.1公里', address: '大學路二段' },
  { id: '2', name: 'Uniqlo 斗六大學路店', distance: '0.1公里', address: '大學路二段' },
  { id: '3', name: 'スシロー壽司郎 雲林斗六店', distance: '0.1公里', address: '大學路二段' },
  { id: '4', name: '史堤克牛排斗六店', distance: '0.3公里', address: '大學路二段' },
  { id: '5', name: 'CHICO 餐廚', distance: '0.3公里', address: '鎮南路' },
  { id: '6', name: '斗六觀光夜市', distance: '0.4公里', address: '鎮南路' },
  { id: '7', name: '圓圓窯香升降鍋物 斗六旗艦店', distance: '0.7公里', address: '莊敬路' },
  { id: '8', name: '斗六太平老街', distance: '1.1公里', address: '斗六市' },
  { id: '9', name: '麥當勞斗六店', distance: '1.2公里', address: '斗六市' },
  { id: '10', name: '肯德基斗六店', distance: '1.3公里', address: '斗六市' },
  { id: '11', name: '星巴克斗六門市', distance: '1.4公里', address: '斗六市' },
  { id: '12', name: '全家便利商店斗六店', distance: '1.5公里', address: '斗六市' },
  { id: '13', name: '7-ELEVEN斗六店', distance: '1.6公里', address: '斗六市' },
  { id: '14', name: '萊爾富斗六店', distance: '1.7公里', address: '斗六市' },
  { id: '15', name: 'OK超商斗六店', distance: '1.8公里', address: '斗六市' }
];

export default function HomeScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState('');
  const [nearbyMerchants, setNearbyMerchants] = useState<Merchant[]>([]);

  useEffect(() => {
    setNearbyMerchants(mockMerchants);
  }, []);

  const filteredMerchants = nearbyMerchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* 頂部搜尋區 */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBar}>
            <Feather name="map-pin" size={18} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="搜尋所在商家 / 線上網站"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#888"
            />
            <TouchableOpacity>
              <Feather name="search" size={18} color="#888" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 商家列表 */}
        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 80 }}>
          {filteredMerchants.map((merchant) => (
            <TouchableOpacity
              key={merchant.id}
              style={styles.merchantBtn}
              onPress={() => navigation.navigate('Recommendation')}
            >
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.merchantName}>{merchant.name}</Text>
                <Text style={styles.merchantInfo}>{merchant.distance} {merchant.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 底部導航列 */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navBtn}>
            <Feather name="home" size={24} color="#666" />
            <Text style={styles.navText}>首頁</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('CardManagement')}>
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
    backgroundColor: '#fff',
  },
  searchBarWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingTop: Platform.OS === 'android' ? 16 : 0,
    paddingBottom: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  merchantBtn: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 2,
  },
  merchantInfo: {
    fontSize: 13,
    color: '#888',
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
