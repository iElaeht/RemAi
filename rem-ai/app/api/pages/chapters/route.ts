// api/chapter/route.ts
import { NextResponse } from 'next/server';

// 1. FORZAMOS DINAMISMO: Evita que Vercel guarde resultados antiguos en caché.
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
    // 2. HEADERS CON IDENTIDAD DE REM AI: 
    // Identificarse correctamente ayuda a que MangaDex no nos bloquee.
    const url = `https://api.mangadex.org/chapter?manga=${mangaId}&limit=100&offset=${offset}&order[chapter]=asc&order[volume]=asc&includes[]=scanlation_group`;
    
    const res = await fetch(url, { 
      headers: { 
        'User-Agent': 'Rem-AI-App/1.0',
        'Accept': 'application/json' 
      },
      next: { revalidate: 0 } // Refuerzo para asegurar datos en tiempo real
    });
    
    // 3. MANEJO DE ERRORES: Devolvemos el estado real para que el cliente sepa qué pasó.
    if (!res.ok) {
      console.error(`Rem AI - MangaDex error: ${res.status}`);
      return NextResponse.json({ error: 'Error al conectar con MangaDex' }, { status: res.status });
    }
    
    const data = await res.json();
    const chapters = Array.isArray(data.data) ? data.data : [];

    const formattedChapters = chapters.map((ch: MangaDexChapter) => ({
      id: ch.id,
      number: ch.attributes.chapter || '0',
      volume: ch.attributes.volume || 'N/A',
      language: ch.attributes.translatedLanguage || 'unknown',
    }));

    return NextResponse.json({
      data: formattedChapters,
      total: data.total 
    });
  } catch (error) {
    console.error("Rem AI - Error crítico en api/chapter:", error);
    return NextResponse.json({ error: 'Fallo interno al procesar capítulos' }, { status: 500 });
  }
}