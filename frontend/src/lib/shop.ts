// Mirrors backend Pydantic `Shop` — keep the two in sync by hand.
// FALLBACK_SHOP keeps the page fully rendered when the static CDN build has no backend.

export interface Geo {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  postalCode: string;
  city: string;
}

export interface DayHours {
  day: string;
  label: string;
  open: string | null;
  close: string | null;
  closed: boolean;
}

export interface GoogleInfo {
  placeId: string;
  rating: number;
  reviewCount: number;
  mapsUrl: string;
  reviewsUrl: string;
  lastRefreshed: string | null;
}

export interface Category {
  key: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface Delivery {
  zones: string;
  minimumOrder: string;
  payments: string[];
  note: string;
}

export interface Shop {
  id: string;
  name: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  address: Address;
  geo: Geo;
  hours: DayHours[];
  google: GoogleInfo;
  sections: {
    intro: string;
    categories: Category[];
    delivery: Delivery;
  };
  theme: { accent: string; font: string };
  images: { hero: string; gallery: string[] };
}

const IMG =
  "https://static.prod-images.emergentagent.com/jobs/cb381ab1-5c77-4cb2-94d5-cdd6d47f5c6b/images";

const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

export const FALLBACK_SHOP: Shop = {
  id: "mon-epicerie",
  name: "Mon Épicerie",
  tagline: "Ouvert jusqu'à 5h du matin",
  phone: "+33356582470",
  phoneDisplay: "03 56 58 24 70",
  address: { street: "103 Boulevard d'Haussonville", postalCode: "54000", city: "Nancy" },
  geo: { lat: 48.6729929, lng: 6.1650252 },
  hours: days.map((d) => ({
    day: d,
    label: d.charAt(0).toUpperCase() + d.slice(1),
    open: d === "vendredi" ? "12:00" : "11:00",
    close: "05:00",
    closed: false,
  })),
  google: {
    placeId: "ChIJn5wEm3GZlEcRvMOPi3ou3GY",
    rating: 4.7,
    reviewCount: 95,
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Mon%20%C3%89picerie%2C%20103%20Boulevard%20d%27Haussonville%2C%2054000%20Nancy",
    reviewsUrl:
      "https://www.google.com/maps/place/Livraison+alcool+Nancy,+Mon+%C3%89picerie/@48.6729929,6.1650252,17z/data=!4m6!3m5!1s0x479499ac33d263f5:0x72720baa7ae2f27f!8m2!3d48.6729929!4d6.1650252!16s%2Fg%2F11jrpjgc85",
    lastRefreshed: null,
  },
  sections: {
    intro:
      "Au 103 boulevard d'Haussonville, Mon Épicerie veille quand Nancy s'endort. Boissons fraîches, snacks, dépannage du quotidien : poussez la porte jusqu'à 5h du matin, 7 jours sur 7.",
    categories: [
      {
        key: "boissons",
        title: "Boissons & fraîcheur",
        description: "Softs, eaux, boissons énergisantes et bières — toujours frais, même à 4h.",
        icon: "cup-soda",
        image: `${IMG}/4fc5799296d34e72676a17346927470f284312716ab4aa9ffab51be5cafad3f0.jpeg`,
      },
      {
        key: "snacks",
        title: "Snacks & confiserie",
        description: "Chips, chocolats, bonbons et petites faims de minuit.",
        icon: "cookie",
        image: `${IMG}/8a792699f8332213633236bacd54ecc36f92a98d65f698770f4c771ed2c4a6c6.jpeg`,
      },
      {
        key: "depannage",
        title: "Dépannage & hygiène",
        description: "Lait, piles, chargeurs, produits d'hygiène : l'essentiel quand tout est fermé.",
        icon: "battery-charging",
        image: `${IMG}/aa4617691722630fc736c374fdf843eae816e0379b762597fe2c783ae4e27386.jpeg`,
      },
      {
        key: "tabac",
        title: "Tabac & presse",
        description: "Tabac, presse et jeux selon arrivages. Pièce d'identité exigée.",
        icon: "newspaper",
        image: `${IMG}/10a8b9995b0a9102ed9708c00d29d9ee13c84c766c822d8392f11f777bee5602.jpeg`,
      },
    ],
    delivery: {
      zones: "Nancy centre et quartiers voisins — appelez-nous pour confirmer votre zone.",
      minimumOrder: "À confirmer par téléphone",
      payments: ["Carte bancaire", "Espèces", "Sans contact"],
      note: "Livraison de nuit selon disponibilité. Zones desservies et minimum de commande confirmés par téléphone.",
    },
  },
  theme: { accent: "#F59E0B", font: "space-grotesk" },
  images: {
    hero: `${IMG}/46fd405670ccd6bc1f04953d4b5d72229aa8d2b90a3e5c0be3851216315ee699.jpeg`,
    gallery: [
      `${IMG}/c6e0d99f7e98fdea80c5f19038a1b08210f4c42b7b69a7fe5c845aa9ff5587e2.jpeg`,
      `${IMG}/4fc5799296d34e72676a17346927470f284312716ab4aa9ffab51be5cafad3f0.jpeg`,
      `${IMG}/8a792699f8332213633236bacd54ecc36f92a98d65f698770f4c771ed2c4a6c6.jpeg`,
      `${IMG}/aa4617691722630fc736c374fdf843eae816e0379b762597fe2c783ae4e27386.jpeg`,
      `${IMG}/10a8b9995b0a9102ed9708c00d29d9ee13c84c766c822d8392f11f777bee5602.jpeg`,
    ],
  },
};
