# Mon Épicerie — Site vitrine

Site vitrine statique (HTML/CSS/JS, aucune dépendance) pour l'épicerie
"Livraison alcool Nancy, Mon Épicerie".

## Structure

```
index.html       Page unique (hero, produits, horaires, avis, localisation, contact)
css/style.css    Styles (thème sombre premium, responsive)
js/script.js     Menu mobile, liens WhatsApp, animations au scroll
```

## À compléter avant mise en ligne

Les informations publiques de la fiche Google (nom, note 4,8/5 sur 95 avis,
avis clients, coordonnées GPS, mention "ferme à 05:00 le dimanche") sont déjà
intégrées. Il reste à compléter manuellement :

1. **Numéro WhatsApp** — dans `js/script.js`, ligne `WHATSAPP_NUMBER`,
   remplacer `"33600000000"` par le vrai numéro (format international,
   sans `+` ni espaces).
2. **Téléphone et adresse exacte** — dans `index.html`, section
   `#contact` (`<em>À compléter par l'établissement</em>` et
   `<em>(adresse précise à confirmer — voir Google Maps)</em>`).
3. **Horaires détaillés** — le tableau dans la section `#horaires`
   renvoie vers Google Maps par prudence (les horaires n'étaient pas
   toutes disponibles). Remplacez `Voir Google Maps` par les horaires
   réels une fois confirmés.
4. (Optionnel) **Vraies photos** — le site utilise des icônes/emojis en
   attendant de vraies photos de la boutique/produits. Ajoutez vos
   photos dans `assets/` et remplacez les blocs `.visual-card` /
   `.product-icon` par des `<img>`.

## Aperçu en local

Ouvrez simplement `index.html` dans un navigateur, ou lancez un petit
serveur local :

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Déploiement

Le site est 100% statique : il peut être déployé gratuitement sur
GitHub Pages, Netlify, Vercel ou Cloudflare Pages sans configuration
particulière (aucun build requis).
