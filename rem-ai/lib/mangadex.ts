// lib/mangadex.ts

const MANGADEX_API_URL = 'https://api.mangadex.org';
const MANGADEX_COVERS_URL = 'https://uploads.mangadex.org';

export interface MangaResponse {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  latestChapter?: string;
  status: string;      // Nuevo
  tags: string[];      // Nuevo
}

export async function getPopularManga(): Promise<MangaResponse[]> {
  try {
    const response = await fetch(
      `${MANGADEX_API_URL}/manga?limit=12&includedTagsMode=AND&excludedTagsMode=OR&availableTranslatedLanguage[]=es&availableTranslatedLanguage[]=es-la&order[followedCount]=desc&includes[]=cover_art&includes[]=author`,
      { next: { revalidate: 0 } }
    );

    if (!response.ok) throw new Error('Error al conectar con MangaDex');
    
    const json = await response.json();

    return json.data.map((manga: { id: string; attributes: Record<string, unknown>; relationships: Array<Record<string, unknown>> }) => {
      const attributes = manga.attributes as Record<string, unknown>;
      
      // 1. Extraer Título
      const titleObj = attributes.title as Record<string, string>;
      const title = titleObj?.en || Object.values(titleObj || {})[0] || 'Título Desconocido';
      
      // 2. Extraer Estado nativo (ongoing, completed, hiatus, cancelled)
      const status = (attributes.status as string) || 'ongoing';

      // 3. Extraer e identificar los Géneros (Tags)
      const tagsArray = (attributes.tags as Array<{ attributes?: { name?: { en?: string } } }>) || [];
      const tags = tagsArray
        .map((t) => t.attributes?.name?.en || '')
        .filter((name) => name !== '');

      // 4. Extraer Autor
      const authorRel = manga.relationships.find((r) => r.type === 'author');
      const authorAttributes = authorRel?.attributes as Record<string, string> | undefined;
      const author = authorAttributes?.name || 'Autor Desconocido';

      // 5. Extraer Archivo de Portada
      const coverRel = manga.relationships.find((r) => r.type === 'cover_art');
      const coverAttributes = coverRel?.attributes as Record<string, string> | undefined;
      const fileName = coverAttributes?.fileName;
      
      const coverUrl = fileName 
        ? `${MANGADEX_COVERS_URL}/covers/${manga.id}/${fileName}.256.jpg`
        : 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500';

      return {
        id: manga.id,
        title,
        author,
        coverUrl,
        status,
        tags,
        latestChapter: 'N/A'
      };
    });
  } catch (error) {
    console.error('MangaDex Fetch Error:', error);
    return [];
  }
}