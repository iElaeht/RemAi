import { NextResponse } from 'next/server';

// 1. FORZAMOS DINAMISMO: Evita caché de borde y garantiza datos frescos.
export const dynamic = 'force-dynamic';

// 2. DEFINICIÓN DE TIPOS: Eliminamos el 'any' para un código robusto y mantenible.
interface MangaDexResponse {
  result: string;
  data: {
    attributes: {
      chapter: string | null;
    };
    relationships: {
      id: string;
      type: string;
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
  
  // Identificación clara para MangaDex (política de buen uso)
  const headers = { 
    'User-Agent': 'Rem-AI-App/1.0',
    'Accept': 'application/json' 
  };

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: 'ID de capítulo inválido' }, { status: 400 });
  }

  try {
    // 3. EJECUCIÓN PARALELA OPTIMIZADA:
    // Solo pedimos lo esencial para la lectura. La lista de capítulos no debe bloquear la carga de imágenes.
    const [chapterRes, serverRes] = await Promise.all([
      fetch(`https://api.mangadex.org/chapter/${id}`, { headers }),
      fetch(`https://api.mangadex.org/at-home/server/${id}`, { headers })
    ]);

    // Validación estricta de ambas respuestas
    if (!chapterRes.ok || !serverRes.ok) {
      console.error(`Rem AI - Error de conexión: ${chapterRes.status} / ${serverRes.status}`);
      return NextResponse.json({ error: 'Error al conectar con el servidor de imágenes' }, { status: 404 });
    }

    const chapterData: MangaDexResponse = await chapterRes.json();
    const serverData: ServerResponse = await serverRes.json();

    // Extracción segura del mangaId
    const mangaId = chapterData.data.relationships.find((r) => r.type === 'manga')?.id;

    // 4. RETORNO CONSOLIDADO Y ÁGIL:
    // Entregamos solo lo necesario para renderizar el lector instantáneamente.
    return NextResponse.json({
      mangaId: mangaId || null,
      baseUrl: serverData.baseUrl,
      chapterHash: serverData.chapter.hash,
      pages: serverData.chapter.data,
      dataSaver: serverData.chapter.dataSaver,
      chapterNum: chapterData.data.attributes.chapter || '0',
    });

  } catch (error) {
    console.error("Rem AI - Error crítico en el lector:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}