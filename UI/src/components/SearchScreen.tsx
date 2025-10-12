// src/components/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { mockMerchants } from '../data/merchants';
import { Merchant, MerchantCategory } from '../types';
import BottomNav from './BottomNav';

const SEARCH_HISTORY_KEY = '@search_history';
const MAX_HISTORY = 5;

const popularSearches = [
  '星巴克',
  '麥當勞',
  '全家',
  '7-11',
  'Uniqlo',
];

const categoryFilters = [
  { key: 'all', label: '全部', icon: 'grid' },
  { key: MerchantCategory.COFFEE, label: '咖啡廳', icon: 'coffee' },
  { key: MerchantCategory.RESTAURANT, label: '餐廳', icon: 'utensils' },
  { key: MerchantCategory.CONVENIENCE, label: '超商', icon: 'shopping-bag' },
  { key: MerchantCategory.SHOPPING, label: '購物', icon: 'shopping-cart' },
];

export default function SearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // 載入搜尋歷史 (實際應用可使用 AsyncStorage)
    // loadSearchHistory();
  }, []);

  const filteredMerchants = mockMerchants.filter((merchant) => {
    const matchQuery =
      searchQuery === '' ||
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === 'all' || merchant.category === selectedCategory;

    return matchQuery && matchCategory;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);

    // 儲存到搜尋歷史
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory].slice(0, MAX_HISTORY);
      setSearchHistory(newHistory);
      // 實際應用可在這裡存到 AsyncStorage
    }
  };

  const handleMerchantSelect = (merchant: Merchant) => {
    handleSearch(merchant.name);
    navigation.navigate('Recommendation', { merchant });
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <View style={styles.container}>
        {/* 頂部搜尋區 */}
        <View style={styles.searchHeader}>
          <View style={styles.searchBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={20} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="搜尋商家、地址或分類"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#888"
              autoFocus
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Feather name="x" size={20} color="#888" />
              </TouchableOpacity>
            ) : (
              <Feather name="search" size={20} color="#888" />
            )}
          </View>

          {/* 分類篩選 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {categoryFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.categoryChip,
                  selectedCategory === filter.key && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(filter.key)}
              >
                <Feather
                  name={filter.icon as any}
                  size={14}
                  color={selectedCategory === filter.key ? '#fff' : '#666'}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === filter.key && styles.categoryTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.content}>
          {!isSearching ? (
            <>
              {/* 搜尋歷史 */}
              {searchHistory.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>最近搜尋</Text>
                    <TouchableOpacity onPress={clearHistory}>
                      <Text style={styles.clearText}>清除</Text>
                    </TouchableOpacity>
                  </View>
                  {searchHistory.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.historyItem}
                      onPress={() => handleSearch(item)}
                    >
                      <Feather name="clock" size={16} color="#888" />
                      <Text style={styles.historyText}>{item}</Text>
                      <Feather name="arrow-up-left" size={16} color="#ccc" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* 熱門搜尋 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>熱門搜尋</Text>
                <View style={styles.popularTags}>
                  {popularSearches.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.popularTag}
                      onPress={() => handleSearch(item)}
                    >
                      <Text style={styles.popularTagText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 附近商家 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>附近商家</Text>
                {mockMerchants.slice(0, 5).map((merchant) => (
                  <TouchableOpacity
                    key={merchant.id}
                    style={styles.merchantItem}
                    onPress={() => handleMerchantSelect(merchant)}
                  >
                    <View style={styles.merchantIcon}>
                      <Feather
                        name={getCategoryIcon(merchant.category) as any}
                        size={20}
                        color="#4F8EF7"
                      />
                    </View>
                    <View style={styles.merchantInfo}>
                      <Text style={styles.merchantName}>{merchant.name}</Text>
                      <Text style={styles.merchantMeta}>
                        {merchant.distance} • {merchant.address}
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <>
              {/* 搜尋結果 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  搜尋結果 ({filteredMerchants.length})
                </Text>
                {filteredMerchants.length > 0 ? (
                  filteredMerchants.map((merchant) => (
                    <TouchableOpacity
                      key={merchant.id}
                      style={styles.merchantItem}
                      onPress={() => handleMerchantSelect(merchant)}
                    >
                      <View style={styles.merchantIcon}>
                        <Feather
                          name={getCategoryIcon(merchant.category) as any}
                          size={20}
                          color="#4F8EF7"
                        />
                      </View>
                      <View style={styles.merchantInfo}>
                        <Text style={styles.merchantName}>{merchant.name}</Text>
                        <Text style={styles.merchantMeta}>
                          {merchant.distance} • {merchant.address}
                        </Text>
                        {merchant.description && (
                          <Text style={styles.merchantDesc}>{merchant.description}</Text>
                        )}
                      </View>
                      <Feather name="chevron-right" size={20} color="#ccc" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Feather name="search" size={48} color="#ccc" />
                    <Text style={styles.emptyText}>找不到「{searchQuery}」相關結果</Text>
                    <Text style={styles.emptyHint}>試試其他關鍵字或分類</Text>
                  </View>
                )}
              </View>
            </>
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
  searchHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    marginHorizontal: 12,
  },
  categoryScroll: {
    maxHeight: 44,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#4F8EF7',
  },
  categoryText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  clearText: {
    fontSize: 14,
    color: '#4F8EF7',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  historyText: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    marginLeft: 12,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -8,
  },
  popularTag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  popularTagText: {
    fontSize: 14,
    color: '#666',
  },
  merchantItem: {
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
  merchantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    marginBottom: 2,
  },
  merchantMeta: {
    fontSize: 12,
    color: '#888',
  },
  merchantDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
  },
});