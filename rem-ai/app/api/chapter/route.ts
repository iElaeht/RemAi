import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface MangaDexChapter {
  id: string;
  attributes: {
    chapter: string | null;
    volume: string | null;
    translatedLanguage: string;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mangaId = searchParams.get('mangaId');
  const offset = searchParams.get('offset') || '0';

  if (!mangaId) {
    return NextResponse.json({ error: 'Manga ID es requerido' }, { status: 400 });
  }

  try {
    // 1. Construcción de parámetros con filtros de contenido y lenguaje
    const params = new URLSearchParams({
      manga: mangaId,
      limit: '100',
      offset: offset,
      'order[chapter]': 'asc',
      'order[volume]': 'asc',
      'includes[]': 'scanlation_group',
    });

    // Filtros para habilitar todo el contenido (H incluido)
    ["safe", "suggestive", "erotica", "pornographic"].forEach((r) =>
      params.append("contentRating[]", r)
    );

    // Filtros de idioma para asegurar que aparezcan capítulos traducidos
    ["es-la","es", "en", "ja", "ko", "zh"].forEach((lang) =>
      params.append("translatedLanguage[]", lang)
    );

    // 2. Fetch con Identidad (User-Agent)
    const url = `https://api.mangadex.org/chapter?${params.toString()}`;
    const res = await fetch(url, {
      headers: { 
        'User-Agent': 'Rem-AI-App/1.0',
        'Accept': 'application/json' 
      },
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error(`Rem AI - Error en MangaDex: ${res.status}`);
      return NextResponse.json({ error: 'Error al conectar con MangaDex' }, { status: res.status });
    }

    const data = await res.json();
    const chapters = Array.isArray(data.data) ? data.data : [];

    // 3. Mapeo de datos con blindaje (asegurando valores por defecto)
    const formattedChapters = chapters.map((ch: MangaDexChapter) => ({
      id: ch.id,
      number: ch.attributes.chapter || '0',
      volume: ch.attributes.volume || 'N/A',
      language: ch.attributes.translatedLanguage || 'unknown',
    }));

    return NextResponse.json({
      data: formattedChapters,
      total: data.total || 0
    });

  } catch (error) {
    console.error("Rem AI - Error crítico en api/chapter:", error);
    return NextResponse.json({ error: 'Fallo interno al procesar capítulos' }, { status: 500 });
  }
}