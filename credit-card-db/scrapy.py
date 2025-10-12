import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import re

def setup_driver():
    """設定Chrome驅動器"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # 如果不需要顯示瀏覽器視窗，可以取消註解
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    return webdriver.Chrome(options=chrome_options)

def scrape_card_data(url, card_name, wait_time=6):
    """通用爬取函數"""
    driver = setup_driver()
    try:
        print(f"🔍 正在爬取: {card_name}")
        driver.get(url)
        time.sleep(wait_time)
        
        soup = BeautifulSoup(driver.page_source, "html.parser")
        
        # 移除不需要的元素
        for tag in soup(["script", "style", "noscript", "nav", "footer", "header"]):
            tag.decompose()
        
        # 移除廣告和不相關區塊
        for ad in soup.find_all(class_=lambda x: x and any(keyword in x.lower() for keyword in ['ad', 'banner', 'menu', 'sidebar'])):
            ad.decompose()
        
        # 獲取文字內容
        all_text = soup.get_text(separator="\n", strip=True)
        
        # 清理文字
        all_lines = []
        for line in all_text.split('\n'):
            line = line.strip()
            if line and len(line) > 1 and not line.isspace():
                all_lines.append(line)
        
        if not all_lines:
            all_lines.append(f"⚠️ 無法擷取內容: {url}")
        
        print(f"✅ 成功爬取 {card_name}: {len(all_lines)} 行內容")
        return all_lines
        
    except Exception as e:
        print(f"❌ 爬取失敗 {card_name}: {e}")
        return [f"錯誤: 無法爬取 {card_name}", f"網址: {url}", f"錯誤訊息: {str(e)}"]
    finally:
        driver.quit()


# =============================================================================
# 台新銀行信用卡函數
# =============================================================================

def scrape_taishin_card():
    url = "https://www.taishinbank.com.tw/TSB/personal/credit/intro/overview/cg047/card001/"
    return scrape_card_data(url, "台新信用卡", wait_time=8)

# =============================================================================
# 永豐銀行信用卡函數
# =============================================================================

def scrape_sinopac_dawho_card():
    """永豐銀行 - DAWHO卡"""
    url = "https://bank.sinopac.com/sinopacBT/personal/credit-card/introduction/bankcard/DAWHO.html"
    return scrape_card_data(url, "DAWHO卡", wait_time=6)

def scrape_sinopac_daway_card():
    """永豐銀行 - DAWAY卡"""
    url = "https://bank.sinopac.com/sinopacBT/personal/credit-card/introduction/bankcard/DAWAY.html"
    return scrape_card_data(url, "DAWAY卡", wait_time=6)

# =============================================================================
# 匯豐銀行信用卡函數
# =============================================================================

def scrape_hsbc_cashback_card():
    """匯豐銀行 - 現金回饋御璽卡"""
    url = "https://www.hsbc.com.tw/credit-cards/products/cashback-titanium/"
    return scrape_card_data(url, "現金回饋御璽卡", wait_time=8)

def scrape_hsbc_liveplus_card():
    """匯豐銀行 - LivePlus悠活卡"""
    url = "https://www.hsbc.com.tw/credit-cards/products/liveplus/"
    return scrape_card_data(url, "LivePlus悠活卡", wait_time=8)

# =============================================================================
# 玉山銀行信用卡函數
# =============================================================================

def scrape_esun_pi_card():
    """玉山銀行 - Pi錢包信用卡"""
    url = "https://www.esunbank.com/zh-tw/personal/credit-card/intro/co-branded-card/pi-card"
    return scrape_card_data(url, "Pi錢包信用卡", wait_time=8)

def scrape_esun_unicard():
    """玉山銀行 - U Bear卡"""
    url = "https://www.esunbank.com/zh-tw/personal/credit-card/intro/bank-card/unicard"
    return scrape_card_data(url, "U Bear卡", wait_time=8)

def scrape_esun_unicard_top100():
    """玉山銀行 - U Bear卡百大店家"""
    url = "https://event.esunbank.com.tw/credit/unicard/discount-channel.html"
    driver = setup_driver()
    try:
        print(f"🔍 正在爬取: U Bear卡百大店家")
        driver.get(url)
        time.sleep(8)
        
        soup = BeautifulSoup(driver.page_source, "html.parser")
        
        # 移除不需要的元素
        for tag in soup(["script", "style", "noscript", "nav", "footer", "header"]):
            tag.decompose()
        
        # 獲取文字內容
        all_text = soup.get_text(separator="\n", strip=True)
        
        # 清理文字
        all_lines = ["\n========== U Bear卡百大店家優惠 ==========\n"]
        for line in all_text.split('\n'):
            line = line.strip()
            if line and len(line) > 1 and not line.isspace():
                all_lines.append(line)
        
        all_lines.append("\n========== 百大店家資料結束 ==========\n")
        
        if len(all_lines) <= 2:
            all_lines.append(f"⚠️ 無法擷取百大店家內容: {url}")
        
        print(f"✅ 成功爬取 U Bear卡百大店家: {len(all_lines)} 行內容")
        return all_lines
        
    except Exception as e:
        print(f"❌ 爬取失敗 U Bear卡百大店家: {e}")
        return [f"錯誤: 無法爬取 U Bear卡百大店家", f"網址: {url}", f"錯誤訊息: {str(e)}"]
    finally:
        driver.quit()

def scrape_esun_kumamon_card():
    """玉山銀行 - 熊本熊信用卡"""
    url = "https://www.esunbank.com/zh-tw/personal/credit-card/intro/bank-card/kumamon_card"
    return scrape_card_data(url, "熊本熊信用卡", wait_time=8)

# =============================================================================
# 國泰世華銀行信用卡函數
# =============================================================================

def scrape_cathay_cube_card():
    """國泰世華銀行 - CUBE卡"""
    url = "https://www.cathay-cube.com.tw/cathaybk/personal/product/credit-card/cards/cube"
    return scrape_card_data(url, "CUBE卡", wait_time=10)

# =============================================================================
# 銀行資料整合函數
# =============================================================================

def save_bank_file(bank_name, cards_data, filename):
    """保存銀行檔案"""
    try:
        output_dir = "信用卡資料"
        os.makedirs(output_dir, exist_ok=True)
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"{'='*60}\n")
            f.write(f"  {bank_name} 信用卡資料彙整\n")
            f.write(f"  爬取時間: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"{'='*60}\n\n")
            
            for i, (card_name, lines) in enumerate(cards_data, 1):
                f.write(f"\n{'-'*20}\n")
                f.write(f"第 {i} 張卡片: {card_name}\n")
                f.write(f"{'-'*20}\n\n")
                
                for line in lines:
                    f.write(f"{line}\n")
                
                f.write(f"\n{'-'*20}\n")
                f.write(f"{card_name} 資料結束\n")
                f.write(f"{'-'*20}\n\n")
            
            f.write(f"\n{'='*60}\n")
            f.write(f"  {bank_name} 資料彙整完成 (共 {len(cards_data)} 張卡片)\n")
            f.write(f"{'='*60}\n")
        
        print(f"📁 已保存 {bank_name} 資料到: {filepath}")
        
    except Exception as e:
        print(f"❌ 保存 {bank_name} 資料時發生錯誤: {e}")


def lineBank_to_txt_data():
    """獲取聯邦LINE Bank聯名卡資料，返回資料而不儲存"""
    url = "https://card.ubot.com.tw/CardDetail/cardDetail601"      
    driver = webdriver.Chrome()     
    driver.get(url)     
    time.sleep(5)      

    soup = BeautifulSoup(driver.page_source, "html.parser")     
    driver.quit()      

    credit_card_name = "聯邦LINE Bank聯名卡"
    
    # 移除不需要的元素（如script、style標籤）
    for script in soup(["script", "style", "noscript"]):
        script.decompose()
    
    # 獲取整個頁面的所有文字內容
    all_text = soup.get_text(separator="\n", strip=True)
    
    # 將文字分行並清理
    all_lines = []
    for line in all_text.split('\n'):
        line = line.strip()
        if line:  # 只保留非空白行
            all_lines.append(line)
    
    # 如果沒有內容，顯示錯誤訊息
    if not all_lines:
        all_lines.append("⚠️ 無法擷取內容，請檢查頁面結構")
    
    return (credit_card_name, all_lines)

def goodbird_to_txt_data():
    """獲取吉鶴卡資料，返回資料而不儲存"""
    url = "https://card.ubot.com.tw/CardDetail/cardDetail202"          
    
    driver = webdriver.Chrome()     
    driver.get(url)     
    time.sleep(5)     
    soup = BeautifulSoup(driver.page_source, "html.parser")     
    driver.quit()           
    
    for script in soup(["script", "style", "noscript"]):         
        script.decompose()          
    
    all_text = soup.get_text(separator="\n", strip=True)     
    credit_card_name = "吉鶴卡"     
    
    all_lines = []     
    for line in all_text.split('\n'):         
        line = line.strip()         
        if line:             
            all_lines.append(line)          
    
    if not all_lines:         
        all_lines.append("⚠️ 無法擷取內容，請檢查頁面結構")     
    
    return (credit_card_name, all_lines)

def save_both_cards_to_txt(filename="聯邦銀行.txt"):
    """合併兩張卡片資料並儲存到同一個檔案"""
    print("🔄 開始擷取聯邦LINE Bank聯名卡資料...")
    line_card_data = lineBank_to_txt_data()
    print(f"✅ 已擷取 {line_card_data[0]} 資料")
    
    print("🔄 開始擷取吉鶴卡資料...")
    goodbird_card_data = goodbird_to_txt_data()
    print(f"✅ 已擷取 {goodbird_card_data[0]} 資料")
    
    # 合併兩張卡片的資料
    cards_data = [line_card_data, goodbird_card_data]
    
    # 一次性儲存
    save_bank_file("聯邦銀行", cards_data, filename)
    print(f"🎉 兩張卡片資料已合併儲存到 {filename}")


def scrape_taishin_bank():
    """爬取台新銀行所有信用卡"""
    print(f"\n🏦 開始處理台新銀行...")
    cards_data = [
        ("台新信用卡", scrape_taishin_card())
    ]
    save_bank_file("台新銀行", cards_data, "台新銀行.txt")
    print("✅ 台新銀行處理完成!")

def scrape_sinopac_bank():
    """爬取永豐銀行所有信用卡"""
    print(f"\n🏦 開始處理永豐銀行...")
    cards_data = [
        ("DAWHO卡", scrape_sinopac_dawho_card()),
        ("DAWAY卡", scrape_sinopac_daway_card())
    ]
    save_bank_file("永豐銀行", cards_data, "永豐銀行.txt")
    print("✅ 永豐銀行處理完成!")

def scrape_hsbc_bank():
    """爬取匯豐銀行所有信用卡"""
    print(f"\n🏦 開始處理匯豐銀行...")
    cards_data = [
        ("現金回饋御璽卡", scrape_hsbc_cashback_card()),
        ("LivePlus悠活卡", scrape_hsbc_liveplus_card())
    ]
    save_bank_file("匯豐銀行", cards_data, "匯豐銀行.txt")
    print("✅ 匯豐銀行處理完成!")

def scrape_esun_bank():
    """爬取玉山銀行所有信用卡"""
    print(f"\n🏦 開始處理玉山銀行...")
    
    # 先爬取 U Bear 卡基本資料
    unicard_data = scrape_esun_unicard()
    
    # 再爬取百大店家資料
    top100_data = scrape_esun_unicard_top100()
    
    # 合併 U Bear 卡的兩部分資料
    combined_unicard_data = unicard_data + top100_data
    
    cards_data = [
        ("Pi錢包信用卡", scrape_esun_pi_card()),
        ("U Bear卡(含百大店家)", combined_unicard_data),
        ("熊本熊信用卡", scrape_esun_kumamon_card())
    ]
    save_bank_file("玉山銀行", cards_data, "玉山銀行.txt")
    print("✅ 玉山銀行處理完成!")

def scrape_cathay_bank():
    """爬取國泰世華銀行所有信用卡"""
    print(f"\n🏦 開始處理國泰世華銀行...")
    cards_data = [
        ("CUBE卡", scrape_cathay_cube_card()),
    ]
    save_bank_file("國泰世華銀行", cards_data, "國泰世華銀行.txt")
    url = "https://www.cathay-cube.com.tw/cathaybk/personal/product/credit-card/cards/cube-list"
        
    driver = webdriver.Chrome()
    driver.get(url)
    time.sleep(5)
    try:
        print(f"🔍 正在爬取: 國泰世華銀行信用卡權益")
        driver.get(url)
        time.sleep(10)

        soup = BeautifulSoup(driver.page_source, "html.parser")

        # 移除不需要的元素
        for tag in soup(["script", "style", "noscript", "nav", "footer", "header"]):
            tag.decompose()

        # 擷取整頁文字
        all_text = soup.get_text(separator="\n", strip=True)
        all_lines = []
        for line in all_text.split('\n'):
            line = line.strip()
            if line and len(line) > 1 and not line.isspace():
                all_lines.append(line)

        # 🔑 擷取 a class="last:border-transparent" 的內容
        links = soup.find_all("a", class_="last:border-transparent")
        if links:
            all_lines.append("\n--- cube卡權益 ---")
            for link in links:
                text = link.get_text(strip=True)
                href = link.get("href", "")
                if text:
                    all_lines.append(f"{text}")

        if not all_lines:
            all_lines.append(f"⚠️ 無法擷取內容: {url}")

        print(f"✅ 成功爬取 國泰世華信用卡權益: {len(all_lines)} 行內容")

        # 存檔
        cards_data = [
            ("國泰世華信用卡權益", all_lines)
        ]
        save_bank_file("國泰世華銀行", cards_data, "國泰世華銀行.txt")
        print(f"📁 已保存 國泰世華信用卡權益 到 {"國泰世華銀行"}")

        return all_lines

    except Exception as e:
        print(f"❌ 爬取失敗 國泰世華信用卡權益: {e}")
        return [f"錯誤: 無法爬取 國泰世華信用卡權益", f"網址: {url}", f"錯誤訊息: {str(e)}"]
    finally:
        driver.quit()

        return all_lines

    print("✅ 國泰世華銀行處理完成!")


def scrape_all_banks():
    """爬取所有銀行的信用卡"""
    print("開始爬取所有銀行信用卡資料...\n")
    start_time = time.time()
    
    # 執行所有銀行爬取
    
    scrape_taishin_bank()
    time.sleep(3)
    
    scrape_sinopac_bank()
    time.sleep(3)
    
    scrape_hsbc_bank()
    time.sleep(3)
    
    scrape_esun_bank()
    time.sleep(3)
    
    scrape_cathay_bank()
    time.sleep(3)

    # 聯邦的兩張
    save_both_cards_to_txt()
    time.sleep(3)

    end_time = time.time()
    total_time = int(end_time - start_time)
    
    print(f"\n🎉 全部完成! 總耗時: {total_time//60}分{total_time%60}秒")
    print(f"📂 所有資料已保存到 '信用卡資料' 資料夾中")


# 使用範例
if __name__ == "__main__":
    # 爬取所有銀行
    scrape_all_banks()
    
    # 或者只爬取特定銀行
    # scrape_esun_bank()      
