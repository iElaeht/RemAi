import { NextResponse } from 'next/server';

// Definición de tipos para las relaciones y objetos de MangaDex
interface Relationship {
  id: string;
  type: 'manga' | 'author';
  attributes?: {
    name?: string;
  };
}

interface MangaDexResponse {
  result: string;
  data: {
    id: string;
    attributes: {
      title: { [key: string]: string };
      name?: string;
      translatedLanguage?: string;
      volume?: string;
      chapter?: string;
    };
    relationships: Relationship[];
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'es';

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: 'ID de capítulo inválido' }, { status: 400 });
  }

  try {
    // 1. Obtener capítulo y servidor
    const [chapterRes, serverRes] = await Promise.all([
      fetch(`https://api.mangadex.org/chapter/${id}`),
      fetch(`https://api.mangadex.org/at-home/server/${id}`)
    ]);

    const chapterData = await chapterRes.json();
    const serverData = await serverRes.json();

    if (chapterData.result !== 'ok' || serverData.result !== 'ok') {
      return NextResponse.json({ error: 'Error al conectar con MangaDex' }, { status: 404 });
    }

    // 2. Extraer ID del manga correctamente de las relaciones del capítulo
    const mangaId = chapterData.data.relationships.find((r: Relationship) => r.type === 'manga')?.id;

    // 3. Petición al manga incluyendo explícitamente al autor
    const [mangaRes, chaptersRes] = await Promise.all([
      fetch(`https://api.mangadex.org/manga/${mangaId}?includes[]=author`),
      fetch(`https://api.mangadex.org/manga/${mangaId}/feed?limit=500&order[chapter]=asc&order[volume]=asc`)
    ]);

    const mangaData: MangaDexResponse = await mangaRes.json();
    const chaptersData = await chaptersRes.json();

    // 4. Mapear capítulos tipado
    const formattedChapters = chaptersData.data.map((ch: any) => ({
      id: ch.id,
      language: ch.attributes.translatedLanguage,
      volume: ch.attributes.volume,
      number: ch.attributes.chapter,
      title: ch.attributes.title
    }));

    // Extraer autor de las relaciones del manga obtenido
    const authorRel = mangaData.data.relationships.find((r: Relationship) => r.type === 'author');

    // 5. Retorno consolidado
    return NextResponse.json({
      mangaId: mangaId,
      baseUrl: serverData.baseUrl,
      chapterHash: serverData.chapter.hash,
      pages: serverData.chapter.data,
      dataSaver: serverData.chapter.dataSaver,
      mangaTitle: mangaData.data.attributes.title.en || Object.values(mangaData.data.attributes.title)[0],
      author: authorRel?.attributes?.name || "Autor Desconocido",
      chapterNum: chapterData.data.attributes.chapter,
      volume: chapterData.data.attributes.volume,
      selectedLang: lang,
      chaptersList: formattedChapters
    });

  } catch (error) {
    console.error("Error crítico en el lector:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}