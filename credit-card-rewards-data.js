/**
 * 信用卡回饋規則資料庫
 * 包含各銀行信用卡的回饋計算規則
 */

const creditCardRewardsData = {
  cards: [
    // ========================================
    // 中國信託 OPENPOINT 聯名卡
    // ========================================
    {
      id: "ctbc-openpoint",
      name: "中國信託 OPENPOINT 聯名卡",
      bank: "中國信託",
      cardType: "聯名卡",
      rewardType: "OPENPOINT",
      rewardValue: 1, // 1點 = NT$1
      
      // 基礎回饋規則
      baseRewards: {
        domestic: {
          name: "國內一般消費",
          rate: 1,
          unit: "%",
          limit: null, // 無上限
          limitType: null
        },
        foreignOnline: {
          name: "國外一般消費",
          rate: 2,
          unit: "%",
          limit: null,
          limitType: null
        },
        foreignInStore: {
          name: "國外實體商店消費",
          rate: 3,
          unit: "%",
          limit: null,
          limitType: null
        }
      },
      
      // 特殊回饋規則
      specialRewards: {
        unified: {
          name: "統一企業集團消費",
          baseRate: 1,
          bonusRate: 2,
          totalRate: 3,
          unit: "%",
          limit: 500,
          limitType: "monthly", // 每月上限
          description: "基礎1% + 統一集團加碼2%",
          brands: [
            "統一超商", "康是美", "康是美網購eShop", "夢時代購物中心", 
            "統一時代百貨", "DREAM PLAZA", "UNIKCY", "玲廊滿藝",
            "BEING sport", "BEING spa", "BEING fit", "星巴克",
            "21Plus", "21風味館", "Mister Donut", "COLD STONE",
            "Semeur聖娜", "家樂福", "Mia C'bon", "Yahoo購物",
            "博客來", "聖德科斯", "統一生機", "統一精工速邁樂加油站",
            "foodomo", "鮮拾網", "DUSKIN", "黑貓宅急便",
            "ibon售票系統", "統一渡假村", "台北W飯店", "台北時代寓所"
          ]
        },
        unifiedBrandBonus: {
          name: "統一企業集團踩點任務",
          description: "每月登入中信APP領券 + 消費不同品牌",
          rates: {
            1: 0,  // 1個品牌：無加碼
            2: 1,  // 2個品牌：+1%
            3: 2,  // 3個品牌：+2%
            4: 3,  // 4個品牌：+3%
            5: 4   // 5個以上品牌：+4%
          },
          unit: "%",
          limit: 500,
          limitType: "monthly",
          maxRate: 4,
          requirement: "每月登入中信銀行APP領優惠券"
        }
      },
      
      // 最高回饋情境
      maxRewardScenarios: {
        unified: {
          name: "統一企業集團最高回饋",
          totalRate: 7,
          breakdown: "1%(基礎) + 2%(統一加碼) + 4%(踩點5品牌)",
          conditions: [
            "每月登入中信APP領券",
            "消費5個以上不同統一集團品牌",
            "統一集團加碼每月上限500點",
            "踩點任務每月上限500點"
          ]
        },
        foreign: {
          name: "國外實體店最高回饋",
          totalRate: 11,
          breakdown: "3%(國外實體) + 8%(指定國家加碼)",
          countries: ["日本", "韓國", "泰國", "越南", "菲律賓"],
          limit: 500,
          limitType: "monthly",
          conditions: [
            "每月登入中信APP領券",
            "於指定國家實體商店消費"
          ]
        }
      },
      
      // 排除項目
      exclusions: [
        "年費、利息、預借現金、違約金",
        "基金、賭博、數位貨幣",
        "學費、稅款、公用事業費",
        "儲值卡、儲值金",
        "eTag相關費用",
        "繳費平台交易"
      ],
      
      // 注意事項
      notes: [
        "OPENPOINT 1點 = NT$1",
        "統一集團加碼需符合品牌定義",
        "踩點任務需每月登入APP領券",
        "實際回饋以銀行公告為準"
      ]
    },
    
    // ========================================
    // 中國信託 LINE Pay 信用卡
    // ========================================
    {
      id: "ctbc-linepay",
      name: "中國信託 LINE Pay 信用卡",
      bank: "中國信託",
      cardType: "聯名卡",
      rewardType: "LINE POINTS",
      rewardValue: 1, // 1點 = NT$1
      
      // 基礎回饋規則
      baseRewards: {
        domestic: {
          name: "國內外一般消費",
          rate: 1,
          unit: "%",
          limit: null,
          limitType: null
        },
        foreignInStore: {
          name: "國外實體商店消費",
          rate: 2.8,
          unit: "%",
          limit: null,
          limitType: null,
          breakdown: "一般1% + 國外實體加碼1.8%",
          conditions: [
            "須為面對面交易",
            "實體卡/Apple Pay/Google Pay/Samsung Pay",
            "不含網路交易、條碼支付、第三方支付"
          ],
          period: "2025/7/1-2025/12/31"
        }
      },
      
      // 指定通路回饋（簡化版）
      specialRewards: {
        delivery: {
          name: "外送平台",
          rate: 5,
          unit: "%",
          limit: 100,
          limitType: "monthly",
          description: "Uber Eats/星巴克等，需VISA卡登錄",
          brands: ["Uber Eats", "foodpanda", "星巴克"],
          conditions: ["VISA卡", "需事先登錄", "每月限量10,000名"]
        },
        japanese: {
          name: "日式餐飲/購物",
          rate: 10,
          unit: "%",
          limit: 200,
          limitType: "activity", // 活動期間總上限
          description: "壽司郎/摩斯/藏壽司/唐吉訶德/UNIQLO/GU/宜得利等，需JCB卡登錄",
          brands: [
            "壽司郎", "摩斯漢堡", "藏壽司", "客美多咖啡",
            "唐吉訶德", "UNIQLO", "GU", "宜得利", "台灣虎航"
          ],
          conditions: ["JCB卡", "需事先登錄", "每月限量5,000名"]
        },
        shopping: {
          name: "網購平台",
          rate: 5,
          unit: "%",
          limit: 100,
          limitType: "monthly",
          description: "蝦皮等需VISA卡登錄；PChome等透過ShopBack 3%",
          brands: ["蝦皮購物", "PChome 24h", "Yahoo購物", "pinkoi"],
          conditions: ["VISA卡需登錄或透過ShopBack"]
        },
        beauty: {
          name: "美妝保養",
          rate: 7,
          unit: "%",
          limit: 150,
          limitType: "monthly",
          description: "屈臣氏週五/雅詩蘭黛等品牌官網6%",
          brands: ["屈臣氏", "POYA寶雅", "雅詩蘭黛", "LA MER", "MAC", "資生堂"],
          conditions: ["屈臣氏限週五", "部分品牌限官網", "LINE Pay支付"]
        },
        lifestyle: {
          name: "生活百貨",
          rate: 5,
          unit: "%",
          limit: 100,
          limitType: "monthly",
          description: "家樂福/IKEA等，需VISA卡登錄",
          brands: ["家樂福", "IKEA", "小北百貨", "dyson", "OWNDAYS"],
          conditions: ["VISA卡需登錄", "每月限量10,000名"]
        },
        travel: {
          name: "旅遊訂房",
          rate: 10,
          unit: "%",
          limit: 1800,
          limitType: "perTransaction", // 單筆上限
          description: "Hotels.com 16%(需代碼)/Klook 10%",
          brands: ["Hotels.com", "Klook", "易遊網", "KKday"],
          conditions: [
            "Hotels.com需輸入代碼CTBCLP16享16%",
            "Klook需輸入優惠代碼",
            "部分有每月名額限制"
          ]
        },
        gas: {
          name: "交通加油",
          rate: 5,
          unit: "%",
          limit: null,
          limitType: null,
          description: "NPC全國加油站自助加油",
          brands: ["NPC加油站"],
          conditions: ["限自助加油"]
        },
        transit: {
          name: "一卡通交通",
          rate: 1,
          unit: "%",
          limit: null,
          limitType: null,
          description: "需綁定LINE Pay卡之一卡通",
          includes: ["捷運", "輕軌", "台鐵", "公車", "公共自行車", "渡輪"],
          excludes: ["高鐵", "計程車"],
          conditions: ["須綁定LINE Pay卡之一卡通功能"],
          period: "2025/7/1-2025/12/31"
        }
      },
      
      // 最高回饋情境
      maxRewardScenarios: {
        hotelBooking: {
          name: "訂房最高回饋",
          totalRate: 16,
          platform: "Hotels.com",
          conditions: [
            "輸入優惠代碼CTBCLP16",
            "單筆回饋上限1,800點",
            "每月限額400組"
          ]
        },
        foreignJapanese: {
          name: "美日韓泰實體店",
          totalRate: 5,
          breakdown: "國外實體2.8% + 加碼2.2%",
          limit: 450,
          limitType: "activity",
          countries: ["美國", "日本", "韓國", "泰國"],
          conditions: ["需登錄", "限量名額"],
          period: "2025/10/1-2025/12/31"
        }
      },
      
      // 重要排除項目
      exclusions: [
        "全聯福利中心",
        "便利商店(7-11/全家/萊爾富/OK)",
        "電信費用",
        "儲值卡、儲值金(含自動儲值)",
        "eTag儲值與智慧停車",
        "年費、利息、預借現金",
        "基金、虛擬貨幣",
        "學費、稅款、公用事業費",
        "繳費平台交易",
        "部分歐洲地區實體店消費"
      ],
      
      // 注意事項
      notes: [
        "LINE POINTS 1點 = NT$1",
        "指定通路需登錄才享優惠(VISA或JCB)",
        "部分通路有每月名額限制",
        "VISA通路每月限量10,000名",
        "JCB通路每月限量5,000名",
        "實際回饋以銀行公告為準",
        "活動期間依各通路公告"
      ]
    },
    
    // ========================================
    // 台新 Richart 卡
    // ========================================
    {
      id: "taishin-richart",
      name: "台新 Richart 卡",
      bank: "台新銀行",
      cardType: "數位帳戶聯名卡",
      rewardType: "台新 Point",
      rewardValue: 1, // 1點 = NT$1
      
      // 切換刷機制
      switchMechanism: {
        description: "每日可切換一次方案",
        maxSwitchPerDay: 1,
        activeSchemes: 1, // 同時只能有1個方案享高回饋
        period: "2025/9/1-2025/12/31",
        requirement: "需符合卡友身分升級資格"
      },
      
      // 基礎回饋
      baseRewards: {
        general: {
          name: "一般消費",
          rate: 0.3,
          unit: "%",
          limit: null,
          description: "未選擇切換刷方案或非指定消費"
        }
      },
      
      // 7大切換刷方案
      switchSchemes: [
        {
          id: "pay-scheme",
          name: "Pay著刷",
          rate: 3.8,
          unit: "%",
          limit: null,
          description: "綁定台新Pay享11萬家通路",
          condition: "須使用台新Pay支付",
          merchants: [
            "新光三越", "7-11", "全家", "萊爾富", "OK超商",
            "IKEA", "路易莎咖啡", "台灣大車隊"
          ],
          note: "11萬家通路詳見台新Pay官網",
          priority: 1 // 最高回饋
        },
        {
          id: "digital-scheme",
          name: "數趣刷",
          rate: 3.3,
          unit: "%",
          limit: null,
          categories: {
            "網購平台": [
              "蝦皮", "momo", "酷澎Coupang", "PChome", "Yahoo",
              "Amazon", "東森", "博客來", "Richart Mart"
            ],
            "線上課程": [
              "Hahow", "PressPlay", "Amazing Talker", "Udemy",
              "Kobo", "Readmoo"
            ],
            "時尚品味": [
              "UNIQLO", "GU", "ZARA", "NET", "lativ", "GAP"
            ]
          }
        },
        {
          id: "travel-scheme",
          name: "玩旅刷",
          rate: 3.3,
          unit: "%",
          limit: null,
          categories: {
            "海外消費": "含線上及實體",
            "訂房旅行": [
              "Klook", "Agoda", "Booking.com", "Trip.com", "Airbnb",
              "Hotels.com", "Expedia", "雄獅旅遊", "易遊網", "東南旅遊"
            ],
            "航空公司": [
              "華航", "長榮", "星宇", "虎航", "國泰航空", "華信", "立榮"
            ]
          }
        },
        {
          id: "daily-scheme",
          name: "天天刷",
          rate: 3.3,
          unit: "%",
          limit: null,
          categories: {
            "超商量販": [
              "7-11", "全家", "家樂福", "大買家"
            ],
            "通勤交通": [
              "台鐵", "高鐵", "台灣大車隊", "Yoxi", "Uber"
            ],
            "停車租車": [
              "嘟嘟房", "Autopass車麻吉", "城市車旅", "ViViPark",
              "USPACE", "UDRIVE", "iRent", "和運租車", "格上租車"
            ]
          },
          note: "7-11及全家限使用台新Pay綁定支付"
        },
        {
          id: "shopping-scheme",
          name: "大筆刷",
          rate: 3.3,
          unit: "%",
          limit: null,
          categories: {
            "指定百貨": [
              "新光三越", "遠東SOGO", "廣三SOGO", "遠東百貨", "微風",
              "台北101", "遠東巨城", "南紡購物中心", "漢神百貨",
              "漢神巨蛋", "誠品生活"
            ],
            "指定Outlet": [
              "MITSUI OUTLET PARK(林口/台中港/台南)",
              "Mitsui Shopping Park LaLaport(南港/台中)",
              "華泰名品城", "SKM Park Outlets"
            ],
            "居家裝修": [
              "IKEA", "特力屋", "HOLA", "宜得利", "瑪黑家居"
            ]
          }
        },
        {
          id: "dining-scheme",
          name: "好饗刷",
          rate: 3.3,
          unit: "%",
          limit: null,
          categories: {
            "全台餐飲": "不含餐券",
            "外送平台": ["Uber Eats", "Foodpanda"],
            "指定飯店": [
              "晶華國際酒店集團", "台灣萬豪國際集團", "煙波飯店",
              "老爺酒店集團", "福華集團", "漢來飯店事業群",
              "台北君悅酒店", "高雄洲際酒店", "礁溪寒沐"
            ],
            "加油充電": [
              "中油直營", "台亞直營", "全國加油",
              "源點EVOASIS", "華城電能EVALUE"
            ],
            "展演購票": [
              "拓元售票", "KKTIX", "年代售票", "寬宏售票",
              "OPENTIX兩廳院文化生活"
            ],
            "指定樂園": [
              "義大遊樂世界", "麗寶樂園", "六福村", "九族文化村",
              "劍湖山世界", "X-Park", "國立海洋生物博物館",
              "遠雄海洋公園", "大魯閣", "小人國主題樂園"
            ]
          },
          note: "指定飯店不含餐券、住宿券等票券"
        },
        {
          id: "weekend-scheme",
          name: "假日刷",
          rate: 2,
          unit: "%",
          limit: null,
          description: "國內節假日不限通路消費",
          condition: "含LINE Pay及街口支付",
          applicableDays: ["週六", "週日", "國定假日"]
        }
      ],
      
      // 簡化版分類（給UI使用）
      simplifiedCategories: {
        "台新Pay通路": {
          rate: 3.8,
          scheme: "pay-scheme",
          description: "使用台新Pay支付於11萬家通路",
          examples: ["新光三越", "四大超商", "IKEA", "路易莎"]
        },
        "網購/線上課程": {
          rate: 3.3,
          scheme: "digital-scheme",
          description: "網購平台、線上課程、時尚品牌",
          examples: ["蝦皮", "momo", "PChome", "UNIQLO", "Hahow"]
        },
        "海外/旅遊": {
          rate: 3.3,
          scheme: "travel-scheme",
          description: "海外消費、訂房旅行、航空公司",
          examples: ["海外消費", "Klook", "Agoda", "華航", "長榮"]
        },
        "超商/交通": {
          rate: 3.3,
          scheme: "daily-scheme",
          description: "超商量販、通勤交通、停車租車",
          examples: ["7-11", "全家", "高鐵", "台鐵", "Uber"]
        },
        "百貨/居家": {
          rate: 3.3,
          scheme: "shopping-scheme",
          description: "指定百貨、Outlet、居家裝修",
          examples: ["新光三越", "SOGO", "IKEA", "HOLA"]
        },
        "餐飲/娛樂": {
          rate: 3.3,
          scheme: "dining-scheme",
          description: "餐飲、外送、飯店、加油、展演、樂園",
          examples: ["全台餐飲", "Uber Eats", "中油", "晶華", "六福村"]
        },
        "假日消費": {
          rate: 2,
          scheme: "weekend-scheme",
          description: "週六日及國定假日不限通路",
          examples: ["任何消費"]
        }
      },
      
      // 排除項目
      exclusions: [
        "指定消費排除項目詳見台新官網"
      ],
      
      // 注意事項
      notes: [
        "台新Point 1點 = NT$1",
        "每日可切換一次方案",
        "同時只能有1個方案享高回饋",
        "其他消費一律0.3%回饋",
        "需符合卡友身分升級資格",
        "活動期間：2025/9/1-2025/12/31",
        "回饋無上限",
        "7-11及全家需使用台新Pay支付才享3.3%",
        "實際回饋以銀行公告為準"
      ]
    },
    
    // ========================================
    // 玉山 Unicard
    // ========================================
    {
      id: "esun-unicard",
      name: "玉山 Unicard",
      bank: "玉山銀行",
      cardType: "數位帳戶聯名卡",
      rewardType: "玉山 e point",
      rewardValue: 1, // 1點 = NT$1
      
      // 活動期間
      period: "2025/10/1-2026/6/30",
      
      // 方案選擇機制
      schemeMechanism: {
        description: "每月最後一日的方案計算整月回饋",
        settlementRule: "消費需於次月10號前請款",
        rewardDate: "次月17日發放",
        calculation: "正附卡消費合併計算，回饋予正卡",
        rounding: "逐筆四捨五入至整數，未滿1點不回饋"
      },
      
      // 基礎回饋
      baseRewards: {
        eBillOnly: {
          name: "僅申辦帳單e化",
          rate: 0.3,
          unit: "%",
          limit: null,
          condition: "申請Email電子帳單或簡訊帳單"
        },
        eBillAndAutoPay: {
          name: "帳單e化 + 自動扣繳",
          rate: 1,
          unit: "%",
          limit: null,
          condition: "同時申請帳單e化與玉山銀行台幣帳戶自動扣繳，且成功扣繳卡費"
        }
      },
      
      // 三大方案
      schemes: [
        {
          id: "up-scheme",
          name: "UP選",
          specialRate: 3.5,
          unit: "%",
          monthlyLimit: 5000,
          limitType: "歸戶上限",
          description: "百大全部特店都享3.5%",
          totalWithBase: 4.5, // 3.5% + 1%
          newUserBonus: {
            rate: 3,
            merchants: ["LINE Pay", "Uber Eats", "家樂福", "全盈+PAY", "韓國"],
            monthlyLimit: 500,
            totalRate: 7.5, // 3.5% + 3% + 1%
            condition: "需於2025/10/1-2025/12/31申辦且核卡"
          }
        },
        {
          id: "custom-scheme",
          name: "任意選",
          specialRate: 2.5,
          unit: "%",
          monthlyLimit: 1000,
          limitType: "歸戶上限",
          description: "自選8家百大特店享2.5%",
          selectableCount: 8,
          totalWithBase: 3.5, // 2.5% + 1%
          newUserBonus: {
            rate: 3,
            merchants: ["LINE Pay", "Uber Eats", "家樂福", "全盈+PAY", "韓國"],
            monthlyLimit: 500,
            totalRate: 6.5, // 2.5% + 3% + 1%
            condition: "需於2025/10/1-2025/12/31申辦且核卡"
          }
        },
        {
          id: "simple-scheme",
          name: "簡單選",
          specialRate: 2,
          unit: "%",
          monthlyLimit: 1000,
          limitType: "歸戶上限",
          description: "免選即享2%",
          totalWithBase: 3, // 2% + 1%
          newUserBonus: {
            rate: 3,
            merchants: ["LINE Pay", "Uber Eats", "家樂福", "全盈+PAY", "韓國"],
            monthlyLimit: 500,
            totalRate: 6, // 2% + 3% + 1%
            condition: "需於2025/10/1-2025/12/31申辦且核卡"
          }
        }
      ],
      
      // 百大指定消費特店
      top100Merchants: {
        "行動支付": [
          "玉山Wallet電子支付", "LINE Pay", "全支付", "街口支付",
          "悠遊付", "全盈+PAY", "iPASS MONEY", "icash Pay"
        ],
        "電商平台": [
          "momo購物網", "蝦皮購物", "淘寶網", "Coupang酷澎"
        ],
        "國內百貨": [
          "新光三越百貨", "台北101", "華泰名品城", "三井OUTLET",
          "京站", "美麗華", "秀泰生活", "LaLaport", "統領廣場",
          "采盟", "昇恆昌", "統一時代百貨台北店", "遠東百貨集團",
          "漢神百貨", "微風百貨", "誠品生活"
        ],
        "生活採買": [
          "家樂福", "屈臣氏", "康是美", "特力屋", "HOLA",
          "hoi好好生活", "UNIQLO", "NET", "大樹藥局", "丁丁藥妝"
        ],
        "餐飲美食": [
          "Uber Eats", "foodpanda", "EZTABLE", "王品瘋Pay",
          "饗賓餐飲", "瓦城料理", "乾杯燒肉", "漢來美食",
          "鼎王餐飲", "爭鮮餐飲"
        ],
        "加油交通": [
          "台灣中油直營", "台灣大車隊", "台鐵", "高鐵", "Uber", "Yoxi"
        ],
        "航空旅遊": [
          "中華航空", "長榮航空", "日本航空", "台灣虎航", "樂桃航空",
          "酷航", "Trip.com", "Booking.com", "Hotels.com", "AsiaYo",
          "Expedia", "KKday", "Klook", "雄獅旅遊", "可樂旅遊",
          "東南旅遊", "Agoda"
        ],
        "國外實體": [
          "日本", "韓國", "泰國", "越南", "新加坡", "馬來西亞",
          "菲律賓", "中國", "香港", "澳門", "美國", "加拿大",
          "英國", "法國", "德國", "義大利", "澳洲"
        ],
        "精選商家": [
          "Apple直營店", "小米台灣", "全國電子", "燦坤", "迪卡儂"
        ],
        "ESG永續": [
          "玉山Wallet愛心捐款", "特斯拉", "Gogoro電池資費", "YouBike 2.0"
        ]
      },
      
      // 簡化版分類（給UI使用）
      simplifiedCategories: {
        "行動支付": {
          merchants: ["LINE Pay", "全支付", "街口支付", "悠遊付", "全盈+PAY"],
          note: "須使用實體卡綁定，直接用第三方支付不認列"
        },
        "電商平台": {
          merchants: ["momo購物網", "蝦皮購物", "Coupang酷澎"]
        },
        "百貨購物": {
          merchants: ["新光三越", "遠東百貨", "微風", "台北101", "三井OUTLET"]
        },
        "超市藥妝": {
          merchants: ["家樂福", "屈臣氏", "康是美", "UNIQLO"]
        },
        "餐飲外送": {
          merchants: ["Uber Eats", "foodpanda", "王品", "饗賓", "瓦城"]
        },
        "交通加油": {
          merchants: ["中油直營", "高鐵", "台鐵", "台灣大車隊", "Uber"]
        },
        "旅遊訂房": {
          merchants: ["Klook", "KKday", "Agoda", "Trip.com", "Hotels.com"]
        },
        "航空公司": {
          merchants: ["中華航空", "長榮航空", "虎航"]
        },
        "國外消費": {
          merchants: ["日本", "韓國", "泰國", "美國", "歐洲各國"]
        },
        "3C家電": {
          merchants: ["Apple直營店", "全國電子", "燦坤"]
        }
      },
      
      // 重要認列規則
      recognitionRules: {
        cardType: "須使用實體卡或綁定Apple Pay/Google Pay/Samsung Pay",
        thirdPartyPayment: "透過第三方支付錢包會歸類為行動支付特店，不認列為原特店",
        billName: {
          "LINE Pay": "需顯示「連加*」或「LINEPAY*」",
          "新光三越": "需顯示「新光三越*」",
          "饗賓餐飲": "需顯示「饗賓餐旅*」"
        },
        exclusions: [
          "設於百貨/商場/飯店內，帳單名稱無法判別原特店",
          "超商、各項稅費等非一般消費"
        ]
      },
      
      // 排除項目
      exclusions: [
        "特店分期付款",
        "歐盟實體交易",
        "百大指定消費分期",
        "超商消費",
        "各項稅費繳納",
        "其他一般消費不包含項目詳見官網"
      ],
      
      // 注意事項
      notes: [
        "玉山e point 1點 = NT$1",
        "以每月最後一日方案計算整月回饋",
        "消費需於次月10號前請款",
        "回饋於次月17日發放",
        "須使用實體卡，不可透過第三方支付",
        "逐筆四捨五入至整數，未滿1點不回饋",
        "UP選每月上限5,000點",
        "任意選/簡單選每月上限1,000點",
        "新戶訂閱升級需於2025/10/1-12/31申辦核卡",
        "新戶訂閱升級每月上限500點",
        "實際回饋以銀行公告為準"
      ]
    },
    
    // ========================================
    // 國泰世華 CUBE 卡
    // ========================================
    {
      id: "cathay-cube",
      name: "國泰世華 CUBE 卡",
      bank: "國泰世華銀行",
      cardType: "數位生活信用卡",
      rewardType: "小樹點",
      rewardValue: 1, // 1點 = NT$1
      
      // 切換機制
      switchMechanism: {
        description: "每日可切換一次權益方案",
        maxSwitchPerDay: 1,
        limit: null // 無回饋上限
      },
      
      // 基礎回饋
      baseRewards: {
        general: {
          name: "一般消費",
          rate: 0.3,
          unit: "%",
          limit: null
        }
      },
      
      // 主要權益方案（4選1）
      mainSchemes: [
        {
          id: "digital-scheme",
          name: "玩數位",
          rate: 3,
          unit: "%",
          limit: null,
          period: "2025/7/1-2025/12/31",
          categories: {
            "AI工具": [
              "ChatGPT", "Canva", "Claude", "Cursor", "Duolingo",
              "Gamma", "Gemini", "Notion", "Perplexity", "Speak"
            ],
            "數位/串流平台": [
              "Apple媒體服務", "Google Play", "Disney+", "Netflix",
              "Spotify", "KKBOX", "YouTube Premium", "Max"
            ],
            "網購平台": [
              "蝦皮購物", "momo購物網", "PChome 24h購物", "小樹購"
            ],
            "國際電商": [
              "Coupang酷澎(台灣)", "淘寶/天貓"
            ]
          },
          note: "分期付款僅享0.3%"
        },
        {
          id: "dining-shopping-scheme",
          name: "樂饗購",
          rate: 3,
          unit: "%",
          limit: null,
          period: "2025/7/1-2025/12/31",
          categories: {
            "國內指定百貨": [
              "遠東SOGO百貨", "新光三越", "微風廣場", "遠東百貨",
              "誠品生活", "統一時代台北店", "台北101", "Big City遠東巨城",
              "中友百貨", "廣三SOGO", "夢時代", "漢神百貨", "漢神巨蛋",
              "MITSUI OUTLET PARK", "LaLaport", "華泰名品城",
              "義大世界購物廣場", "秀泰生活", "環球購物中心"
            ],
            "外送平台": ["Uber Eats", "foodpanda"],
            "國內餐飲": [
              "麥當勞",
              "小額支付餐廳(拉亞漢堡、黑沃咖啡、SUBWAY、50嵐、八方雲集等)"
            ],
            "國內藥妝": ["康是美", "屈臣氏"]
          },
          note: "不包含百貨內店中櫃(UNIQLO、GU、ZARA、H&M等)，以簽單特店名稱為準"
        },
        {
          id: "travel-scheme",
          name: "趣旅行",
          rate: 3,
          unit: "%",
          limit: null,
          period: "2025/7/1-2025/12/31",
          categories: {
            "海外實體消費": "含國外餐飲、飯店到店付款等",
            "日本指定遊樂園": [
              "東京迪士尼樂園",
              "東京華納兄弟哈利波特影城",
              "大阪環球影城(USJ)"
            ],
            "指定國內外交通": [
              "Apple錢包交通卡(SUICA、PASMO、ICOCA)",
              "Uber", "Grab", "台灣高鐵", "yoxi",
              "台灣大車隊", "iRent", "和運租車", "格上租車"
            ],
            "指定航空公司": [
              "中華航空", "長榮航空", "星宇航空", "台灣虎航",
              "國泰航空", "樂桃航空", "阿聯酋航空", "酷航",
              "捷星航空", "日本航空", "ANA全日空", "亞洲航空",
              "聯合航空", "新加坡航空", "越捷航空", "大韓航空",
              "達美航空", "土耳其航空", "卡達航空", "法國航空"
            ],
            "指定飯店住宿": [
              "星野集團", "全球迪士尼飯店", "東橫INN"
            ],
            "旅遊/訂房平台": [
              "KKday", "Agoda", "Klook", "Airbnb",
              "Booking.com", "Trip.com"
            ],
            "指定旅行社": [
              "ezTravel易遊網", "雄獅旅遊", "可樂旅遊",
              "東南旅遊", "五福旅遊", "燦星旅遊", "山富旅遊",
              "長汎假期", "鳳凰旅行社", "Ezfly易飛網"
            ]
          },
          notes: [
            "航空限官網/APP/臨櫃購票，不含旅行社",
            "不含機上免稅、貴賓室、哩程兌換費用",
            "飯店限官網/臨櫃訂房，不含旅行社",
            "訂房平台可能有延遲授權問題"
          ]
        },
        {
          id: "essentials-scheme",
          name: "集精選",
          rate: 2,
          unit: "%",
          limit: null,
          period: "2025/7/1-2025/12/31",
          categories: {
            "量販超市": [
              "家樂福", "LOPIA台灣", "全聯福利中心(不含大全聯)"
            ],
            "指定加油": [
              "台灣中油-直營站"
            ],
            "指定超商": [
              "7-ELEVEN實體門市", "全家便利商店"
            ],
            "生活家居": [
              "IKEA宜家家居"
            ]
          }
        }
      ],
      
      // 限定加碼權益
      specialSchemes: [
        {
          id: "birthday-scheme",
          name: "慶生月",
          rate: [3.5, 10],
          unit: "%",
          limit: null,
          period: "2025/10/1-2025/12/31",
          mission: {
            description: "生日當月消費3筆NT$500以上集3章",
            reward: 200,
            rewardType: "小樹點"
          },
          categories: {
            "南台灣餐廳(10%)": [
              "小方舟串燒酒場", "毛丼丼飯專門店", "汕頭泉成沙茶潮鍋",
              "高廬法式餐館", "八八口頂級燒肉", "Gien Jia挑食"
            ],
            "燒肉火鍋(10%)": [
              "UNCLE SHAWN燒肉餐酒館", "二本松涮涮屋", "橋山壽喜燒",
              "詹記麻辣火鍋", "無老鍋", "鼎王麻辣鍋"
            ],
            "環境友善餐廳(10%)": [
              "野驢小餐館", "aMaze心宴", "陽明春天", "東雅小廚"
            ],
            "甜點餐酒(10%)": [
              "教父牛排台北漢來", "Wagyu Club和牛俱樂部", "紅葉蛋糕",
              "珠寶盒法式點心坊", "蘿芙甜點Loft Pâtisserie"
            ],
            "日本樂園娛樂(10%)": [
              "東京迪士尼樂園", "大阪環球影城(USJ)",
              "PlayStation", "Nintendo", "巴哈姆特動畫瘋"
            ],
            "KTV美妝(10%)": [
              "肌膚之鑰台灣官網", "錢櫃KTV", "好樂迪KTV",
              "星聚點KTV", "享溫馨KTV"
            ],
            "生活購物(3.5%)": [
              "新光三越", "Uber Eats", "Klook", "FunNow"
            ]
          },
          條件: [
            "壽星須於生日前月20日前持有CUBE卡正卡",
            "不適用設於百貨/飯店/商場內門市",
            "以簽單特店名稱為準"
          ]
        },
        {
          id: "linepay-scheme",
          name: "來支付",
          rate: 2,
          unit: "%",
          limit: null,
          period: "2025/7/1-2025/11/30",
          description: "使用CUBE卡綁定LINE Pay消費",
          適用通路: "依LINE Pay公告為準",
          切換條件: [
            "當日完成CUBE卡綁定Apple Pay/Google Pay/Samsung Pay",
            "次日上午08:00後方可切換"
          ],
          排除項目: ["繳費稅相關(如電信費)"]
        },
        {
          id: "family-scheme",
          name: "童樂匯",
          rate: [5, 10],
          unit: "%",
          limit: null,
          period: "2025/8/1-2025/12/31",
          解鎖條件: [
            "客戶與未成年子女須持有國泰銀行帳戶",
            "客戶須持有CUBE卡正卡",
            "未成年子女須為2007/7/1以後出生",
            "客戶須登記為法定代理人/監護人",
            "每月20日前符合條件，次月1日起可切換"
          ],
          categories: {
            "親子餐廳(10%)": [
              "大樹先生的家", "Money Jump親子餐廳",
              "淘憩時光親子餐廳", "大房子親子餐廳樂園",
              "小島3.5度親子餐廳", "咱們小時候"
            ],
            "嬰幼童品牌官網(10%)": [
              "10mois台灣官網", "Mamas&Papas台灣官網",
              "Nuna品牌官網", "cybex台灣官網"
            ],
            "五感體驗課(10%)": [
              "朱宗慶打擊樂教學系統", "雲門舞集舞蹈教室",
              "Yamaha音樂教室", "TutorABC Junior", "Cambly Kids",
              "iSKI滑雪俱樂部", "汐游寶寶", "國立臺灣科學教育館"
            ],
            "親子育樂(5%)": [
              "Klook", "東京迪士尼樂園", "大阪環球影城(USJ)",
              "麗寶樂園", "六福村主題樂園", "九族文化村",
              "劍湖山世界", "義大遊樂世界", "小叮噹科學園區"
            ],
            "親子飯店(5%)": [
              "蘭城晶英酒店", "礁溪寒沐酒店", "煙波大飯店新竹湖濱館",
              "雲品溫泉酒店", "和逸飯店", "義大皇家酒店",
              "高雄洲際酒店", "墾丁凱撒大飯店", "瑞穗天合國際觀光酒店"
            ],
            "母嬰用品店(5%)": [
              "卡多摩嬰童館", "營養銀行", "安琪兒婦嬰百貨",
              "宜兒樂", "麗兒采家", "媽媽餵mamaway"
            ]
          },
          notes: [
            "限教學課程，不含教材教具",
            "遊樂園限現場或官網購票",
            "飯店限官網訂房",
            "不含嬰幼兒奶粉及藥品"
          ]
        }
      ],
      
      // 簡化版分類（給UI使用）
      simplifiedCategories: {
        "數位串流": {
          rate: 3,
          scheme: "digital-scheme",
          merchants: ["Netflix", "Spotify", "ChatGPT", "蝦皮", "momo"]
        },
        "百貨餐飲": {
          rate: 3,
          scheme: "dining-shopping-scheme",
          merchants: ["新光三越", "SOGO", "Uber Eats", "麥當勞", "屈臣氏"]
        },
        "旅遊交通": {
          rate: 3,
          scheme: "travel-scheme",
          merchants: ["海外消費", "華航", "Klook", "Agoda", "高鐵"]
        },
        "超市加油": {
          rate: 2,
          scheme: "essentials-scheme",
          merchants: ["全聯", "家樂福", "7-11", "全家", "中油"]
        },
        "LINE Pay": {
          rate: 2,
          scheme: "linepay-scheme",
          merchants: ["LINE Pay合作通路"]
        }
      },
      
      // 排除項目
      exclusions: [
        "分期付款(自2024/2/1起僅享0.3%)",
        "百貨內店中櫃(UNIQLO、GU、ZARA等)",
        "機上免稅商品、貴賓室",
        "航空哩程兌換費用",
        "旅行社購買之航空機票",
        "設於百貨/飯店/商場內門市(部分優惠)",
        "大全聯",
        "嬰幼兒奶粉及藥品(童樂匯)"
      ],
      
      // 注意事項
      notes: [
        "小樹點 1點 = NT$1",
        "每日可切換一次權益方案",
        "回饋無上限",
        "以簽單特店名稱為準，非發票名稱",
        "百貨不含店中櫃",
        "航空限官網/APP/臨櫃購票",
        "飯店限官網/臨櫃訂房",
        "來支付需先綁定國際行動支付",
        "慶生月需生日前月20日前持卡",
        "童樂匯需符合解鎖條件",
        "實際回饋以銀行公告為準"
      ]
    }
  ]
};

// 匯出資料
if (typeof module !== 'undefined' && module.exports) {
  module.exports = creditCardRewardsData;
}

// 瀏覽器環境下也可使用
if (typeof window !== 'undefined') {
  window.creditCardRewardsData = creditCardRewardsData;
}
