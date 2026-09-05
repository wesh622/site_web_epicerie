import { motion } from "motion/react";
import { MapPin, Navigation, Phone, TramFront } from "lucide-react";
import type { Shop } from "@/lib/shop";
import { SectionHeading } from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function MapLocationSection({ shop }: { shop: Shop }) {
  const q = encodeURIComponent(`${shop.name}, ${shop.address.street}, ${shop.address.postalCode} ${shop.address.city}`);
  return (
    <section id="acces" data-testid="map-section" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading index="05" eyebrow="Accès & itinéraire" title="103 boulevard d'Haussonville" testId="map-heading" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="overflow-hidden rounded-3xl border border-edge"
        >
          <iframe
            title="Carte — Mon Épicerie, 103 Boulevard d'Haussonville, Nancy"
            data-testid="google-maps-embed"
            src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full grayscale-[0.3] sm:h-[420px]"
            allowFullScreen
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="flex flex-col justify-between rounded-3xl border border-edge bg-panel p-8"
          data-testid="address-card"
        >
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-neon" />
              <p className="text-base text-slate-200">
                {shop.address.street}
                <br />
                {shop.address.postalCode} {shop.address.city}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-neon" />
              <a href={`tel:${shop.phone}`} data-testid="address-phone-link" className="text-base text-slate-200 transition-colors hover:text-neon">
                {shop.phoneDisplay}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <TramFront className="mt-0.5 h-5 w-5 shrink-0 text-neon" />
              <p className="text-sm text-muted-foreground">
                Accessible à pied depuis le centre de Nancy, en tram et en bus — arrêts à proximité du boulevard.
              </p>
            </div>
          </div>
          <a
            href={shop.google.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="map-directions-button"
            className="group mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-neon px-6 py-3.5 font-heading text-sm font-semibold text-ink transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <Navigation className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            Lancer l'itinéraire
          </a>
        </motion.div>
      </div>
    </section>
  );
}
