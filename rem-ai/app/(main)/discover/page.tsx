// app/(main)/discover/page.tsx
import { TAG_DICTIONARY } from '@/data/tagDictionary';
import EventMangaSection from '@/components/events/EventMangaSection';
import EventCarouselPopular from '@/components/events/EventCarouselPopular';

export default async function DiscoverPage() {
  return (
    <main className="bg-neutral-950 text-white min-h-screen pb-20">
      <EventCarouselPopular />
      
      <div className="space-y-12 mt-8">
        {/* Tendencias generales */}
        <EventMangaSection title="Tendencias" />

        {/* Seguir viendo */}
        <EventMangaSection title="Seguir viendo" />

        {/* Categorías Principales */}
        {/* Accedemos a las propiedades según la nueva estructura de TAG_CATEGORIES */}
        <EventMangaSection 
          genreTag={TAG_DICTIONARY.CATEGORIES.Isekai} 
          title="Isekai" 
        />
        <EventMangaSection 
          genreTag={TAG_DICTIONARY.CATEGORIES.Comedy} 
          title="Comedia" 
        />
        <EventMangaSection 
          genreTag={TAG_DICTIONARY.CATEGORIES.Romance} 
          title="Romance" 
        />
        <EventMangaSection 
          genreTag={TAG_CATEGORIES.CATEGORIES.Drama}
          title="Drama" 
        />
      </div>
    </main>
  );
}