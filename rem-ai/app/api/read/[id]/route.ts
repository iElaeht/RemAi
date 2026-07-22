// rem-ai/app/api/read/[id]/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface MangaDexChapterResponse {
  result: string;
  data: {
    attributes: {
      chapter: string | null;
      volume: string | null;
    };
    relationships: {
      id: string;
      type: string;
      attributes?: {
        title?: { [key: string]: string };
      };
    }[];
  };
}

interface MangaDexMangaResponse {
  data: {
    attributes: {
      title: { [key: string]: string };
    };
    relationships: {
      id: string;
      type: string;
      attributes?: {
        name?: string;
      };
    }[];
  };
}

interface ServerResponse {
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const headers = { 
    'User-Agent': 'Rem-AI-App/1.0',
    'Accept': 'application/json' 
  };

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: 'ID de capítulo inválido' }, { status: 400 });
  }

  try {
    // 1. Obtenemos capítulo y servidor de imágenes primero
    const [chapterRes, serverRes] = await Promise.all([
      fetch(`https://api.mangadex.org/chapter/${id}?includes[]=manga`, { headers }),
      fetch(`https://api.mangadex.org/at-home/server/${id}`, { headers })
    ]);

    if (!chapterRes.ok || !serverRes.ok) {
      console.error(`Rem AI - Error de conexión: ${chapterRes.status} / ${serverRes.status}`);
      return NextResponse.json({ error: 'Error al conectar con el servidor de imágenes' }, { status: 404 });
    }

    const chapterData: MangaDexChapterResponse = await chapterRes.json();
    const serverData: ServerResponse = await serverRes.json();

    // Extraemos el mangaId de las relaciones
    const mangaRelationship = chapterData.data.relationships.find((r) => r.type === 'manga');
    const mangaId = mangaRelationship?.id;

    // 2. Si tenemos el mangaId, consultamos el título y el autor en MangaDex (incluyendo relaciones de autor)
    let mangaTitle = "Obra sin título";
    let authorName = "Autor desconocido";

    if (mangaId) {
      try {
        const mangaRes = await fetch(`https://api.mangadex.org/manga/${mangaId}?includes[]=author`, { headers });
        if (mangaRes.ok) {
          const mangaJson: MangaDexMangaResponse = await mangaRes.json();
          
          // Extraer Título
          const titlesObj = mangaJson.data.attributes.title;
          mangaTitle = titlesObj.es || titlesObj.en || Object.values(titlesObj)[0] || "Obra sin título";

          // Extraer Autor desde las relaciones del manga
          const authorRel = mangaJson.data.relationships.find((r) => r.type === 'author');
          if (authorRel && authorRel.attributes?.name) {
            authorName = authorRel.attributes.name;
          }
        }
      } catch (e) {
        console.error("No se pudo obtener el título o autor del manga:", e);
      }
    }

    // 3. Retornamos todo consolidado incluyendo el 'mangaTitle' y el 'author'
    return NextResponse.json({
      mangaId: mangaId || null,
      mangaTitle: mangaTitle,
      author: authorName,
      baseUrl: serverData.baseUrl,
      chapterHash: serverData.chapter.hash,
      pages: serverData.chapter.data,
      dataSaver: serverData.chapter.dataSaver,
      chapterNum: chapterData.data.attributes.chapter || '0',
      volume: chapterData.data.attributes.volume || '0',
    });

  } catch (error) {
    console.error("Rem AI - Error crítico en el lector:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}