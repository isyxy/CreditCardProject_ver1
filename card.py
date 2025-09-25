import os
import time
import google.generativeai as genai

genai.configure(api_key="AIzaSyBccLH3EdwEc-gEYNf_C1YGhl8apPTe25A")
model = genai.GenerativeModel("gemini-2.5-flash")

input_dir = '信用卡資料'
input_file = os.path.join(input_dir, '匯豐銀行.txt')
output_file = os.path.join('信用卡整理', '匯豐.md')

def read_txt(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def gemini_summarize(text, max_retries=5):
    prompt = (
        "你是一位信用卡專家，請協助我將以下內容精簡成一般消費者能快速理解的重點列表，"
        "特別針對：活動期間、回饋類型、適用通路、回饋門檻與上限、排除項目等條列式說明。"
        "請不要加入多餘廢話，風格要像是結帳前能秒懂的實用說明，直接幫我濃縮以下原文：\n\n"
        f"{text}\n\n"
        "請開始條列。"
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
    if not os.path.exists(input_file):
        print(f"找不到檔案：{input_file}")
        return

    print("讀取原始文字中...")
    full_text = read_txt(input_file)

    if not full_text.strip():
        print("檔案是空的")
        return

    print("開始使用 Gemini API 進行總結...")
    summary = gemini_summarize(full_text)

    print("輸出總結到檔案...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("Gemini AI 精簡回饋資訊：\n\n")
        f.write(summary + '\n')

    print(f"整理完成！已輸出到：{output_file}")

if __name__ == "__main__":
    main()
