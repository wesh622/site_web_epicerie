import { motion } from "motion/react";
import { Bike, CreditCard, Phone } from "lucide-react";
import type { Shop } from "@/lib/shop";
import { SectionHeading } from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function DeliverySection({ shop }: { shop: Shop }) {
  const d = shop.sections.delivery;
  return (
    <section id="livraison" data-testid="delivery-section" className="border-y border-edge bg-panel/40">
      <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading index="03" eyebrow="Livraison express" title="Livré chez vous, même la nuit" testId="delivery-heading" />
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative min-h-[280px] overflow-hidden rounded-3xl border border-edge"
          >
            <img
              src={shop.images.gallery[0]}
              alt="Mon Épicerie de Nuit — livraison à domicile 7j/7"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute bottom-0 flex items-center gap-3 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neon/40 bg-ink/70 backdrop-blur-md">
                <Bike className="h-5 w-5 text-neon" />
              </span>
              <p className="font-heading text-lg font-semibold">Livraison de nuit selon disponibilité</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="rounded-3xl border border-edge bg-panel p-8"
            data-testid="delivery-info-card"
          >
            <dl className="space-y-6">
              <div>
                <dt className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Zones desservies</dt>
                <dd className="mt-2 text-base text-slate-200">{d.zones}</dd>
              </div>
              <div className="h-px bg-edge" />
              <div>
                <dt className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Minimum de commande</dt>
                <dd className="mt-2 font-heading text-2xl font-semibold text-foreground">{d.minimumOrder}</dd>
              </div>
              <div className="h-px bg-edge" />
              <div>
                <dt className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Paiements acceptés</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {d.payments.map((p) => (
                    <span
                      key={p}
                      data-testid={`payment-chip-${p.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 rounded-full border border-edge bg-secondary px-4 py-2 text-sm text-slate-200"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-neon" />
                      {p}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-sm text-muted-foreground">{d.note}</p>
            <a
              href={`tel:${shop.phone}`}
              data-testid="delivery-call-button"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-neon px-6 py-3.5 font-heading text-sm font-semibold text-ink transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <Phone className="h-4 w-4" />
              Commander — {shop.phoneDisplay}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
