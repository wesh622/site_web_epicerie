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
        image: "/photos/boissons.webp",
      },
      {
        key: "snacks",
        title: "Snacks & confiserie",
        description: "Chips, chocolats, bonbons et petites faims de minuit.",
        icon: "cookie",
        image: "/photos/snacks.webp",
      },
      {
        key: "depannage",
        title: "Dépannage & hygiène",
        description: "Lait, piles, chargeurs, produits d'hygiène : l'essentiel quand tout est fermé.",
        icon: "battery-charging",
        image: "/photos/devanture.webp",
      },
      {
        key: "tabac",
        title: "Tabac & presse",
        description: "Tabac, presse et jeux selon arrivages. Pièce d'identité exigée.",
        icon: "newspaper",
        image: "/photos/tabac.webp",
      },
    ],
    delivery: {
      zones: "Nancy et communes voisines — livraison gratuite, minimum de commande selon votre ville.",
      minimumOrder: "Selon votre zone",
      payments: ["Carte bancaire", "Espèces", "Sans contact"],
      note: "Livraison 100% gratuite d'après la fiche Google de la boutique ; le minimum de commande dépend de votre ville. Appelez pour confirmer votre zone.",
    },
  },
  theme: { accent: "#F59E0B", font: "space-grotesk" },
  images: {
    hero: "/photos/hero-nuit.webp",
    gallery: [
      "/photos/livraison.webp",
      "/photos/devanture.webp",
      "/photos/boissons.webp",
      "/photos/snacks.webp",
      "/photos/tabac.webp",
    ],
  },
};
