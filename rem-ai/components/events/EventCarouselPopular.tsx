// components/events/EventCarouselPopular.tsx
import { getMainManga } from '@/lib/mangadex';
import { fetchAniListMedia } from '@/lib/anilist';
import { getTranslatedDescription } from '@/lib/translator'; // Asegúrate de importar el traductor
import HeroCarousel from '@/components/common/HeroCarousel';

export default async function EventCarouselPopular() {
  const popularMangas = await getMainManga();

  if (!popularMangas || popularMangas.length === 0) return null;

  // Enriquecemos cada manga popular aplicando traducción y control de fuentes
  const enrichedMangas = await Promise.all(
    popularMangas.slice(0, 6).map(async (manga) => {
      const anilistData = await fetchAniListMedia([manga.title], manga.id);

      let finalDescription = manga.description;
      let finalUrl = undefined;
      let sourceName: "AniList" | "MangaDex" = "MangaDex";

      if (anilistData && anilistData.description) {
        // Si AniList responde, traducimos su descripción usando caché de anilist
        const cacheId = `anilist-${manga.id}`;
        finalDescription = await getTranslatedDescription(cacheId, anilistData.description);
        
        finalUrl = anilistData.url;
        sourceName = "AniList";
      } else {
        // CASCADA MANGAREX: Si MangaDex provee la descripción en inglés, ¡también la traducimos!
        const cacheId = `mangadex-${manga.id}`;
        if (manga.description && manga.description !== "Sin descripción disponible.") {
          finalDescription = await getTranslatedDescription(cacheId, manga.description);
        }

        finalUrl = `https://mangadex.org/title/${manga.id}`;
        sourceName = "MangaDex";
      }

      return {
        ...manga,
        description: finalDescription,
        descriptionUrl: finalUrl,
        sourceName: sourceName,
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