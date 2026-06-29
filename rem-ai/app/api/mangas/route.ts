// app/api/mangas/route.ts
import { NextResponse } from 'next/server';

// Forzamos dinamismo para obtener datos frescos siempre
export const dynamic = 'force-dynamic';

interface MangaAttributes {
  title: Record<string, string>;
  tags: { attributes: { name: { en: string } } }[];
}

interface MangaRelationship {
  type: string;
  attributes?: { fileName?: string };
}

interface MangaData {
  id: string;
  attributes: MangaAttributes;
  relationships: MangaRelationship[];
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const tags = searchParams.get('tags') || '';
  
  const limit = 18;
  const offset = (Math.max(1, page) - 1) * limit;
  
  // Límite de seguridad de MangaDex (10,000 registros)
  const MAX_ALLOWED_OFFSET = 10000;
  const isLimitReached = offset >= MAX_ALLOWED_OFFSET - limit;

  // Construcción de query
  const query = new URLSearchParams({
    limit: limit.toString(),
    offset: Math.min(offset, MAX_ALLOWED_OFFSET - limit).toString(),
    'order[latestUploadedChapter]': 'desc',
    'contentRating[]': 'safe',
    'includes[]': 'cover_art',
  });

  if (search) query.append('title', search);
  
  if (tags) {
    tags.split(',').forEach((tag) => {
      const trimmedTag = tag.trim();
      if (trimmedTag) query.append('includedTags[]', trimmedTag);
    });
  }

  try {
    const res = await fetch(`https://api.mangadex.org/manga?${query.toString()}`, {
      headers: { 'User-Agent': 'Rem-AI-App/1.0' },
      next: { revalidate: 60 } 
    });
    
    if (!res.ok) {
      return NextResponse.json({ results: [], totalPages: 0 }, { status: res.status });
    }
    
    const data = await res.json();
    
    const formattedResults = data.data.map((manga: MangaData) => {
      const coverRel = manga.relationships.find((r) => r.type === 'cover_art');
      const fileName = coverRel?.attributes?.fileName;
      
      return {
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "Sin título",
      cover: fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` : '',
      tags: manga.attributes.tags?.map((t) => t.attributes.name.en) || []
    };
    });

    // Mensaje dinámico si llegamos al tope
    const limitMessage = isLimitReached 
      ? "Has llegado al límite de exploración. Prueba filtrar por géneros como: 'Romance', 'Isekai', 'Comedia', o 'Acción' para ver más resultados."
      : null;

    return NextResponse.json({ 
      results: formattedResults, 
      totalPages: Math.ceil((data.total || 0) / limit),
      limitReached: isLimitReached,
      message: limitMessage
    });

  } catch (error) {
    console.error("Rem AI - Error en API /mangas:", error);
    return NextResponse.json({ 
      results: [], 
      totalPages: 0,
      message: "Ocurrió un error al conectar con MangaDex."
    }, { status: 500 });
  }
}