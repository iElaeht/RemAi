// api/chapter/route.ts
import { NextResponse } from 'next/server';

interface MangaDexChapter {
  id: string;
  attributes: {
    chapter: string | null;
    volume: string | null; // <--- AGREGADO
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
    // Añadimos &includes[]=manga por seguridad, aunque la API suele traer el volumen por defecto
    const url = `https://api.mangadex.org/chapter?manga=${mangaId}&limit=100&offset=${offset}&order[chapter]=asc`;
    
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'RemAI-App/1.0' } 
    });
    
    if (!res.ok) throw new Error(`MangaDex respondió con: ${res.status}`);
    
    const data = await res.json();
    const chapters = Array.isArray(data.data) ? data.data : [];

    const formattedChapters = chapters.map((ch: MangaDexChapter) => ({
      id: ch.id,
      number: ch.attributes.chapter || '0',
      volume: ch.attributes.volume, // <--- AHORA SÍ SE PASA AL FRONTEND
      language: ch.attributes.translatedLanguage || 'unknown',
    }));

    return NextResponse.json({
      data: formattedChapters,
      total: data.total 
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Fallo al procesar' }, { status: 500 });
  }
}