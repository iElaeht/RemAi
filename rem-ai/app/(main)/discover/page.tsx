import HeroCarousel from '@/components/HeroCarousel';
import MangaCard from '@/components/MangaCard';
import { getPopularManga } from '@/lib/mangadex';
import Link from 'next/link';

const SECTIONS = [
  { id: 'continue', title: 'Seguir Viendo' },
  { id: 'trending', title: 'Tendencias' },
  { id: 'new', title: 'Nuevos' },
  { id: 'isekai', title: 'Isekai' },
  { id: 'romance', title: 'Romance' },
];

export default async function DiscoverPage() {
  // Carga de datos en el servidor
  const mangas = await getPopularManga();

return (
  <main className="bg-neutral-950 text-white min-h-screen pb-20">
    <HeroCarousel featuredMangas={mangas.slice(0, 5)} />

      <div className="px-6 md:px-24 space-y-12">
        {SECTIONS.map((section) => (
          <section key={section.id}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <Link href={`/library?cat=${section.id}`} className="text-sm text-sky-400 hover:underline">
                Ver todo
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Uso de protección ?. y [] para evitar el error de slice */}
              {(mangas?.slice(0, 6) || []).map((manga) => (
                <MangaCard
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  author={manga.author}
                  coverUrl={manga.coverUrl}
                  latestChapter={manga.latestChapter}
                  status={manga.status}
                  tags={manga.tags}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}