# Créer un site vitrine à partir d'un lien Google Maps

Procédé réutilisable : on part d'un simple lien `maps.app.goo.gl`, on en tire
**les vraies informations du commerce**, et on livre un site vitrine statique
prêt à déployer — **sans jamais inventer une donnée ni générer une image**.

> Branche `general` du dépôt. Chaque site vit dans sa propre branche
> (`site_web_epicerie`, `site_web_totem`, …). Cette branche-ci ne contient que
> la méthode et les outils.

---

## 1. La règle qui structure tout

**Rien de ce qui est affiché ne doit être inventé.**

| Élément | Règle |
|---|---|
| Nom, adresse, note, avis | Repris **mot pour mot** de la fiche Google |
| Téléphone, horaires détaillés | Google d'abord ; sinon annuaires pro, **et on marque la source** |
| Services | Uniquement ceux confirmés par une source ; sinon on ne les cite pas |
| Photos | **Vraies photos uniquement** — jamais de banque d'images, jamais de génération |
| Visuels décoratifs | Autorisés s'ils sont **manifestement graphiques** (CSS/SVG), jamais photoréalistes |

Le piège classique : « il manque une photo de devanture, je mets une image
d'ambiance ». Non. Un commerce représenté par la façade d'un autre commerce,
c'est du faux. Le site doit être **beau sans photo**, et prêt à en accueillir.

La deuxième règle : **toute donnée non issue de Google est signalée dans le
README du site**, avec sa source et la mention « à confirmer par le gérant ».
Un numéro de téléphone faux sur un site en ligne, c'est un client perdu.

---

## 2. Collecte des informations

### 2.1 Ce que donne le lien Google Maps

Faire ouvrir la fiche et récupérer (copier-coller brut, sans reformuler) :

- nom exact de l'établissement et catégorie (« Bureau de tabac », « Épicerie »…)
- adresse complète
- note + nombre d'avis
- horaires jour par jour, et le statut affiché (« Fermé · Ouvre à 07:30 lun. »)
- téléphone et site web **s'ils existent** — si Google affiche « Ajouter le
  numéro de téléphone du lieu », c'est qu'**il n'y en a pas** sur la fiche
- le texte intégral de 3 à 5 avis, avec leur date de visite
- la date de dernière mise à jour par l'entreprise

### 2.2 Quand la fiche n'est pas accessible depuis l'environnement

⚠️ **Dans cet environnement, `maps.app.goo.gl`, `google.com`, PagesJaunes et
`googleusercontent.com` sont bloqués par la politique réseau** (`curl` renvoie
`CONNECT tunnel failed, 403`, `WebFetch` renvoie `EGRESS_BLOCKED`).

Vérifier l'état du proxy :

```bash
curl -sS "$HTTPS_PROXY/__agentproxy/status"
```

Ce qui fonctionne malgré tout, par ordre d'utilité :

| Outil | Ce qu'il donne | Fiabilité |
|---|---|---|
| **Le lien collé par l'utilisateur** | Nom, adresse, note, avis, horaires affichés | ★★★ source primaire |
| **`WebSearch`** | Téléphone, horaires détaillés, services, raison sociale (via annuaires) | ★★ à recouper |
| **MCP TomTom** (`tomtom-fuzzy-search`) | Coordonnées GPS exactes, POI voisins, quartier, marques de services (Relais Pickup…) | ★★★ |
| **`WebFetch`** | Rarement — la plupart des annuaires sont bloqués | ★ |

**Toujours croiser deux sources** avant d'afficher un téléphone ou des
horaires. Sur le site Totem, `03 83 27 24 26` est apparu dans deux recherches
indépendantes → affiché, mais signalé « absent de la fiche Google, à confirmer ».

### 2.3 Requête TomTom type

```
tomtom-fuzzy-search
  query: "<Nom> <adresse> <ville>"
  countries: ["FR"]
  response_detail: "full"
```

Retourne les coordonnées (`geometry.coordinates` = `[lon, lat]`), le quartier
(`address.neighbourhood`), et parfois un POI qui **confirme un service** — pour
Totem, un POI `Relais Pickup LE Totem` à la bonne adresse a validé le point
relais, mentionné dans un avis mais absent de la fiche.

### 2.4 Remplir la fiche établissement

Copier `modeles/fiche-etablissement.md` et le remplir **avant** d'écrire une
ligne de code. Tant qu'une case est vide, elle ne va pas sur le site.

---

## 3. Les photos

### 3.1 Les récupérer

Par ordre de préférence :

1. **Onglet « Photos et vidéos » de la fiche Google** — l'utilisateur les
   télécharge et les dépose dans le dépôt (les hôtes `googleusercontent.com`
   sont bloqués ici, la récupération automatique est impossible).
2. **Photos fournies par le gérant.**
3. **Photos prises sur place.**

Prises de vue les plus utiles, dans l'ordre d'impact : la **devanture avec
l'enseigne**, l'**intérieur / le comptoir**, le **rayon phare**, un **détail
produit**.

### 3.2 Le mécanisme « galerie qui s'active toute seule »

Le site est livré **photo-ready** : la section galerie existe, mais reste
`hidden` tant qu'aucune vraie photo n'est déclarée. Aucun visuel de
remplacement, aucune image cassée.

`js/photos.js` :

```js
window.SITE_PHOTOS = [
  // vide : en attente des vraies photos
];
```

`js/script.js` :

```js
var photos  = window.SITE_PHOTOS || [];
var gallery = document.getElementById("galerie");
var grid    = document.getElementById("gallery-grid");

if (gallery && grid && photos.length) {
  photos.forEach(function (photo) {
    var figure = document.createElement("figure");
    figure.className = "reveal";
    var img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = "lazy";
    figure.appendChild(img);
    if (photo.caption) {
      var caption = document.createElement("figcaption");
      caption.textContent = photo.caption;
      figure.appendChild(caption);
    }
    grid.appendChild(figure);
  });
  gallery.hidden = false;   // la section apparaît
}
```

Le gérant n'a plus qu'à déposer ses fichiers et ajouter une ligne par photo :
le site se complète sans toucher au HTML.

### 3.3 Tenir sans photo

Ce qui remplit une page sans mentir :
typographie forte (un display serif + Inter), aplats de couleur de la marque,
**cartes de données réelles** (note, horaires, services), composition SVG/CSS
assumée comme graphique, carte Google intégrée, tableau d'horaires, citations
d'avis mises en valeur.

---

## 4. Le squelette de site

```
index.html          Page unique
css/style.css       Thème, responsive, reduced-motion
js/script.js        Menu mobile, statut ouvert/fermé, galerie, animations
js/photos.js        Déclaration des vraies photos (vide au départ)
assets/photos/      Photos réelles + README rappelant la règle
README.md           Données intégrées, sources, points à confirmer
```

Zéro dépendance, zéro build : déployable tel quel sur GitHub Pages, Netlify,
Vercel ou Cloudflare Pages.

### 4.1 Sections, dans l'ordre

1. **Header** collant + nav mobile
2. **Hero** — nom, promesse en une phrase, badge note Google, **badge ouvert/fermé en direct**, appel + itinéraire, adresse
3. **Bandeau de stats** — 4 chiffres réels (note, heure d'ouverture, jours, service phare)
4. **À propos** + carte « en un coup d'œil » (les faits bruts)
5. **Services / produits** — une carte par service confirmé
6. **Section signature** — le service qui différencie (point relais, livraison de nuit…)
7. **Horaires** — tableau + statut en direct + « les horaires peuvent varier, appelez-nous »
8. **Galerie** — masquée tant qu'il n'y a pas de vraies photos
9. **Avis** — note, 2-3 avis cités mot pour mot, carte « laisser un avis »
10. **Localisation** — carte Google intégrée + contact + mentions légales
11. **Footer** + bouton d'appel flottant

### 4.2 Adapter l'identité au commerce

L'architecture reste la même d'un site à l'autre, **l'identité change** :

| Commerce | Direction |
|---|---|
| Épicerie de nuit / alcool | Thème sombre, or, néon — l'ambiance nocturne |
| Tabac-presse | Thème clair « papier journal », encre profonde, rouge carotte |
| Restaurant | La photo au centre, typographie éditoriale |

Deux couleurs d'accent maximum, une police display + une police texte.

---

## 5. Briques de code réutilisables

### 5.1 Statut ouvert/fermé en direct

C'est la brique qui a le plus de valeur : elle répond directement au reproche
le plus fréquent en avis (« horaires pas à jour, je me suis déplacé pour
rien »). Elle calcule sur le fuseau **du commerce**, pas celui du visiteur.

```js
// Index = jour JS (0 = dimanche)
var SCHEDULE = [
  { open:  9*60,      close: 12*60 + 15 },  // dimanche
  { open:  7*60 + 30, close: 19*60 + 15 },  // lundi
  // …
];

function heureLocale() {                     // Europe/Paris, pas le fuseau du visiteur
  try {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris",
      weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
    var days = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
    return { day: days[map.weekday],
             minutes: (parseInt(map.hour,10) % 24) * 60 + parseInt(map.minute,10) };
  } catch (e) {
    var d = new Date();
    return { day: d.getDay(), minutes: d.getHours()*60 + d.getMinutes() };
  }
}
```

Affiche « Ouvert · ferme à 19h15 » / « Fermé · ouvre demain à 7h30 », surligne
la ligne du jour dans le tableau, se rafraîchit toutes les 60 s.

⚠️ **Les horaires vivent à trois endroits** : la constante `SCHEDULE`, le
tableau HTML, le JSON-LD du `<head>`. Les trois doivent rester cohérents — le
noter dans le README du site.

### 5.2 Balisage Schema.org

À mettre dans le `<head>`. Le `@type` change selon le commerce :
`TobaccoShop`, `GroceryStore`, `ConvenienceStore`, `Restaurant`, `Bakery`,
`Store` par défaut.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TobaccoShop",
  "name": "…",
  "address": { "@type": "PostalAddress", "streetAddress": "…",
               "postalCode": "…", "addressLocality": "…", "addressCountry": "FR" },
  "geo": { "@type": "GeoCoordinates", "latitude": 48.675264, "longitude": 6.163203 },
  "telephone": "+33…",
  "hasMap": "https://maps.app.goo.gl/…",
  "aggregateRating": { "@type": "AggregateRating",
                       "ratingValue": "3.9", "reviewCount": "47", "bestRating": "5" },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "07:30", "closes": "19:15" }
  ]
}
</script>
```

`aggregateRating` n'est mis que si la note et le nombre d'avis sont **réels**.

### 5.3 Carte Google intégrée

Avec les coordonnées TomTom, le pin tombe juste :

```html
<iframe title="Localisation de … sur Google Maps"
        src="https://maps.google.com/maps?q=48.675264,6.163203&amp;z=17&amp;output=embed"
        loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
```

À défaut de coordonnées, `?q=` accepte l'adresse URL-encodée.

⚠️ L'iframe **reste blanche dans cet environnement** (Google est bloqué). Ce
n'est pas un bug : elle s'affiche normalement chez le visiteur.

### 5.4 Favicon SVG en ligne, sans fichier

```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛒</text></svg>">
```

---

## 6. Mentions légales — à ne pas oublier

Obligatoires selon le secteur, dans la section contact :

- **Tabac** : « Vente interdite aux mineurs de moins de 18 ans. Fumer nuit
  gravement à votre santé et à celle de votre entourage. »
- **Jeux d'argent (FDJ, PMU)** : « Interdit aux mineurs. Jouer comporte des
  risques : endettement, isolement, dépendance. 09 74 75 13 13 » (appel non surtaxé)
- **Alcool** : « L'abus d'alcool est dangereux pour la santé, à consommer avec
  modération. Vente interdite aux mineurs. »
- **Alimentaire** : allergènes et provenance si des produits sont détaillés.

---

## 7. Vérification avant de pousser

Ne jamais pousser un site qu'on n'a pas vu tourner.

```bash
python3 -m http.server 8099 &
node outils/smoke-test.mjs          # captures desktop + mobile, erreurs JS, débordement
```

`outils/smoke-test.mjs` (Playwright + le Chromium préinstallé) vérifie :
pas d'erreur JS, pas de débordement horizontal, le widget ouvert/fermé, la
galerie masquée si vide — et produit deux captures pleine page à relire.

Checklist finale :

- [ ] Chaque information affichée a une source dans le README
- [ ] Téléphone et horaires recoupés sur deux sources, ou signalés à confirmer
- [ ] `SCHEDULE`, tableau HTML et JSON-LD racontent les mêmes horaires
- [ ] Aucune image générée ni banque d'images ; galerie masquée si pas de photo
- [ ] Avis cités **mot pour mot**, avec leur date
- [ ] Mentions légales du secteur présentes
- [ ] Mobile 390 px : pas de débordement, menu burger fonctionnel
- [ ] Accessibilité : skip-link, `:focus-visible`, `prefers-reduced-motion`, `alt` réels
- [ ] `<title>`, meta description, Open Graph renseignés
- [ ] README du site : sources + « à confirmer par le gérant »

---

## 8. Git

**Une branche par site**, nommée d'après le commerce :

```bash
git checkout -b site_web_<nom>
# … le site à la racine …
git add -A
git commit -m "Ajoute le site vitrine de <Nom>"
git push -u origin site_web_<nom>
```

Sites existants : `site_web_epicerie` (Mon Épicerie de Nuit),
`site_web_totem` (Totem, tabac-presse). Cette branche `general` reste
indépendante et ne contient que la méthode.

⚠️ Ne jamais lancer un script qui écrit des fichiers depuis la racine du dépôt :
les captures d'écran se retrouvent dans le commit. Écrire dans un dossier
temporaire hors du dépôt.

---

## 9. Les pièges déjà rencontrés

| Symptôme | Cause | Réponse |
|---|---|---|
| `CONNECT tunnel failed, 403` | Domaine bloqué par la politique réseau | Passer par `WebSearch` / MCP TomTom, ne pas insister |
| `EGRESS_BLOCKED` sur `WebFetch` | Idem | Idem — et le signaler à l'utilisateur |
| Carte et polices blanches en test | Google bloqué **dans le sandbox seulement** | Normal, ne rien corriger |
| Google affiche « Ajouter le numéro » | Le commerce **n'a pas** de téléphone sur sa fiche | Chercher ailleurs, afficher **et** signaler |
| Un avis mentionne un service absent de la fiche | Service réel non déclaré | Confirmer via TomTom / La Poste, puis le mettre en avant |
| Un avis négatif sur les horaires | Vraie faiblesse du commerce | Y répondre par le design : statut en direct + « appelez-nous » |
| Capture d'écran inchangée après édition | Cache de lecture d'image | Écrire la capture sous un **nouveau nom** |

---

## 10. En résumé

1. Remplir `modeles/fiche-etablissement.md` — pas de code avant.
2. Croiser les sources ; marquer ce qui n'est pas Google.
3. Reprendre le squelette, changer l'identité, pas l'architecture.
4. Zéro image générée ; galerie prête, masquée, activable en une ligne.
5. Faire tourner le smoke-test, relire les captures.
6. Une branche par site, un README qui liste sources et points à confirmer.
