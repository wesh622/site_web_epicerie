# Mon Épicerie de Nuit — Site vitrine

Site vitrine statique (HTML/CSS/JS, aucune dépendance) pour l'épicerie
"Mon Épicerie de Nuit" à Nancy.

## Structure

```
index.html          Page unique (hero, produits, horaires, avis, localisation, contact)
css/style.css        Styles (thème sombre premium, responsive)
js/script.js         Menu mobile, animations au scroll
assets/photos/       Vraies photos de la boutique (enseigne, produits, devanture)
```

## Informations intégrées

- **Nom** : Mon Épicerie de Nuit
- **Adresse** : 103 Boulevard d'Haussonville, 54000 Nancy
- **Téléphone** : 03 56 58 24 70 (relevé sur l'enseigne et la devanture)
- **Horaires** (relevés sur l'enseigne en boutique) :
  - Lundi à mercredi : 11h30 – 00h00
  - Jeudi à samedi : 11h30 – 02h30
  - Dimanche : 09h30 – 01h00
- **Note Google** : 4,8/5 (95 avis)
- **Lien Google Maps** : https://maps.app.goo.gl/x1AcWGoN26urCd8v9

## À vérifier / compléter

1. **Lien Instagram** — le compte affiché sur l'enseigne est
   `Mon.epicerie`. Le site pointe vers
   `https://www.instagram.com/mon.epicerie/` par déduction : à vérifier et
   corriger si besoin dans `index.html` (section `#contact`, `.social-row`).
2. **Liens Uber Eats / Deliveroo** — les logos figurent sur l'enseigne mais
   sans identifiant de page, donc les badges "Uber Eats" / "Deliveroo" dans
   `.social-row` ne sont pas cliquables pour l'instant. Ajoutez vos vraies
   URLs de profil et transformez ces `<span>` en `<a href="...">`.
3. **Horaires** — reconfirmez-les avec l'exploitant si l'enseigne a changé
   depuis la prise des photos (la fiche Google affichait par ailleurs
   "ferme à 05h00 le dimanche", différent de l'enseigne — l'enseigne a été
   privilégiée ici car plus détaillée et a priori plus à jour).

## Aperçu en local

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Déploiement

Le site est 100% statique : il peut être déployé gratuitement sur
GitHub Pages, Netlify, Vercel ou Cloudflare Pages sans configuration
particulière (aucun build requis).
