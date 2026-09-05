import { Navigation, Phone } from "lucide-react";
import { useOpenStatus } from "@/lib/hours";
import type { Shop } from "@/lib/shop";

export function MobileBottomBar({ shop }: { shop: Shop }) {
  const status = useOpenStatus(shop.hours);
  return (
    <div
      data-testid="mobile-bottom-bar"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-edge bg-ink/95 p-3 backdrop-blur-xl md:hidden"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pl-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                status.isOpen ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                status.isOpen ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
          </span>
          <span className="text-[11px] leading-tight text-muted-foreground" data-testid="mobile-status-label">
            {status.label}
            <br />
            {status.detail}
          </span>
        </div>
        <a
          href={`tel:${shop.phone}`}
          data-testid="mobile-call-button"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-neon py-3 font-heading text-sm font-semibold text-ink active:scale-95"
        >
          <Phone className="h-4 w-4" />
          Appeler
        </a>
        <a
          href={shop.google.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="mobile-directions-button"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-edge bg-panel py-3 font-heading text-sm font-semibold text-foreground active:scale-95"
        >
          <Navigation className="h-4 w-4 text-neon" />
          Itinéraire
        </a>
      </div>
    </div>
  );
}
