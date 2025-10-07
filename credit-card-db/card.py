import os
import time
import google.generativeai as genai

genai.configure(api_key="AIzaSyBccLH3EdwEc-gEYNf_C1YGhl8apPTe25A")
model = genai.GenerativeModel("gemini-2.5-flash")

def read_txt(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def gemini_summarize(text, max_retries=5):
    prompt = (
        "你是一位信用卡專家，請協助我將以下內容精簡成一般消費者能快速理解的重點列表，"
        "特別針對：活動期間、回饋類型、適用通路、回饋門檻與上限、排除項目等條列式說明。"
        "請不要加入多餘廢話，風格要像是結帳前能秒懂的實用說明，直接幫我濃縮以下原文：\n\n"
        "請不要出現這些話:Gemini AI 精簡回饋資訊：好的，這就為您整理出聯邦銀行兩張信用卡的秒懂懶人包："
        "不須包含國外一般消費、國外消費"
        "有關國外的回饋都不要"
        "只需要包含回饋跟通路還有條件"
        "不需要出現年費、滿額禮、首刷禮等資訊"
        "請在把卡片明成統一命名為銀行名稱+信用卡名稱，並以<<< 開頭、>>>結尾，不要有###開頭"
        "請開始條列。"
        f"{text}\n\n"
        
    )

    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            wait_time = 2 ** attempt
            print(f"Gemini API 發生錯誤：{e}，{wait_time} 秒後重試...")
            time.sleep(wait_time)

    return "[無法從 Gemini API 取得總結結果]"

def main():
    input_dir = '信用卡資料'
    output_dir = 'cards'  # ✅ 修改：改成 cards 資料夾
    
    # 確保輸出資料夾存在
    os.makedirs(output_dir, exist_ok=True)
    print(f"📁 輸出資料夾：{os.path.abspath(output_dir)}")

    # 取得資料夾內所有 .txt 檔案
    if not os.path.exists(input_dir):
        print(f"❌ 找不到輸入資料夾：{input_dir}")
        return
    
    txt_files = [f for f in os.listdir(input_dir) if f.endswith('.txt')]

    if not txt_files:
        print("⚠️ 找不到任何 .txt 檔案")
        return

    print(f"📊 找到 {len(txt_files)} 個 .txt 檔案\n")

    for idx, txt_file in enumerate(txt_files, 1):
        input_file = os.path.join(input_dir, txt_file)
        # ✅ 修改：輸出到 cards 資料夾
        output_file = os.path.join(output_dir, os.path.splitext(txt_file)[0] + '.md')

        print(f"[{idx}/{len(txt_files)}] 📂 處理檔案：{txt_file}")
        
        try:
            full_text = read_txt(input_file)

            if not full_text.strip():
                print(f"⚠️ 檔案 {txt_file} 是空的，跳過\n")
                continue

            print("✨ 使用 Gemini API 進行總結...")
            summary = gemini_summarize(full_text)

            print(f"💾 輸出到：{output_file}")
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("Gemini AI 精簡回饋資訊：\n\n")
                f.write(summary + '\n')
            
            print(f"✅ 完成！\n")
            
            # 避免 API 限制，加入延遲
            if idx < len(txt_files):
                time.sleep(1)
                
        except Exception as e:
            print(f"❌ 處理 {txt_file} 時發生錯誤：{e}\n")
            continue

    print("🎉 所有檔案處理完成！")
    print(f"📁 輸出位置：{os.path.abspath(output_dir)}")

if __name__ == "__main__":
    main()