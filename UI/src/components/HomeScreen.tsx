// src/components/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCards } from '../context/CardContext';
import { mockMerchants } from '../data/merchants';
import { Merchant, MerchantCategory } from '../types';
import BottomNav from './BottomNav';

// 直接使用 Google Places API (僅限開發測試)
// 正式環境建議使用後端或 Firebase
const GOOGLE_API_KEY = 'AIzaSyDPQZsRRcVh4dXfjENay9WnxhOAshJDVxk'; // 請替換成你的 API Key

export default function HomeScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState('');
  const [nearbyMerchants, setNearbyMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  
  const { cards } = useCards();

  // 取得使用者定位
  const getUserLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('權限被拒絕', '請允許應用程式存取您的位置以搜尋附近商家');
        setIsLoadingLocation(false);
        setNearbyMerchants(mockMerchants);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      setUserLocation({ lat: latitude, lng: longitude });

      // 取得附近商家
      await fetchNearbyPlaces(latitude, longitude);
      
    } catch (error) {
      console.error('定位錯誤：', error);
      Alert.alert('定位失敗', '無法取得您的位置，將顯示預設商家列表');
      setNearbyMerchants(mockMerchants);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // 直接呼叫 Google Places API
  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    setIsLoadingPlaces(true);
    try {
      const radius = 500; // 搜尋半徑 500 公尺
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&language=zh-TW&key=${GOOGLE_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Google API Error: ${data.status}`);
      }

      // 轉換為 Merchant 格式
      const merchants: Merchant[] = data.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity || '地址未提供',
        distance: calculateDistance(
          lat, 
          lng, 
          place.geometry.location.lat, 
          place.geometry.location.lng
        ),
        category: guessCategory(place.types, place.name),
        description: place.types ? place.types.slice(0, 3).join(' • ') : '',
        coordinates: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
      }));

      setNearbyMerchants(merchants);
      
    } catch (error) {
      console.error('取得附近商家失敗：', error);
      Alert.alert('載入失敗', '無法取得附近商家，將顯示預設列表');
      setNearbyMerchants(mockMerchants);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // 計算距離
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const R = 6371; // 地球半徑（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  // 根據 Google Places types 和名稱猜測分類
  const guessCategory = (types: string[] = [], name: string = ''): MerchantCategory => {
    const typeStr = types.join(' ').toLowerCase();
    const nameStr = name.toLowerCase();
    
    // 咖啡廳
    if (typeStr.includes('cafe') || nameStr.includes('coffee') || 
        nameStr.includes('咖啡') || nameStr.includes('星巴克') || 
        nameStr.includes('cama') || nameStr.includes('louisa')) {
      return MerchantCategory.COFFEE;
    }
    
    // 超商
    if (typeStr.includes('convenience_store') || 
        nameStr.includes('7-eleven') || nameStr.includes('familymart') ||
        nameStr.includes('全家') || nameStr.includes('萊爾富')) {
      return MerchantCategory.CONVENIENCE;
    }
    
    // 速食
    if (nameStr.includes('mcdonald') || nameStr.includes('kfc') ||
        nameStr.includes('burger') || nameStr.includes('麥當勞') ||
        nameStr.includes('肯德基') || nameStr.includes('摩斯')) {
      return MerchantCategory.FAST_FOOD;
    }
    
    // 購物
    if (typeStr.includes('shopping') || typeStr.includes('store') ||
        typeStr.includes('mall') || nameStr.includes('百貨')) {
      return MerchantCategory.SHOPPING;
    }
    
    // 餐廳
    if (typeStr.includes('restaurant') || typeStr.includes('food') ||
        nameStr.includes('餐廳') || nameStr.includes('restaurant')) {
      return MerchantCategory.RESTAURANT;
    }
    
    // 夜市
    if (nameStr.includes('夜市') || nameStr.includes('market')) {
      return MerchantCategory.NIGHT_MARKET;
    }
    
    return MerchantCategory.OTHER;
  };

  useEffect(() => {
    // 初始載入時取得使用者位置
    getUserLocation();
  }, []);

  // 搜尋過濾
  const filteredMerchants = nearbyMerchants.filter((merchant) =>
    merchant.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // 點擊商家
  const handleMerchantPress = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    navigation.navigate('Recommendation', { merchant });
  };

  // 取得商家分類圖示
  const getCategoryIcon = (category: MerchantCategory) => {
    const iconMap: { [key in MerchantCategory]: string } = {
      [MerchantCategory.COFFEE]: 'coffee',
      [MerchantCategory.RESTAURANT]: 'utensils',
      [MerchantCategory.CONVENIENCE]: 'shopping-bag',
      [MerchantCategory.FAST_FOOD]: 'fast-forward',
      [MerchantCategory.SHOPPING]: 'shopping-cart',
      [MerchantCategory.NIGHT_MARKET]: 'star',
      [MerchantCategory.OTHER]: 'map-pin',
    };
    return iconMap[category] || 'map-pin';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        {/* 頂部搜尋區 */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBar}>
            <TouchableOpacity 
              onPress={getUserLocation} 
              disabled={isLoadingLocation}
              style={{ marginRight: 8 }}
            >
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Feather name="map-pin" size={18} color="#007AFF" />
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="搜尋所在商家 / 線上網站"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#888"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Feather name="x" size={18} color="#888" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <Feather name="search" size={18} color="#888" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            )}
          </View>

          {/* 定位狀態提示 */}
          {userLocation && (
            <View style={styles.locationBadge}>
              <Feather name="navigation" size={12} color="#10B981" />
              <Text style={styles.locationText}>
                已定位 • 顯示附近 {nearbyMerchants.length} 個商家
              </Text>
            </View>
          )}

          {/* 快速篩選 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>全部</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>咖啡廳</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>餐廳</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>超商</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>購物</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 已啟用卡片提示 */}
        {cards.filter((c) => c.isActive).length > 0 && (
          <View style={styles.cardInfoBanner}>
            <Feather name="credit-card" size={16} color="#007AFF" />
            <Text style={styles.cardInfoText}>
              已啟用 {cards.filter((c) => c.isActive).length} 張信用卡
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('CardManagement')}>
              <Text style={styles.cardInfoLink}>管理</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 商家列表 */}
        <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              附近商家 ({filteredMerchants.length})
            </Text>
            {!isLoadingPlaces && (
              <TouchableOpacity onPress={getUserLocation} style={styles.refreshBtn}>
                <Feather name="refresh-cw" size={16} color="#007AFF" />
                <Text style={styles.refreshText}>重新整理</Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoadingPlaces ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>正在搜尋附近商家...</Text>
            </View>
          ) : (
            <>
              {filteredMerchants.map((merchant) => (
                <TouchableOpacity
                  key={merchant.id}
                  style={styles.merchantBtn}
                  onPress={() => handleMerchantPress(merchant)}
                  activeOpacity={0.7}
                >
                  <View style={styles.merchantIconWrapper}>
                    <Feather
                      name={getCategoryIcon(merchant.category) as any}
                      size={20}
                      color="#007AFF"
                    />
                  </View>
                  <View style={styles.merchantContent}>
                    <Text style={styles.merchantName}>{merchant.name}</Text>
                    <Text style={styles.merchantInfo}>
                      {merchant.distance} • {merchant.address}
                    </Text>
                    {merchant.description && (
                      <Text style={styles.merchantDesc}>{merchant.description}</Text>
                    )}
                  </View>
                  <Feather name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
              ))}

              {filteredMerchants.length === 0 && !isLoadingPlaces && (
                <View style={styles.emptyState}>
                  <Feather name="search" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>找不到相關商家</Text>
                  <TouchableOpacity 
                    style={styles.retryBtn}
                    onPress={getUserLocation}
                  >
                    <Text style={styles.retryText}>重新搜尋</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* 底部導航列 */}
        <BottomNav activeTab="home" />
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
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    backgroundColor: 'transparent',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  filterScroll: {
    marginTop: 8,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  cardInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  cardInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#007AFF',
  },
  cardInfoLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  merchantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  merchantIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  merchantContent: {
    flex: 1,
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
  merchantDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});