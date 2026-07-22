// components/events/EventCarouselPopular.tsx
import { getMainManga } from '@/lib/mangadex';
import { fetchAniListMedia } from '@/lib/anilist'; // <-- Importamos la función de AniList
import HeroCarousel from '@/components/common/HeroCarousel';

export default async function EventCarouselPopular() {
  const popularMangas = await getMainManga();

  if (!popularMangas || popularMangas.length === 0) return null;

  // Enriquecemos cada manga popular buscando su descripción y datos oficiales en AniList
  const enrichedMangas = await Promise.all(
    popularMangas.slice(0, 6).map(async (manga) => {
      // Llamamos a AniList usando el título del manga
      const anilistData = await fetchAniListMedia(manga.title);

      return {
        ...manga,
        // Si AniList nos devuelve descripción traducida, la usamos. Si no, mantenemos la original.
        description: anilistData?.description || manga.description,
      };
    })
  );

  return (
    <HeroCarousel 
      featuredMangas={enrichedMangas} 
      basePath="/details/manga" 
    />
  );
}