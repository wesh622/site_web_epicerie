import { motion } from "motion/react";
import { formatHour, useOpenStatus } from "@/lib/hours";
import type { Shop } from "@/lib/shop";
import { SectionHeading } from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ScheduleSection({ shop }: { shop: Shop }) {
  const status = useOpenStatus(shop.hours);
  return (
    <section id="horaires" data-testid="schedule-section" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading index="01" eyebrow="Horaires & ouverture" title="Quand Nancy dort, on veille" testId="schedule-heading" />
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className={`flex flex-col justify-between rounded-3xl border p-8 ${
            status.isOpen ? "border-emerald-500/30 bg-emerald-950/20" : "border-red-500/30 bg-red-950/20"
          }`}
          data-testid="open-status-live"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                  status.isOpen ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span
                className={`relative inline-flex h-4 w-4 rounded-full ${
                  status.isOpen ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">En ce moment</span>
          </div>
          <div className="mt-8">
            <p className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              {status.isOpen ? "Ouvert" : "Fermé"}
            </p>
            <p className="mt-2 text-lg text-muted-foreground">{status.detail}</p>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Statut calculé en direct, fuseau Europe/Paris. Le service court jusqu'à 5h du matin, 7 jours sur 7 — le
            vendredi, ouverture à midi.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="overflow-hidden rounded-3xl border border-edge bg-panel"
        >
          <table className="w-full" data-testid="schedule-table">
            <tbody>
              {shop.hours.map((d, i) => {
                const isActive = i === status.activeIndex;
                return (
                  <tr
                    key={d.day}
                    data-testid={isActive ? "schedule-row-today" : `schedule-row-${d.day}`}
                    className={`border-b border-edge/60 transition-colors duration-300 last:border-0 ${
                      isActive ? "bg-neon/10" : "hover:bg-secondary/50"
                    }`}
                  >
                    <td className={`px-6 py-4 text-sm sm:text-base ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                      {d.label}
                      {isActive && (
                        <span className="ml-3 rounded-full bg-neon px-2 py-0.5 font-heading text-[10px] font-semibold uppercase tracking-widest text-ink">
                          Aujourd'hui
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-heading text-sm tracking-wide sm:text-base ${
                        isActive ? "text-neon" : "text-slate-300"
                      }`}
                    >
                      {d.closed || !d.open || !d.close ? "Fermé" : `${formatHour(d.open)} – ${formatHour(d.close)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
