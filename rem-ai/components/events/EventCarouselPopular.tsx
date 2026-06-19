// components/events/EventCarouselPopular.tsx
import { getMainManga } from '@/lib/mangadex';
import HeroCarousel from '@/components/common/HeroCarousel'; // Tu componente visual

export default async function EventCarouselPopular() {
  // Pedimos la lista principal
  const popularMangas = await getMainManga();

  // Si no hay datos, evitamos que la página se rompa
  if (!popularMangas || popularMangas.length === 0) return null;

  // Pasamos los datos al componente visual
  // Nota: Si quieres solo 6, puedes hacer popularMangas.slice(0, 6)
  return <HeroCarousel featuredMangas={popularMangas.slice(0, 6)} />;
} 