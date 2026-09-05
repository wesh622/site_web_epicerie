import { motion } from "motion/react";
import { BatteryCharging, Cookie, CupSoda, Newspaper, type LucideIcon } from "lucide-react";
import type { Shop } from "@/lib/shop";
import { SectionHeading } from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ICONS: Record<string, LucideIcon> = {
  boissons: CupSoda,
  snacks: Cookie,
  depannage: BatteryCharging,
  tabac: Newspaper,
};

export function CategoriesSection({ shop }: { shop: Shop }) {
  return (
    <section id="rayons" data-testid="categories-section" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading index="02" eyebrow="Nos rayons" title="L'essentiel, même à 4h du matin" testId="categories-heading" />
      <div className="grid auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-4">
        {shop.sections.categories.map((cat, i) => {
          const Icon = ICONS[cat.key] ?? CupSoda;
          const featured = i === 0;
          return (
            <motion.article
              key={cat.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              data-testid={`product-category-card-${cat.key}`}
              className={`group relative overflow-hidden rounded-3xl border border-edge bg-panel ${
                featured ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <img
                src={cat.image}
                alt={cat.title}
                loading={featured ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-neon/40 bg-ink/70 backdrop-blur-md">
                <Icon className="h-5 w-5 text-neon" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {cat.title}
                </h3>
                <p className="mt-1.5 max-w-md text-sm text-slate-300">{cat.description}</p>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-neon/0 transition duration-500 group-hover:ring-1 group-hover:ring-neon/50" />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
