import { NextResponse } from 'next/server';

interface Tag {
  attributes: { name: { en: string } };
}

interface Relationship {
  type: string;
  attributes?: { fileName?: string };
}

interface Manga {
  id: string;
  attributes: {
    title: Record<string, string>;
    tags: Tag[];
  };
  relationships: Relationship[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';
  const tags = searchParams.get('tags') || '';
  
  const pageNumber = Math.max(1, parseInt(page) || 1);
  
  // LÓGICA DE BLOQUE (VENTANA): 
  // MangaDex limita el offset a 10,000. 
  // Cada ventana tiene 555 páginas (555 * 18 = 9,990).
  const MAX_PAGES_PER_WINDOW = 555;
  const requestedOffset = (pageNumber - 1) * 18;
  
  // Si solicitan una página fuera del rango 1-555, 
  // el backend actúa como si fuera la última página disponible del bloque.
  const safeOffset = Math.min(requestedOffset, (MAX_PAGES_PER_WINDOW - 1) * 18);

  const query = new URLSearchParams({
    limit: '18',
    offset: safeOffset.toString(),
    'order[latestUploadedChapter]': 'desc',
    'contentRating[]': 'safe',
  });

  query.append('includes[]', 'cover_art');
  query.append('includes[]', 'tag');

  if (search) query.append('title', search);
  
  if (tags) {
    tags.split(',').forEach((tagId) => {
      if (tagId.trim()) query.append('includedTags[]', tagId.trim());
    });
  }

  try {
    const res = await fetch(`https://api.mangadex.org/manga?${query.toString()}`);
    
    if (!res.ok) {
        return NextResponse.json({ results: [], totalPages: 0 });
    }
    
    const data = await res.json();

    if (!data.data || !Array.isArray(data.data)) {
      return NextResponse.json({ results: [], totalPages: 0 });
    }

    // Lógica inteligente: Reportamos como máximo 555 páginas
    // para que la UI se mantenga dentro de la ventana de seguridad.
    const calculatedTotalPages = Math.min(Math.ceil((data.total || 0) / 18), MAX_PAGES_PER_WINDOW);

    const formattedResults = data.data.map((manga: Manga) => {
      const coverRel = manga.relationships.find((r) => r.type === 'cover_art');
      const fileName = coverRel?.attributes?.fileName;
      const genres = manga.attributes.tags?.map(t => t.attributes.name.en) || [];
      
      return {
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "Sin título",
        cover: fileName 
          ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` 
          : '/placeholder.jpg',
        tags: genres 
      };
    });

    return NextResponse.json({ 
      results: formattedResults, 
      totalPages: calculatedTotalPages 
    });

  } catch (error) {
    console.error("Error en API /mangas:", error);
    return NextResponse.json({ 
      results: [], 
      totalPages: 0, 
      error: 'Error interno' 
    }, { status: 500 });
  }
}