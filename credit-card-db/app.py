# app.py - FastAPI 主程式
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from bson import ObjectId
import uvicorn
import os

# ========== 配置設定 ==========
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/")
DATABASE_NAME = "credit-card-db"  # 對應你的資料庫名稱
COLLECTION_NAME = "cards"

# ========== 資料模型 ==========
from pydantic import ConfigDict, field_validator
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema
from typing import Annotated

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler
    ) -> core_schema.CoreSchema:
        return core_schema.chain_schema(
            [
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ]
        )

    @classmethod
    def validate(cls, v):
        if ObjectId.is_valid(v):
            return str(v)
        raise ValueError("Invalid ObjectId")

class Benefit(BaseModel):
    category: str
    rewardRate: str
    merchants: List[str] = []
    conditions: List[str] = []
    cap: str = ""
    period: str = "*"
    id: Optional[str] = Field(None, alias="_id")

    model_config = ConfigDict(populate_by_name=True)

class ParsedData(BaseModel):
    content: List[str]
    rawContent: str
    
class CreditCard(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    cardName: str
    issuer: str
    benefits: List[Benefit] = []
    activityPeriod: Dict[str, Any] = Field(default_factory=dict)
    note: str = "*"
    exclusions: List[str] = []
    tags: List[str] = []
    fileHash: Optional[str] = None
    fileName: Optional[str] = None
    importedAt: Optional[datetime] = None
    lastModified: Optional[datetime] = None
    parsedData: Optional[ParsedData] = None
    sourceType: str = "markdown"
    createdAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)
    v: Optional[int] = Field(0, alias="__v")

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class CreditCardUpdate(BaseModel):
    cardName: Optional[str] = None
    issuer: Optional[str] = None
    benefits: Optional[List[Benefit]] = None
    activityPeriod: Optional[Dict[str, Any]] = None
    note: Optional[str] = None
    exclusions: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    updatedAt: Optional[datetime] = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True)

# ========== 資料庫連接 ==========
class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None
    
db = Database()

async def connect_to_mongo():
    """建立 MongoDB 連接"""
    db.client = AsyncIOMotorClient(MONGODB_URL)
    db.database = db.client[DATABASE_NAME]
    print(f"✅ 已連接到 MongoDB: {DATABASE_NAME}")

async def close_mongo_connection():
    """關閉 MongoDB 連接"""
    if db.client:
        db.client.close()
        print("❌ 已斷開 MongoDB 連接")

# ========== FastAPI 應用 ==========
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="信用卡優惠管理 API",
    description="管理各家銀行信用卡優惠資訊的 RESTful API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 設定 - 允許前端存取
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== API 路由 ==========

@app.get("/")
async def root():
    """API 根路徑 - 顯示 API 資訊"""
    return {
        "name": "信用卡優惠管理 API",
        "version": "1.0.0",
        "database": DATABASE_NAME,
        "collection": COLLECTION_NAME,
        "documentation": "/docs",
        "endpoints": {
            "列出所有卡片": "GET /api/cards",
            "搜尋卡片": "GET /api/cards/search?keyword=xxx",
            "取得單張卡片": "GET /api/cards/{card_id}",
            "新增卡片": "POST /api/cards",
            "更新卡片": "PUT /api/cards/{card_id}",
            "刪除卡片": "DELETE /api/cards/{card_id}",
            "統計資訊": "GET /api/stats"
        }
    }

@app.get("/api/cards", response_model=List[CreditCard])
async def get_cards(
    skip: int = Query(0, ge=0, description="略過筆數"),
    limit: int = Query(50, ge=1, le=500, description="回傳筆數"),
    issuer: Optional[str] = Query(None, description="發卡銀行篩選"),
    tags: Optional[List[str]] = Query(None, description="標籤篩選 (可多選)")
):
    """取得信用卡列表，支援分頁與篩選"""
    collection = db.database[COLLECTION_NAME]
    
    # 建立查詢條件
    query = {}
    if issuer:
        query["issuer"] = {"$regex": issuer, "$options": "i"}
    if tags:
        query["tags"] = {"$in": tags}
    
    # 執行查詢
    cursor = collection.find(query).skip(skip).limit(limit).sort("cardName", 1)
    cards = []
    async for card in cursor:
        cards.append(CreditCard(**card))
    
    return cards

@app.get("/api/cards/search", response_model=List[CreditCard])
async def search_cards(
    keyword: str = Query(..., description="搜尋關鍵字"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500)
):
    """搜尋信用卡 - 支援卡名、銀行、標籤搜尋"""
    collection = db.database[COLLECTION_NAME]
    
    # 建立搜尋查詢 (支援多欄位)
    query = {
        "$or": [
            {"cardName": {"$regex": keyword, "$options": "i"}},
            {"issuer": {"$regex": keyword, "$options": "i"}},
            {"tags": {"$regex": keyword, "$options": "i"}},
            {"benefits.category": {"$regex": keyword, "$options": "i"}},
            {"parsedData.rawContent": {"$regex": keyword, "$options": "i"}}
        ]
    }
    
    cursor = collection.find(query).skip(skip).limit(limit)
    cards = []
    async for card in cursor:
        cards.append(CreditCard(**card))
    
    return cards

@app.get("/api/cards/by-name/{card_name}", response_model=CreditCard)
async def get_card_by_name(card_name: str):
    """根據卡片名稱取得信用卡資料（智能比對）"""
    collection = db.database[COLLECTION_NAME]
    
    # 1. 先嘗試精確比對
    card = await collection.find_one({"cardName": card_name})
    
    if not card:
        # 2. 去除空格後再試
        card_name_no_space = card_name.replace(" ", "")
        card = await collection.find_one({"cardName": card_name_no_space})
    
    if not card:
        # 3. 嘗試模糊搜尋（不區分大小寫）
        card = await collection.find_one(
            {"cardName": {"$regex": f"^{card_name}", "$options": "i"}}
        )
    
    if not card:
        # 4. 更寬鬆的模糊搜尋（包含部分文字）
        card = await collection.find_one(
            {"cardName": {"$regex": card_name, "$options": "i"}}
        )
    
    if not card:
        # 5. 提供更有幫助的錯誤訊息
        # 嘗試找出相似的卡片
        similar_cards = []
        cursor = collection.find(
            {"cardName": {"$regex": card_name.split()[0] if " " in card_name else card_name[:2], "$options": "i"}}
        ).limit(5)
        
        async for c in cursor:
            similar_cards.append(c.get("cardName"))
        
        error_msg = f"找不到名稱為 '{card_name}' 的信用卡。"
        if similar_cards:
            error_msg += f" 您是否要找：{', '.join(similar_cards)}？"
        
        raise HTTPException(status_code=404, detail=error_msg)
    
    return CreditCard(**card)

@app.get("/api/cards/search-name", response_model=List[CreditCard])
async def search_cards_by_name(
    card_name: str = Query(..., description="信用卡名稱（支援部分比對）"),
    exact: bool = Query(False, description="是否精確比對")
):
    """根據卡片名稱搜尋信用卡（可選擇精確或模糊比對）"""
    collection = db.database[COLLECTION_NAME]
    
    if exact:
        # 精確比對
        query = {"cardName": card_name}
    else:
        # 模糊比對（不分大小寫）
        query = {"cardName": {"$regex": card_name, "$options": "i"}}
    
    cursor = collection.find(query)
    cards = []
    async for card in cursor:
        cards.append(CreditCard(**card))
    
    if not cards:
        raise HTTPException(
            status_code=404, 
            detail=f"找不到符合 '{card_name}' 的信用卡"
        )
    
    return cards

@app.get("/api/cards/{card_id}", response_model=CreditCard)
async def get_card(card_id: str):
    """取得單張信用卡詳細資料"""
    collection = db.database[COLLECTION_NAME]
    
    if not ObjectId.is_valid(card_id):
        raise HTTPException(status_code=400, detail="無效的卡片 ID")
    
    card = await collection.find_one({"_id": ObjectId(card_id)})
    if not card:
        raise HTTPException(status_code=404, detail="找不到此信用卡")
    
    return CreditCard(**card)

@app.post("/api/cards", response_model=CreditCard)
async def create_card(card: CreditCard):
    """新增信用卡資料"""
    collection = db.database[COLLECTION_NAME]
    
    card_dict = card.dict(by_alias=True)
    if "_id" in card_dict and card_dict["_id"] is None:
        card_dict.pop("_id")
    
    # 檢查是否已存在相同卡片
    existing = await collection.find_one({"cardName": card.cardName})
    if existing:
        raise HTTPException(status_code=400, detail="此信用卡已存在")
    
    result = await collection.insert_one(card_dict)
    card_dict["_id"] = result.inserted_id
    
    return CreditCard(**card_dict)

@app.put("/api/cards/{card_id}", response_model=CreditCard)
async def update_card(card_id: str, card_update: CreditCardUpdate):
    """更新信用卡資料"""
    collection = db.database[COLLECTION_NAME]
    
    if not ObjectId.is_valid(card_id):
        raise HTTPException(status_code=400, detail="無效的卡片 ID")
    
    # 準備更新資料
    update_data = card_update.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="沒有提供更新資料")
    
    # 執行更新
    result = await collection.update_one(
        {"_id": ObjectId(card_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="找不到此信用卡或資料未變更")
    
    # 回傳更新後的資料
    updated_card = await collection.find_one({"_id": ObjectId(card_id)})
    return CreditCard(**updated_card)

@app.delete("/api/cards/{card_id}")
async def delete_card(card_id: str):
    """刪除信用卡"""
    collection = db.database[COLLECTION_NAME]
    
    if not ObjectId.is_valid(card_id):
        raise HTTPException(status_code=400, detail="無效的卡片 ID")
    
    result = await collection.delete_one({"_id": ObjectId(card_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="找不到此信用卡")
    
    return {"message": "信用卡已成功刪除", "card_id": card_id}

@app.get("/api/stats")
async def get_statistics():
    """取得統計資訊"""
    collection = db.database[COLLECTION_NAME]
    
    # 基本統計
    total_cards = await collection.count_documents({})
    
    # 發卡銀行統計
    issuers_pipeline = [
        {"$group": {"_id": "$issuer", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    issuers_stats = []
    async for doc in collection.aggregate(issuers_pipeline):
        issuers_stats.append({"issuer": doc["_id"], "count": doc["count"]})
    
    # 標籤統計
    tags_pipeline = [
        {"$unwind": "$tags"},
        {"$group": {"_id": "$tags", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    tags_stats = []
    async for doc in collection.aggregate(tags_pipeline):
        tags_stats.append({"tag": doc["_id"], "count": doc["count"]})
    
    # 優惠類別統計
    benefits_pipeline = [
        {"$unwind": "$benefits"},
        {"$group": {"_id": "$benefits.category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    benefits_stats = []
    async for doc in collection.aggregate(benefits_pipeline):
        benefits_stats.append({"category": doc["_id"], "count": doc["count"]})
    
    return {
        "total_cards": total_cards,
        "issuers": {
            "total": len(issuers_stats),
            "details": issuers_stats
        },
        "tags": {
            "total": len(tags_stats),
            "details": tags_stats
        },
        "benefits": {
            "total": len(benefits_stats),
            "details": benefits_stats
        },
        "last_updated": datetime.utcnow()
    }

@app.get("/api/cards/issuer/{issuer}", response_model=List[CreditCard])
async def get_cards_by_issuer(
    issuer: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500)
):
    """根據發卡銀行取得信用卡列表"""
    collection = db.database[COLLECTION_NAME]
    
    cursor = collection.find({"issuer": issuer}).skip(skip).limit(limit)
    cards = []
    async for card in cursor:
        cards.append(CreditCard(**card))
    
    if not cards:
        raise HTTPException(status_code=404, detail=f"找不到 {issuer} 的信用卡")
    
    return cards

@app.get("/api/cards/tag/{tag}", response_model=List[CreditCard])
async def get_cards_by_tag(
    tag: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500)
):
    """根據標籤取得信用卡列表"""
    collection = db.database[COLLECTION_NAME]
    
    cursor = collection.find({"tags": tag}).skip(skip).limit(limit)
    cards = []
    async for card in cursor:
        cards.append(CreditCard(**card))
    
    if not cards:
        raise HTTPException(status_code=404, detail=f"找不到標籤為 {tag} 的信用卡")
    
    return cards

# ========== 健康檢查 ==========
@app.get("/health")
async def health_check():
    """健康檢查端點"""
    try:
        # 測試資料庫連接
        await db.database.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow()
        }

# ========== 啟動應用 ==========
if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

# ========== .env (範例) ==========
"""
MONGODB_URL=mongodb://localhost:27017/
"""

# ========== 使用說明 ==========
"""
1. 安裝套件:
   pip install fastapi uvicorn motor pydantic python-dotenv pymongo

2. 啟動 API:
   python app.py
   
   或使用 uvicorn:
   uvicorn app:app --reload --host 0.0.0.0 --port 8000

3. 查看 API 文件:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

4. API 端點說明:
   - GET /api/cards - 列出所有信用卡
   - GET /api/cards/search?keyword=xxx - 搜尋信用卡
   - GET /api/cards/{card_id} - 取得特定卡片
   - POST /api/cards - 新增信用卡
   - PUT /api/cards/{card_id} - 更新信用卡
   - DELETE /api/cards/{card_id} - 刪除信用卡
   - GET /api/stats - 統計資訊
   - GET /api/cards/issuer/{issuer} - 根據銀行查詢
   - GET /api/cards/tag/{tag} - 根據標籤查詢
   - GET /health - 健康檢查

5. 與現有專案整合:
   - 這個 API 可以與你的 Node.js 專案並行運作
   - import-credit-cards.js 可以繼續用來匯入資料
   - scrapy.py 可以繼續用來爬取資料
   - API 提供 RESTful 介面供其他程式呼叫
"""