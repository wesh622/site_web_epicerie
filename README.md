# Totem — Site vitrine (tabac · presse · jeux · colis)

Site vitrine statique (HTML / CSS / JS, zéro dépendance, zéro build) pour
**Totem**, le bureau de tabac-presse du 37 Bd d'Haussonville à Nancy.

Fiche Google Maps de référence :
<https://maps.app.goo.gl/biE6Pykx8JtbwdE49>

## Structure

```
index.html          Page unique (hero, à propos, services, colis, horaires,
                    galerie, avis, localisation, contact)
css/style.css       Thème « papier journal » : fond chaud, encre profonde,
                    rouge carotte tabac. Responsive, mode reduced-motion.
js/script.js        Menu mobile, statut ouvert/fermé en direct, galerie,
                    animations au scroll
js/photos.js        Liste des VRAIES photos de la boutique (vide par défaut)
assets/photos/      Photos réelles à déposer ici
```

## Informations intégrées (et leur source)

| Donnée | Valeur | Source |
|---|---|---|
| Nom | Totem | Google Maps |
| Type | Bureau de tabac · Presse | Google Maps / annuaires |
| Adresse | 37 Bd d'Haussonville, 54000 Nancy | Google Maps |
| Note | 3,9/5 — 47 avis | Google Maps |
| Ouverture | « Ouvre à 07:30 lun. » | Google Maps |
| Horaires détaillés | Lun–Ven 7h30–19h15 · Sam 8h00–19h15 · Dim 9h00–12h15 | PagesJaunes / annuaires pro |
| Téléphone | 03 83 27 24 26 | PagesJaunes / annuaires pro |
| Services | Tabac, presse & magazines, jeux FDJ, Compte Nickel, timbres fiscaux, point relais colis | Annuaires pro + avis Google |
| Avis affichés | 2 avis 5★ | Google Maps (repris mot pour mot) |
| Raison sociale | LE TOTEM (SNC, créée le 01/12/2023, SIREN 983 125 550) | Annuaire des entreprises |
| Coordonnées GPS | 48.675264, 6.163203 | TomTom (POI « Relais Pickup LE Totem », 37 Bd d'Haussonville) |
| Quartier | Haussonville — Blandan — Mon Désert — Saurupt | TomTom |
| Point relais | Relais Pickup | La Poste (localiser.laposte.fr) + TomTom |

Aucune donnée n'a été inventée. Les chiffres, l'adresse, la note et les avis
proviennent de la fiche Google ; ce que Google ne fournit pas (téléphone,
horaires jour par jour, liste des services) a été relevé sur les annuaires
professionnels et est signalé comme tel ci-dessus.

## ⚠️ Deux points à faire confirmer par le gérant

1. **Le numéro de téléphone `03 83 27 24 26`** n'est *pas* sur la fiche Google
   (elle propose encore « Ajouter le numéro de téléphone du lieu »). Il vient
   des annuaires professionnels. À confirmer avant mise en ligne — il est
   utilisé à 5 endroits dans `index.html` (chercher `+33383272426`).
2. **Les horaires.** Un avis Google reproche justement des horaires pas à jour
   (« je me suis pointé à 7h45, magasin fermé »). C'est pour ça que le site
   affiche un badge **Ouvert / Fermé calculé en direct** et une mention
   « les horaires peuvent varier, appelez-nous ». Les horaires sources sont
   dans `js/script.js` (constante `SCHEDULE`) **et** dans le tableau
   `index.html` **et** dans le JSON-LD du `<head>` : les trois doivent rester
   cohérents.

## 📸 Photos : aucune image n'est générée

Le site ne contient **aucune photo inventée, aucune banque d'images, aucun
visuel généré**. Les illustrations du hero et de la section colis sont des
formes vectorielles/CSS assumées comme telles.

La section « Totem en images » existe mais reste **masquée** tant qu'aucune
vraie photo n'est fournie. Pour l'activer :

1. déposer les fichiers dans `assets/photos/` ;
2. ajouter une entrée par photo dans `js/photos.js` :

```js
window.TOTEM_PHOTOS = [
  { src: "assets/photos/devanture.jpg",
    alt: "Devanture du tabac Totem, 37 Bd d'Haussonville à Nancy",
    caption: "La devanture, boulevard d'Haussonville" }
];
```

3. recharger la page : la section apparaît automatiquement.

Les photos de la fiche Google n'ont pas pu être récupérées depuis cet
environnement (`maps.app.goo.gl` et `googleusercontent.com` sont bloqués par
la politique réseau). Elles doivent donc être ajoutées manuellement, depuis la
fiche Google (« Photos et vidéos ») ou prises sur place.

## Ce que fait le site en plus d'une vitrine classique

- **Statut ouvert/fermé en direct**, calculé sur le fuseau `Europe/Paris`
  (le visiteur peut être ailleurs), avec « ferme à 19h15 » / « ouvre demain à
  7h30 » et surlignage du jour courant dans le tableau.
- **Balisage Schema.org `TobaccoShop`** (adresse, téléphone, horaires, note) :
  le référencement local reprend directement ces données.
- **Mentions légales obligatoires** tabac (interdiction aux mineurs, message
  sanitaire) et jeux d'argent (09 74 75 13 13).
- Accessibilité : skip-link, `:focus-visible`, `prefers-reduced-motion`,
  contrastes AA, table d'horaires balisée avec `<th scope="row">`.

## Aperçu en local

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Déploiement

100 % statique : déployable tel quel sur GitHub Pages, Netlify, Vercel ou
Cloudflare Pages, sans configuration ni étape de build.
