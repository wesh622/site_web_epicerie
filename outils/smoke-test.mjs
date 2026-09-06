/* =============================================================================
   Smoke-test d'un site vitrine statique.

   Vérifie ce qu'une relecture de code ne montre pas : erreurs JS réelles,
   débordement horizontal, widget ouvert/fermé, galerie masquée si vide.
   Produit deux captures pleine page (desktop + mobile) à relire avant de
   pousser.

   Utilisation :
     python3 -m http.server 8099 &
     node outils/smoke-test.mjs [url] [dossier-de-sortie]

   Le dossier de sortie doit être HORS du dépôt, sinon les captures finissent
   dans le commit.
   ========================================================================== */

import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import path from "node:path";
import fs from "node:fs";

const URL = process.argv[2] || "http://127.0.0.1:8099/";
const OUT = process.argv[3] || "/tmp/smoke-test";
const STAMP = Date.now(); // nom unique : une capture réécrite peut être relue en cache

fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 }
];

const browser = await chromium.launch();
const problems = [];
const shots = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

  page.on("pageerror", (e) => problems.push(`[${vp.name}] erreur JS : ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    // Google Fonts / Maps sont bloqués dans cet environnement : bruit attendu.
    if (/ERR_CONNECTION_RESET|ERR_BLOCKED|net::ERR_/.test(text)) return;
    problems.push(`[${vp.name}] console : ${text}`);
  });

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  // Forcer les animations d'apparition pour capturer la page entière
  await page.evaluate(() =>
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"))
  );
  await page.waitForTimeout(400);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  if (overflow) problems.push(`[${vp.name}] débordement horizontal`);

  const missingAlt = await page.evaluate(
    () => [...document.querySelectorAll("img")].filter((i) => !i.alt).length
  );
  if (missingAlt) problems.push(`[${vp.name}] ${missingAlt} image(s) sans attribut alt`);

  const file = path.join(OUT, `${vp.name}-${STAMP}.png`);
  await page.screenshot({ path: file, fullPage: true });
  shots.push(file);

  if (vp.name === "desktop") {
    const state = await page.evaluate(() => {
      const pick = (id) => document.getElementById(id);
      const gallery = pick("galerie");
      const grid = pick("gallery-grid");
      return {
        statut: pick("status-text")?.textContent ?? "(absent)",
        statutEtat: pick("status-pill")?.dataset.status ?? "(absent)",
        jourSurligne: [...document.querySelectorAll("tr.is-today th")].map((e) => e.textContent),
        galerieMasquee: gallery ? gallery.hidden : "(section absente)",
        photosAffichees: grid ? grid.children.length : 0,
        titre: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content ?? "(absente)",
        jsonLd: !!document.querySelector('script[type="application/ld+json"]')
      };
    });
    console.log("\nÉtat de la page :");
    console.log(JSON.stringify(state, null, 2));

    if (!state.jsonLd) problems.push("balisage JSON-LD absent du <head>");
    if (state.metaDescription === "(absente)") problems.push("meta description absente");
    if (state.galerieMasquee === false && state.photosAffichees === 0) {
      problems.push("galerie visible alors qu'aucune photo n'est déclarée");
    }
  }

  await page.close();
}

await browser.close();

console.log("\nCaptures :");
shots.forEach((s) => console.log("  " + s));

if (problems.length) {
  console.log("\n❌ Problèmes :");
  problems.forEach((p) => console.log("  - " + p));
  process.exit(1);
}

console.log("\n✅ Aucun problème détecté. Relire les captures avant de pousser.");
