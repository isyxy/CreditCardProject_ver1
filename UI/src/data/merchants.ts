// src/data/merchants.ts
import { Merchant, MerchantCategory } from '../types';

export const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: '星巴克 Starbucks 斗六門市',
    distance: '0.1公里',
    address: '大學路二段',
    category: MerchantCategory.COFFEE,
    description: '全球知名咖啡連鎖店'
  },
  {
    id: '2',
    name: 'Uniqlo 斗六大學路店',
    distance: '0.1公里',
    address: '大學路二段',
    category: MerchantCategory.SHOPPING,
    description: '日本休閒服飾品牌'
  },
  {
    id: '3',
    name: 'スシロー壽司郎 雲林斗六店',
    distance: '0.1公里',
    address: '大學路二段',
    category: MerchantCategory.RESTAURANT,
    description: '日本迴轉壽司連鎖'
  },
  {
    id: '4',
    name: '史堤克牛排斗六店',
    distance: '0.3公里',
    address: '大學路二段',
    category: MerchantCategory.RESTAURANT,
    description: '平價牛排連鎖餐廳'
  },
  {
    id: '5',
    name: 'CHICO 餐廚',
    distance: '0.3公里',
    address: '鎮南路',
    category: MerchantCategory.RESTAURANT,
    description: '義式料理餐廳'
  },
  {
    id: '6',
    name: '斗六觀光夜市',
    distance: '0.4公里',
    address: '鎮南路',
    category: MerchantCategory.NIGHT_MARKET,
    description: '在地知名夜市'
  },
  {
    id: '7',
    name: '圓圓窯香升降鍋物 斗六旗艦店',
    distance: '0.7公里',
    address: '莊敬路',
    category: MerchantCategory.RESTAURANT,
    description: '特色火鍋餐廳'
  },
  {
    id: '8',
    name: '斗六太平老街',
    distance: '1.1公里',
    address: '斗六市',
    category: MerchantCategory.OTHER,
    description: '歷史老街商圈'
  },
  {
    id: '9',
    name: '麥當勞斗六店',
    distance: '1.2公里',
    address: '斗六市',
    category: MerchantCategory.FAST_FOOD,
    description: '速食連鎖'
  },
  {
    id: '10',
    name: '肯德基斗六店',
    distance: '1.3公里',
    address: '斗六市',
    category: MerchantCategory.FAST_FOOD,
    description: '炸雞速食連鎖'
  },
  {
    id: '11',
    name: '星巴克斗六門市',
    distance: '1.4公里',
    address: '斗六市',
    category: MerchantCategory.COFFEE,
    description: '全球知名咖啡連鎖店'
  },
  {
    id: '12',
    name: '全家便利商店斗六店',
    distance: '1.5公里',
    address: '斗六市',
    category: MerchantCategory.CONVENIENCE,
    description: '24小時便利商店'
  },
  {
    id: '13',
    name: '7-ELEVEN斗六店',
    distance: '1.6公里',
    address: '斗六市',
    category: MerchantCategory.CONVENIENCE,
    description: '24小時便利商店'
  },
  {
    id: '14',
    name: '萊爾富斗六店',
    distance: '1.7公里',
    address: '斗六市',
    category: MerchantCategory.CONVENIENCE,
    description: '24小時便利商店'
  },
  {
    id: '15',
    name: 'OK超商斗六店',
    distance: '1.8公里',
    address: '斗六市',
    category: MerchantCategory.CONVENIENCE,
    description: '24小時便利商店'
  }
];