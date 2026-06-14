// app/(main)/discover/page.tsx
import { TAG_MAP } from '@/types/tags';
import EventMangaSection from '@/components/events/EventMangaSection';
import EventCarouselPopular from '@/components/events/EventCarouselPopular';

export default async function DiscoverPage() {
  return (
    <main className="bg-neutral-950 text-white min-h-screen pb-20">
      <EventCarouselPopular />
      
      <div className="space-y-12 mt-8">
        {/* Tendencias generales */}
        <EventMangaSection title="Tendencias" />

        {/* Seguir viendo (Vacío para implementar lógica futura) */}
        <EventMangaSection title="Seguir viendo" />

        {/* Categorías Principales */}
        <EventMangaSection genreTag={TAG_MAP.Isekai} title="Isekai" />
        <EventMangaSection genreTag={TAG_MAP.Comedy} title="Comedia" />
        <EventMangaSection genreTag={TAG_MAP.Romance} title="Romance" />
        <EventMangaSection genreTag={TAG_MAP.Drama} title="Drama" />
      </div>
    </main>
  );
}