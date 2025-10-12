import requests
import json

# API 基礎網址
BASE_URL = "http://localhost:8000"

def test_get_card_by_exact_name():
    """測試：用完整卡片名稱查詢"""
    print("=" * 50)
    print("測試 1：用完整名稱查詢")
    print("=" * 50)
    
    card_name = "滙豐銀行滙鑽卡"
    url = f"{BASE_URL}/api/cards/by-name/{card_name}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ 成功找到卡片：{data['cardName']}")
            print(f"發卡銀行：{data['issuer']}")
            print(f"優惠類別：")
            for benefit in data['benefits']:
                print(f"  - {benefit['category']}: {benefit['rewardRate']}")
            print(f"標籤：{', '.join(data['tags'])}")
        else:
            print(f"❌ 查詢失敗：{response.status_code}")
            print(response.json())
    except Exception as e:
        print(f"❌ 發生錯誤：{e}")

def test_search_by_partial_name():
    """測試：用部分名稱搜尋"""
    print("\n" + "=" * 50)
    print("測試 2：用部分名稱搜尋")
    print("=" * 50)
    
    keyword = "滙豐"
    url = f"{BASE_URL}/api/cards/search-name"
    params = {"card_name": keyword}
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            cards = response.json()
            print(f"✅ 找到 {len(cards)} 張卡片包含 '{keyword}'：")
            for card in cards:
                print(f"  - {card['cardName']} ({card['issuer']})")
        else:
            print(f"❌ 搜尋失敗：{response.status_code}")
            print(response.json())
    except Exception as e:
        print(f"❌ 發生錯誤：{e}")

def test_list_all_cards():
    """測試：列出所有卡片"""
    print("\n" + "=" * 50)
    print("測試 3：列出所有卡片")
    print("=" * 50)
    
    url = f"{BASE_URL}/api/cards"
    params = {"limit": 5}  # 只顯示前 5 張
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            cards = response.json()
            print(f"✅ 資料庫中的卡片（顯示前 5 張）：")
            for card in cards:
                print(f"  - {card['cardName']} ({card['issuer']})")
        else:
            print(f"❌ 查詢失敗：{response.status_code}")
    except Exception as e:
        print(f"❌ 發生錯誤：{e}")

def test_get_stats():
    """測試：取得統計資訊"""
    print("\n" + "=" * 50)
    print("測試 4：統計資訊")
    print("=" * 50)
    
    url = f"{BASE_URL}/api/stats"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ 資料庫統計：")
            print(f"  總卡片數：{stats['total_cards']}")
            print(f"  發卡銀行數：{stats['issuers']['total']}")
            print(f"  標籤種類：{stats['tags']['total']}")
        else:
            print(f"❌ 查詢失敗：{response.status_code}")
    except Exception as e:
        print(f"❌ 發生錯誤：{e}")

if __name__ == "__main__":
    print("🚀 開始測試 FastAPI 信用卡 API")
    print("請確保 API 正在 http://localhost:8000 運行")
    print()
    
    # 執行所有測試
    test_get_card_by_exact_name()
    test_search_by_partial_name()
    test_list_all_cards()
    test_get_stats()
    
    print("\n" + "=" * 50)
    print("✨ 測試完成！")