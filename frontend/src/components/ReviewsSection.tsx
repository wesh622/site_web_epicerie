import { motion } from "motion/react";
import { ExternalLink, Star } from "lucide-react";
import type { Shop } from "@/lib/shop";
import { SectionHeading } from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ReviewsSection({ shop }: { shop: Shop }) {
  const g = shop.google;
  const full = Math.floor(g.rating);
  return (
    <section id="avis" data-testid="reviews-section" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading index="04" eyebrow="Avis clients" title="Ils nous ont trouvés dans la nuit" testId="reviews-heading" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="grid items-center gap-10 rounded-3xl border border-edge bg-panel p-8 sm:p-12 lg:grid-cols-[auto_1fr]"
        data-testid="google-review-card"
      >
        <div className="text-center lg:text-left">
          <p className="neon-glow font-heading text-7xl font-bold tracking-tighter text-neon sm:text-8xl">
            {String(g.rating).replace(".", ",")}
          </p>
          <div className="mt-3 flex justify-center gap-1 lg:justify-start" aria-label={`${g.rating} sur 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < full ? "fill-neon text-neon" : "fill-secondary text-secondary"}`}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {g.reviewCount} avis sur Google
          </p>
        </div>
        <div className="lg:border-l lg:border-edge lg:pl-10">
          <p className="text-base text-slate-300 sm:text-lg">
            La note et les avis sont ceux de notre fiche Google Business, lus en direct par les clients. Nous n'en
            copions pas le contenu ici : consultez-les directement sur Google.
          </p>
          <a
            href={g.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="google-reviews-link"
            className="group mt-6 inline-flex items-center gap-3 rounded-full border border-edge bg-secondary px-6 py-3.5 font-heading text-sm font-semibold text-foreground transition-colors duration-300 hover:border-neon hover:text-neon"
          >
            Voir les avis sur Google
            <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
