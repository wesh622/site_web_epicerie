import { useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { Clock, MapPin, Navigation, Phone, Star } from "lucide-react";
import { useOpenStatus } from "@/lib/hours";
import type { Shop } from "@/lib/shop";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const lineReveal = {
  hidden: { y: "115%" },
  show: (i: number) => ({
    y: "0%",
    transition: { delay: 0.2 + i * 0.14, duration: 0.9, ease: EASE },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.7 + i * 0.12, duration: 0.8, ease: EASE },
  }),
};

export function HeroSection({ shop }: { shop: Shop }) {
  const status = useOpenStatus(shop.hours);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const hudY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-7, 7]);

  return (
    <section
      ref={sectionRef}
      id="top"
      data-testid="hero-section"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <img
          src={shop.images.hero}
          alt="Devanture de Mon Épicerie illuminée la nuit à Nancy"
          className="h-full w-full object-cover object-[center_30%]"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,15,20,0.82) 0%, rgba(11,15,20,0.62) 50%, rgba(11,15,20,0.97) 100%)",
          }}
        />
      </motion.div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-neon/40 bg-ink/60 px-4 py-1.5 backdrop-blur-md"
            data-testid="hero-overline-badge"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
            <span className="font-heading text-[11px] font-medium uppercase tracking-[0.3em] text-neon">
              Épicerie de nuit — Nancy
            </span>
          </motion.div>

          <h1 className="font-heading text-5xl font-bold leading-[0.95] tracking-tighter sm:text-6xl lg:text-8xl">
            <span className="block overflow-hidden pb-1">
              <motion.span variants={lineReveal} initial="hidden" animate="show" custom={0} className="block">
                MON ÉPICERIE
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span variants={lineReveal} initial="hidden" animate="show" custom={1} className="block">
                ouvert jusqu'à <span className="neon-glow text-neon">5h</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 max-w-xl text-base text-slate-300 sm:text-lg"
            data-testid="hero-intro"
          >
            {shop.sections.intro}
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} className="mt-8 flex flex-wrap gap-4">
            <a
              href={`tel:${shop.phone}`}
              data-testid="hero-call-button"
              className="group flex items-center gap-3 rounded-full bg-neon px-7 py-4 font-heading text-sm font-semibold tracking-wide text-ink transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <Phone className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              Appeler — {shop.phoneDisplay}
            </a>
            <a
              href={shop.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-directions-button"
              className="group flex items-center gap-3 rounded-full border border-edge bg-ink/50 px-7 py-4 font-heading text-sm font-semibold tracking-wide text-foreground backdrop-blur-md transition-colors duration-300 hover:border-neon hover:text-neon"
            >
              <Navigation className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              Itinéraire
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-slate-400"
          >
            <span>7j/7</span>
            <span className="h-3 w-px bg-edge" />
            <span>Jusqu'à 5h</span>
            <span className="h-3 w-px bg-edge" />
            <span>Bd d'Haussonville</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1, ease: EASE }}
          style={{ y: hudY, rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
          className="hidden lg:block"
          data-testid="hero-status-hud"
        >
          <div className="rounded-3xl border border-edge bg-panel/70 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                    status.isOpen ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full ${
                    status.isOpen ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
              </span>
              <span className="font-heading text-lg font-semibold" data-testid="hero-status-label">
                {status.isOpen ? "Ouvert maintenant" : "Fermé"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{status.detail}</p>
            <div className="my-6 h-px bg-edge" />
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="h-4 w-4 text-neon" />
                Tous les jours · jusqu'à 5h00 du matin
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="h-4 w-4 text-neon" />
                {shop.address.street}, {shop.address.postalCode} {shop.address.city}
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Star className="h-4 w-4 fill-neon text-neon" />
                {String(shop.google.rating).replace(".", ",")}/5 · {shop.google.reviewCount} avis Google
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
