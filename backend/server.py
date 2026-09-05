import asyncio
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from lib.db import client, db, ensure_indexes

SHOP_ID = "mon-epicerie"
CACHE_DAYS = 30


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    yield
    client.close()


app = FastAPI(title="Mon Épicerie — API", lifespan=lifespan)
api_router = APIRouter(prefix="/api")


class Geo(BaseModel):
    lat: float
    lng: float


class Address(BaseModel):
    street: str
    postalCode: str
    city: str


class DayHours(BaseModel):
    day: str
    label: str
    open: str | None = None
    close: str | None = None
    closed: bool = False


class GoogleInfo(BaseModel):
    placeId: str
    rating: float
    reviewCount: int
    mapsUrl: str
    reviewsUrl: str
    lastRefreshed: str | None = None


class Category(BaseModel):
    key: str
    title: str
    description: str
    icon: str
    image: str


class Delivery(BaseModel):
    zones: str
    minimumOrder: str
    payments: list[str]
    note: str


class Sections(BaseModel):
    intro: str
    categories: list[Category]
    delivery: Delivery


class Theme(BaseModel):
    accent: str
    font: str


class Images(BaseModel):
    hero: str
    gallery: list[str]


class Shop(BaseModel):
    id: str
    name: str
    tagline: str
    phone: str
    phoneDisplay: str
    address: Address
    geo: Geo
    hours: list[DayHours]
    google: GoogleInfo
    sections: Sections
    theme: Theme
    images: Images


class RefreshResult(BaseModel):
    status: str
    detail: str
    rating: float | None = None
    reviewCount: int | None = None
    nextAllowed: str | None = None


@api_router.get("/")
async def root():
    return {"message": "Mon Épicerie API"}


@api_router.get("/shop", response_model=Shop)
async def get_shop():
    doc = await db.shops.find_one({"id": SHOP_ID}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Shop not seeded — run backend/seed.py")
    return Shop(**doc)


@api_router.post("/refresh-google", response_model=RefreshResult)
async def refresh_google():
    doc = await db.shops.find_one({"id": SHOP_ID}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Shop not seeded")
    g = doc["google"]
    now = datetime.now(timezone.utc)

    last = g.get("lastRefreshed")
    if last:
        last_dt = datetime.fromisoformat(last)
        if now - last_dt < timedelta(days=CACHE_DAYS):
            return RefreshResult(
                status="skipped",
                detail=f"Fenêtre de cache de {CACHE_DAYS} jours encore active",
                rating=g["rating"],
                reviewCount=g["reviewCount"],
                nextAllowed=(last_dt + timedelta(days=CACHE_DAYS)).isoformat(),
            )

    api_key = os.environ.get("GOOGLE_PLACES_API_KEY")
    if not api_key:
        return RefreshResult(
            status="mocked",
            detail="Aucune clé GOOGLE_PLACES_API_KEY configurée — note et avis conservés tels quels",
            rating=g["rating"],
            reviewCount=g["reviewCount"],
        )

    url = f"https://places.googleapis.com/v1/places/{g['placeId']}"
    async with httpx.AsyncClient(timeout=15) as http:
        res = await http.get(
            url,
            headers={
                "X-Goog-Api-Key": api_key,
                "X-Goog-FieldMask": "rating,userRatingCount",
            },
        )
    if res.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Google Places a répondu {res.status_code}")

    data = res.json()
    rating = float(data.get("rating", g["rating"]))
    review_count = int(data.get("userRatingCount", g["reviewCount"]))
    await db.shops.update_one(
        {"id": SHOP_ID},
        {"$set": {
            "google.rating": rating,
            "google.reviewCount": review_count,
            "google.lastRefreshed": now.isoformat(),
        }},
    )
    return RefreshResult(status="refreshed", detail="Note et avis Google mis à jour", rating=rating, reviewCount=review_count)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
