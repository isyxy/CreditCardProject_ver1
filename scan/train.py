import os
print(os.path.exists('more_credit_card/data.yaml'))

from ultralytics import YOLO

# 用你的 data.yaml 路徑
model = YOLO('yolov8m.pt')  # 或 yolov8n.pt 看你電腦跑得動哪個

# 開始訓練
model.train(data='more_credit_card/data.yaml', epochs=2, imgsz=640)