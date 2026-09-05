"""Seed idempotent du document unique `shops` — Mon Épicerie, Nancy.

Contenu rédigé une fois, figé (aucun appel LLM au runtime).
Placeholders à faire valider par le gérant : téléphone, note/avis Google, placeId, géoloc.
"""
import asyncio

from lib.db import db, ensure_indexes

IMG = "https://static.prod-images.emergentagent.com/jobs/cb381ab1-5c77-4cb2-94d5-cdd6d47f5c6b/images"

NIGHT = {"open": "18:00", "close": "05:00", "closed": False}
DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]

SHOP = {
    "id": "mon-epicerie",
    "name": "Mon Épicerie",
    "tagline": "Ouvert jusqu'à 5h du matin",
    "phone": "+33383000000",
    "phoneDisplay": "03 83 00 00 00",
    "address": {
        "street": "103 Boulevard d'Haussonville",
        "postalCode": "54000",
        "city": "Nancy",
    },
    "geo": {"lat": 48.6854, "lng": 6.1605},
    "hours": [{"day": d, "label": d.capitalize(), **NIGHT} for d in DAYS],
    "google": {
        "placeId": "PLACE_ID_A_REMPLACER",
        "rating": 4.7,
        "reviewCount": 126,
        "mapsUrl": "https://www.google.com/maps/dir/?api=1&destination=Mon%20%C3%89picerie%2C%20103%20Boulevard%20d%27Haussonville%2C%2054000%20Nancy",
        "reviewsUrl": "https://www.google.com/maps/search/?api=1&query=Mon%20%C3%89picerie%20103%20Boulevard%20d%27Haussonville%20Nancy",
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
                "image": f"{IMG}/4fc5799296d34e72676a17346927470f284312716ab4aa9ffab51be5cafad3f0.jpeg",
            },
            {
                "key": "snacks",
                "title": "Snacks & confiserie",
                "description": "Chips, chocolats, bonbons et petites faims de minuit.",
                "icon": "cookie",
                "image": f"{IMG}/8a792699f8332213633236bacd54ecc36f92a98d65f698770f4c771ed2c4a6c6.jpeg",
            },
            {
                "key": "depannage",
                "title": "Dépannage & hygiène",
                "description": "Lait, piles, chargeurs, produits d'hygiène : l'essentiel quand tout est fermé.",
                "icon": "battery-charging",
                "image": f"{IMG}/aa4617691722630fc736c374fdf843eae816e0379b762597fe2c783ae4e27386.jpeg",
            },
            {
                "key": "tabac",
                "title": "Tabac & presse",
                "description": "Tabac, presse et jeux selon arrivages. Pièce d'identité exigée.",
                "icon": "newspaper",
                "image": f"{IMG}/10a8b9995b0a9102ed9708c00d29d9ee13c84c766c822d8392f11f777bee5602.jpeg",
            },
        ],
        "delivery": {
            "zones": "Nancy centre et quartiers voisins — appelez-nous pour confirmer votre zone.",
            "minimumOrder": "À confirmer par téléphone",
            "payments": ["Carte bancaire", "Espèces", "Sans contact"],
            "note": "Livraison de nuit selon disponibilité. Zones desservies et minimum de commande confirmés par téléphone.",
        },
    },
    "theme": {"accent": "#F59E0B", "font": "space-grotesk"},
    "images": {
        "hero": f"{IMG}/46fd405670ccd6bc1f04953d4b5d72229aa8d2b90a3e5c0be3851216315ee699.jpeg",
        "gallery": [
            f"{IMG}/c6e0d99f7e98fdea80c5f19038a1b08210f4c42b7b69a7fe5c845aa9ff5587e2.jpeg",
            f"{IMG}/4fc5799296d34e72676a17346927470f284312716ab4aa9ffab51be5cafad3f0.jpeg",
            f"{IMG}/8a792699f8332213633236bacd54ecc36f92a98d65f698770f4c771ed2c4a6c6.jpeg",
            f"{IMG}/aa4617691722630fc736c374fdf843eae816e0379b762597fe2c783ae4e27386.jpeg",
            f"{IMG}/10a8b9995b0a9102ed9708c00d29d9ee13c84c766c822d8392f11f777bee5602.jpeg",
        ],
    },
}


async def main() -> None:
    await db.shops.update_one({"id": SHOP["id"]}, {"$set": SHOP}, upsert=True)
    await ensure_indexes()
    print(f"seeded shops/{SHOP['id']}")


if __name__ == "__main__":
    asyncio.run(main())
