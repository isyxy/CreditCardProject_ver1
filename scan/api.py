from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import numpy as np
from io import BytesIO

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("runs/detect/train11/weights/best.pt")
names = model.names

@app.post("/scan")
async def scan_card(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "需上傳圖片")
    data = await file.read()
    image = Image.open(BytesIO(data)).convert("RGB")
    result = model(np.array(image), conf=0.2, verbose=False)[0]

    detections = [
        {
            "label": names[int(cls)],
            "score": float(score),
            "box": [float(v) for v in box.tolist()],
        }
        for box, cls, score in zip(result.boxes.xyxy, result.boxes.cls, result.boxes.conf)
    ]
    return {"detections": detections}
