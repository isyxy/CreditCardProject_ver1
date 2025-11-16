from ultralytics import YOLO
import cv2
import numpy as np
from collections import Counter

cap = cv2.VideoCapture("card.mp4")
model = YOLO('runs/detect/train11/weights/best.pt')

class_names = model.names  
detected_classes = []
frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    # 每3幀偵測一次（可自行調整）
    if frame_count % 3 != 0:
        continue  

    # 降低信心門檻
    results = model(frame, conf=0.15, device="mps")
    result = results[0]

    if result.boxes is not None and len(result.boxes) > 0:
        bboxes = np.array(result.boxes.xyxy.cpu(), dtype="int")
        classes = np.array(result.boxes.cls.cpu(), dtype="int")
        scores = np.array(result.boxes.conf.cpu())

        # 這裡改為記錄所有偵測到的類別
        for bbox, cls, score in zip(bboxes, classes, scores):
            if score < 0.15:
                continue
            (x, y, x2, y2) = bbox
            label = class_names[cls] if cls < len(class_names) else str(cls)

            detected_classes.append(label)

            cv2.rectangle(frame, (x, y), (x2, y2), (0, 0, 255), 2)
            cv2.putText(frame, f"{label} {score:.2f}", (x, y - 5),
                        cv2.FONT_HERSHEY_PLAIN, 2, (0, 0, 255), 2)

    cv2.imshow("Img", frame)
    if cv2.waitKey(1) == 27:
        break

cap.release()
cv2.destroyAllWindows()

# 統計結果
if detected_classes:
    counter = Counter(detected_classes)
    most_common_label, count = counter.most_common(1)[0]
    print(f"最常出現的卡片是：{most_common_label}，共出現了 {count} 次")
else:
    print("整個影片中沒有偵測到任何卡片。")
