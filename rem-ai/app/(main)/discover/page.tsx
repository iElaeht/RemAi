// app/(main)/discover/page.tsx
import { TAG_DICTIONARY } from '@/data/tagDictionary';
import EventMangaSection from '@/components/events/EventMangaSection';
import EventCarouselPopular from '@/components/events/EventCarouselPopular';

const CATEGORY_SECTIONS = [
  { title: "Isekai", tag: TAG_DICTIONARY["Isekai"] },
  { title: "Comedia", tag: TAG_DICTIONARY["Comedy"] },
  { title: "Romance", tag: TAG_DICTIONARY["Romance"] },
  { title: "Drama", tag: TAG_DICTIONARY["Drama"] },
  { title: "Aventura", tag: TAG_DICTIONARY["Adventure"] },
];

export default async function DiscoverPage() {
  return (
    <main className="bg-neutral-950 text-white min-h-screen pb-20 selection-none">
      <EventCarouselPopular />
      
      <div className="space-y-12 mt-8">
        <EventMangaSection title="Tendencias" />
        <EventMangaSection title="Seguir viendo" />

        {CATEGORY_SECTIONS.map((section) => (
          <EventMangaSection 
            key={section.title}
            genreTag={section.tag} 
            title={section.title} 
          />
        ))}
      </div>
    </main>
  );
}