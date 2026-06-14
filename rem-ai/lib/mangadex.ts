import { MangaResponse } from '@/types/mangadex';

const MANGADEX_API_URL = 'https://api.mangadex.org';
const MANGADEX_COVERS_URL = 'https://uploads.mangadex.org';

interface MangaDexManga {
  id: string;
  attributes: {
    title: Record<string, string>;
    description: Record<string, string>;
    status: string;
    tags: Array<{ attributes: { name: { en: string } } }>;
  };
  relationships: Array<{
    type: string;
    attributes?: { name?: string; fileName?: string };
  }>;
}

/**
 * Limpia el texto de enlaces Markdown [text](url) y limpia espacios sobrantes
 */
function cleanDescription(desc: string): string {
  if (!desc) return 'Sin descripción disponible.';
  // 1. Quita enlaces tipo [texto](url) dejando solo el texto
  // 2. Quita posibles saltos de línea extra para que el componente no se rompa
  return desc
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();
}

async function fetchMangas(query: URLSearchParams): Promise<MangaResponse[]> {
  query.append('contentRating[]', 'safe');
  ['cover_art', 'author'].forEach(val => query.append('includes[]', val));

  try {
    const res = await fetch(`${MANGADEX_API_URL}/manga?${query.toString()}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    
    const json = await res.json();
    const data = (json.data || []) as MangaDexManga[];

    const statusMap: Record<string, string> = {
      'ongoing': 'En emisión', 'completed': 'Finalizado', 'hiatus': 'En pausa', 'cancelled': 'Cancelado'
    };

    return data.map((manga): MangaResponse => {
      const attrs = manga.attributes;

      // Lógica de prioridad: Español -> Español-Latino -> Inglés -> Fallback
      const title = attrs.title.es || attrs.title['es-la'] || attrs.title.en || Object.values(attrs.title)[0] || 'Sin título';
      const rawDesc = attrs.description.es || attrs.description['es-la'] || attrs.description.en || '';

      return {
        id: manga.id,
        title: title,
        author: manga.relationships.find(r => r.type === 'author')?.attributes?.name || 'Autor desconocido',
        description: cleanDescription(rawDesc),
        coverUrl: manga.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName 
          ? `${MANGADEX_COVERS_URL}/covers/${manga.id}/${manga.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName}.512.jpg` 
          : '/placeholder.jpg',
        status: statusMap[attrs.status] || 'En curso',
        tags: attrs.tags.map(t => t.attributes.name.en),
      };
    });
  } catch (e) {
    console.error("Error fetching mangas:", e);
    return []; 
  }
}

export async function getMainManga(): Promise<MangaResponse[]> {
  const query = new URLSearchParams();
  query.append('limit', '15');
  query.append('order[rating]', 'desc');
  query.append('availableTranslatedLanguage[]', 'es'); 
  return fetchMangas(query);
}

export async function getFilterManga(genreTag: string): Promise<MangaResponse[]> {
  const query = new URLSearchParams();
  query.append('limit', '10');
  query.append('includedTags[]', genreTag);
  query.append('availableTranslatedLanguage[]', 'es');
  query.append('order[rating]', 'desc');
  return fetchMangas(query);
}