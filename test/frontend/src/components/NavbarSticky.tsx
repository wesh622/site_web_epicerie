import { Phone } from "lucide-react";
import { useOpenStatus } from "@/lib/hours";
import type { Shop } from "@/lib/shop";

const LINKS = [
  { href: "#horaires", label: "Horaires" },
  { href: "#rayons", label: "Rayons" },
  { href: "#livraison", label: "Livraison" },
  { href: "#avis", label: "Avis" },
  { href: "#acces", label: "Accès" },
];

export function NavbarSticky({ shop }: { shop: Shop }) {
  const status = useOpenStatus(shop.hours);
  return (
    <header
      data-testid="sticky-bar"
      className="fixed inset-x-0 top-0 z-50 border-b border-edge bg-ink/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" data-testid="nav-logo" className="font-heading text-base font-semibold tracking-tight">
          Mon <span className="text-neon">Épicerie</span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 hover:text-neon"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span
            data-testid="sticky-status-badge"
            className="hidden items-center gap-2 rounded-full border border-edge bg-panel px-3 py-1.5 text-xs text-muted-foreground sm:flex"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                  status.isOpen ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  status.isOpen ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
            </span>
            {status.label} · {status.detail}
          </span>
          <a
            href={`tel:${shop.phone}`}
            data-testid="sticky-call-button"
            className="flex items-center gap-2 rounded-full bg-neon px-4 py-2 font-heading text-xs font-semibold tracking-wide text-ink transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{shop.phoneDisplay}</span>
            <span className="sm:hidden">Appeler</span>
          </a>
        </div>
      </div>
    </header>
  );
}
