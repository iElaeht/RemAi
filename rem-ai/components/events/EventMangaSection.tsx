// components/events/EventMangaSection.tsx
import { getFilterManga, getMainManga } from '@/lib/mangadex';
import MangaSlider from '@/components/MangaSlider';

interface Props {
  genreTag?: string;
  title: string;
}

export default async function EventMangaSection({ genreTag, title }: Props) {
  // Lógica inteligente: Si es "Seguir viendo", retornamos null por ahora
  if (title === "Seguir viendo") return null;

  const mangas = genreTag 
    ? await getFilterManga(genreTag) 
    : await getMainManga();

  if (!mangas || mangas.length === 0) return null;

  return <MangaSlider title={title} mangas={mangas} />;
}