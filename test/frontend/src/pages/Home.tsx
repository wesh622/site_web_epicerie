import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Lenis from "lenis";
import { apiGet } from "@/lib/api";
import { FALLBACK_SHOP, type Shop } from "@/lib/shop";
import { NavbarSticky } from "@/components/NavbarSticky";
import { HeroSection } from "@/components/HeroSection";
import { MarqueeRibbon } from "@/components/MarqueeRibbon";
import { ScheduleSection } from "@/components/ScheduleSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { DeliverySection } from "@/components/DeliverySection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { MapLocationSection } from "@/components/MapLocationSection";
import { Footer } from "@/components/Footer";
import { MobileBottomBar } from "@/components/MobileBottomBar";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["shop"],
    queryFn: () => apiGet<Shop>("/shop"),
    staleTime: 60_000,
    retry: 1,
  });
  const shop = data ?? FALLBACK_SHOP;

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="home-page">
      <Helmet>
        <title>Mon Épicerie — Épicerie de nuit à Nancy · Ouvert jusqu'à 5h</title>
        <meta
          name="description"
          content="Mon Épicerie, épicerie de nuit au 103 Boulevard d'Haussonville à Nancy. Ouvert 7j/7 jusqu'à 5h du matin : boissons fraîches, snacks, dépannage, tabac & presse."
        />
      </Helmet>
      <div className="noise-overlay" aria-hidden="true" />
      <NavbarSticky shop={shop} />
      <main className="pb-24 md:pb-0">
        <HeroSection shop={shop} />
        <MarqueeRibbon />
        <ScheduleSection shop={shop} />
        <CategoriesSection shop={shop} />
        <DeliverySection shop={shop} />
        <ReviewsSection shop={shop} />
        <MapLocationSection shop={shop} />
      </main>
      <Footer shop={shop} />
      <MobileBottomBar shop={shop} />
    </div>
  );
}
