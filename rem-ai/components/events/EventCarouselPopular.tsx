// components/events/EventCarouselPopular.tsx
import { getMainManga } from '@/lib/mangadex';
import { fetchAniListMedia } from '@/lib/anilist';
import HeroCarousel from '@/components/common/HeroCarousel';

export default async function EventCarouselPopular() {
  const popularMangas = await getMainManga();

  if (!popularMangas || popularMangas.length === 0) return null;

  // Enriquecemos cada manga popular buscando su descripción y datos oficiales en AniList
  const enrichedMangas = await Promise.all(
    popularMangas.slice(0, 6).map(async (manga) => {
      // Pasamos tanto el título como el manga.id (UUID) para que la caché use el ID correcto
      const anilistData = await fetchAniListMedia(manga.title, manga.id);

      return {
        ...manga,
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