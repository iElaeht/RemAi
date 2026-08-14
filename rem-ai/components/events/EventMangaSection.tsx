// rem-ai/components/events/EventMangaSection.tsx
import { getFilterManga, getMainManga } from '@/lib/mangadex';
import MangaSlider from '@/components/common/MangaSlider';
import { getImageUrl } from '@/utils/image';

interface Props {
  genreTag?: string;
  title: string;
}

export default async function EventMangaSection({ genreTag, title }: Props) {
  // Lógica inteligente: Si es "Seguir viendo", retornamos null por ahora
  if (title === "Seguir viendo") return null;

  const rawMangas = genreTag 
    ? await getFilterManga(genreTag) 
    : await getMainManga();

  if (!rawMangas || rawMangas.length === 0) return null;

  // Mapeamos y limpiamos la URL de la portada para cada manga
  const mangas = rawMangas.map((manga) => ({
    ...manga,
    coverUrl: getImageUrl(manga.coverUrl || ""),
  }));

  return <MangaSlider title={title} mangas={mangas} />;
}