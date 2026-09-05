"""Seed idempotent du document unique `shops` — Mon Épicerie, Nancy.

Contenu rédigé une fois, figé (aucun appel LLM au runtime).
Données réelles confirmées (2026-09) : téléphone, horaires (11h–5h, ven. 12h–5h), géoloc, 95 avis.
placeId à confirmer auprès du gérant pour activer le refresh Google réel.
"""
import asyncio

from lib.db import db, ensure_indexes

IMG = "https://static.prod-images.emergentagent.com/jobs/cb381ab1-5c77-4cb2-94d5-cdd6d47f5c6b/images"

DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]


def hours_for(day: str) -> dict:
    return {
        "day": day,
        "label": day.capitalize(),
        "open": "12:00" if day == "vendredi" else "11:00",
        "close": "05:00",
        "closed": False,
    }


SHOP = {
    "id": "mon-epicerie",
    "name": "Mon Épicerie",
    "tagline": "Ouvert jusqu'à 5h du matin",
    "phone": "+33356582470",
    "phoneDisplay": "03 56 58 24 70",
    "address": {
        "street": "103 Boulevard d'Haussonville",
        "postalCode": "54000",
        "city": "Nancy",
    },
    "geo": {"lat": 48.6729929, "lng": 6.1650252},
    "hours": [hours_for(d) for d in DAYS],
    "google": {
        "placeId": "ChIJn5wEm3GZlEcRvMOPi3ou3GY",
        "rating": 4.7,
        "reviewCount": 95,
        "mapsUrl": "https://www.google.com/maps/dir/?api=1&destination=Mon%20%C3%89picerie%2C%20103%20Boulevard%20d%27Haussonville%2C%2054000%20Nancy",
        "reviewsUrl": "https://www.google.com/maps/place/Livraison+alcool+Nancy,+Mon+%C3%89picerie/@48.6729929,6.1650252,17z/data=!4m6!3m5!1s0x479499ac33d263f5:0x72720baa7ae2f27f!8m2!3d48.6729929!4d6.1650252!16s%2Fg%2F11jrpjgc85",
        "lastRefreshed": None,
    },
    "sections": {
        "intro": "Au 103 boulevard d'Haussonville, Mon Épicerie veille quand Nancy s'endort. Boissons fraîches, snacks, dépannage du quotidien : poussez la porte jusqu'à 5h du matin, 7 jours sur 7.",
        "categories": [
            {
                "key": "boissons",
                "title": "Boissons & fraîcheur",
                "description": "Softs, eaux, boissons énergisantes et bières — toujours frais, même à 4h.",
                "icon": "cup-soda",
                "image": "/photos/boissons.webp",
            },
            {
                "key": "snacks",
                "title": "Snacks & confiserie",
                "description": "Chips, chocolats, bonbons et petites faims de minuit.",
                "icon": "cookie",
                "image": "/photos/snacks.webp",
            },
            {
                "key": "depannage",
                "title": "Dépannage & hygiène",
                "description": "Lait, piles, chargeurs, produits d'hygiène : l'essentiel quand tout est fermé.",
                "icon": "battery-charging",
                "image": "/photos/devanture.webp",
            },
            {
                "key": "tabac",
                "title": "Tabac & presse",
                "description": "Tabac, presse et jeux selon arrivages. Pièce d'identité exigée.",
                "icon": "newspaper",
                "image": "/photos/tabac.webp",
            },
        ],
        "delivery": {
            "zones": "Nancy et communes voisines — livraison gratuite, minimum de commande selon votre ville.",
            "minimumOrder": "Selon votre zone",
            "payments": ["Carte bancaire", "Espèces", "Sans contact"],
            "note": "Livraison 100% gratuite d'après la fiche Google de la boutique ; le minimum de commande dépend de votre ville. Appelez pour confirmer votre zone.",
        },
    },
    "theme": {"accent": "#F59E0B", "font": "space-grotesk"},
    "images": {
        "hero": "/photos/hero-nuit.webp",
        "gallery": [
            "/photos/livraison.webp",
            "/photos/devanture.webp",
            "/photos/boissons.webp",
            "/photos/snacks.webp",
            "/photos/tabac.webp",
        ],
    },
}


async def main() -> None:
    await db.shops.update_one({"id": SHOP["id"]}, {"$set": SHOP}, upsert=True)
    await ensure_indexes()
    print(f"seeded shops/{SHOP['id']}")


if __name__ == "__main__":
    asyncio.run(main())
