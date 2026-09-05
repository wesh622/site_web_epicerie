import { MapPin, Phone } from "lucide-react";
import type { Shop } from "@/lib/shop";

export function Footer({ shop }: { shop: Shop }) {
  return (
    <footer data-testid="footer" className="border-t border-edge bg-panel/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold tracking-tight">
            Mon <span className="text-neon">Épicerie</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{shop.tagline}, 7 jours sur 7.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Horaires</p>
          <p className="mt-3 font-heading text-base text-slate-200">Lundi — Dimanche</p>
          <p className="font-heading text-base text-neon">18h00 – 5h00</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Contact</p>
          <a
            href={`tel:${shop.phone}`}
            data-testid="footer-phone-link"
            className="mt-3 flex items-center gap-2 text-sm text-slate-200 transition-colors hover:text-neon"
          >
            <Phone className="h-4 w-4 text-neon" /> {shop.phoneDisplay}
          </a>
          <p className="mt-2 flex items-start gap-2 text-sm text-slate-200">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
            {shop.address.street}, {shop.address.postalCode} {shop.address.city}
          </p>
        </div>
      </div>
      <div className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p data-testid="footer-legal">© 2026 Mon Épicerie — Nancy. Tous droits réservés.</p>
          <p>Épicerie de nuit · Alimentation générale · Tabac & presse</p>
        </div>
      </div>
    </footer>
  );
}
