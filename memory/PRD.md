# PRD — Mon Épicerie Nancy (site vitrine)

## Problem statement (original)
Site vitrine single-page pour l'épicerie de nuit "Mon Épicerie" (Nancy, 103 Bd d'Haussonville). Stack React + FastAPI + MongoDB. SEO local FR, mobile-first, statut "ouvert maintenant" calculé côté client (passage minuit → 5h). 2 endpoints : GET /api/shop, POST /api/refresh-google (cache 30 jours, Google Places). Pas de paiement, pas d'auth, pas de commande en ligne en v1. Avis Google = note + nombre + lien sortant uniquement (TOS).

## Décisions utilisateur (2026-09-05)
- Livraison : section générique "Nous contacter" (pas d'info engageante inventée)
- Pas de back-office en v1 : édition directe en base Mongo
- Pas de clé Google Places : /api/refresh-google reste MOCKED, note/avis saisis à la main
- Site construit pour le gérant : contenu prudent, à faire valider
- Direction artistique : libre → thème "nuit éditoriale" obsidienne + ambre néon (#F59E0B), Space Grotesk / DM Sans, framer-motion (motion/react) + lenis, hero cinétique avec reveal masqué ligne par ligne, marquee éditorial, chapitres numérotés 01–05, parallaxe hero + tilt 3D sur la carte HUD

## Architecture
- Backend : FastAPI, `server.py` (modèles Pydantic Shop + 2 endpoints), `seed.py` idempotent, collection Mongo `shops` (1 doc, id="mon-epicerie", index unique sur id)
- Frontend : Vite + React 19 + TS, page unique `src/pages/Home.tsx`, 10 composants dans `src/components/`, données via TanStack Query + fallback statique (`src/lib/shop.ts`) pour le rendu CDN sans backend
- Logique horaires : `src/lib/hours.ts` (Europe/Paris, shifts traversant minuit, refresh 30 s)
- SEO : meta FR + JSON-LD GroceryStore/LocalBusiness statiques dans `index.html`, react-helmet-async pour le titre dynamique, sitemap.xml, robots.txt, favicon.svg

## User personas
- Étudiant/noctambule cherchant "épicerie de nuit Nancy" sur Google, sur mobile, veut horaires + tél + itinéraire en < 2 s
- Habitant du quartier Haussonville ayant un besoin de dépannage tardif

## Implémenté (2026-09-05)
- Phase 1 : schéma Mongo + GET /api/shop + seed ✔
- Phase 2 : sticky bar, hero cinétique, horaires 7 jours + statut live ✔
- Phase 3 : catégories (bento 4 rayons), livraison, avis Google (lien sortant), carte Maps embed ✔
- Phase 4 : meta FR, JSON-LD, sitemap, robots, favicon, OG ✔
- Phase 5 : /api/refresh-google codé (fenêtre 30j + Places API New) mais MOCKED sans clé ; polish motion (lenis, parallaxe, tilt 3D, marquee) ✔ — Lighthouse non mesuré

## Données réelles intégrées (2026-09-05, confirmées par le client)
- Téléphone réel : 03 56 58 24 70 (boutons Appeler, JSON-LD, footer)
- Horaires réels : lun–jeu + sam–dim 11h00–5h00, vendredi 12h00–5h00 (API, JSON-LD, table)
- Avis Google : 4,7 · 95 avis (compteur vu sur Maps par le client)
- Géoloc exacte : 48.6729929, 6.1650252 · Lien fiche Maps réel (bouton avis)
- Photo hero : vraie devanture de nuit (LED bleues) depuis la fiche Google Maps, WebP local `/photos/hero-nuit.webp` (135 Ko)

## Photos (2026-09-05) — UNIQUEMENT la fiche Google Maps, extraites via navigateur
7 photos extraites de la fiche ; 5 exploitables pour Mon Épicerie (2 écartées : Proxi et Epicerie Centrale = autres enseignes, 1 avec personne = Allo J'ai Soif)
- hero : devanture nuit LED bleues (hero-nuit.webp) · livraison : flyer composite maison (livraison.webp)
- rayons : boissons = frigo spiritueux réel, snacks = crop flyer (marques bonbons), dépannage = devanture jour, tabac = promo Absolut (⚠️ visuel pas idéal — la fiche n'a pas de photo tabac ; proposer au client de changer la carte en "Vins & spiritueux" ou d'uploader une photo du rayon tabac)
- Texte livraison repris de leur fiche : "livraison 100% gratuite, minimum selon ville"

## Reste MOCKED / à valider
- placeId `ChIJn5wEm3GZlEcRvMOPi3ou3GY` à confirmer (issu d'une fiche annexe) → refresh Google toujours MOCKED sans clé

## Backlog priorisé
- P0 : vrai numéro de téléphone, vraie note/avis Google, placeId réel → puis clé GOOGLE_PLACES_API_KEY dans backend/.env pour activer le refresh réel
- P1 : image hero compressée (< 100 Ko, actuellement ~950 Ko), OG image dédiée 1200×630
- P1 : zones de livraison réelles + minimum de commande une fois fournis
- P2 : mini back-office horaires/promos (refusé en v1), cron automatique pour refresh-google, Lighthouse ≥ 95 mobile

## Prochaines tâches
1. Récupérer les vraies infos du gérant (tél, horaires exacts, placeId) → update seed.py
2. Ajouter GOOGLE_PLACES_API_KEY → tester POST /api/refresh-google réel
3. Mesure Lighthouse mobile et compression hero
