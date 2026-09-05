import { Asterisk } from "lucide-react";

const ITEMS = [
  "OUVERT 7J/7 JUSQU'À 5H DU MATIN",
  "103 BD D'HAUSSONVILLE — NANCY",
  "BOISSONS FRAÎCHES",
  "SNACKS & CONFISERIE",
  "DÉPANNAGE URGENCE",
  "TABAC & PRESSE",
  "LIVRAISON DE NUIT NANCY",
];

export function MarqueeRibbon() {
  return (
    <div
      data-testid="marquee-ribbon"
      aria-hidden="true"
      className="relative overflow-hidden border-y border-edge bg-panel py-4"
    >
      <div className="flex w-max animate-marquee items-center">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center">
            {ITEMS.map((item) => (
              <span
                key={`${dup}-${item}`}
                className="flex items-center gap-8 pr-8 font-heading text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground"
              >
                {item}
                <Asterisk className="h-4 w-4 text-neon" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
