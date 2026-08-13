// app/api/chapter/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Interfaces para tipar la respuesta de MangaDex
interface MangaDexChapter {
  id: string;
  attributes: {
    chapter: string | null;
    volume: string | null;
    translatedLanguage: string;
  };
}

// Interfaz para el capítulo ya formateado y limpio
interface FormattedChapter {
  id: string;
  number: string;
  volume: string;
  language: string;
}

// 1. Jerarquía de prioridad de idiomas solicitada
const LANGUAGE_PRIORITY: Record<string, number> = {
  'es-la': 1, // Español Latino (primera opción)
  'es': 2,    // Español España
  'en': 3,    // Inglés
  'pt-br': 4, // Portugués Brasil
  'pt': 5,    // Portugués
  'fr': 6,    // Francés
  'it': 7,    // Italiano
  'uk': 8,    // Ucraniano
  'ja': 9,    // Japonés
  // Otros idiomas tendrán prioridad 99 por defecto
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mangaId = searchParams.get('mangaId');
  const offset = searchParams.get('offset') || '0';

  if (!mangaId) {
    return NextResponse.json({ error: 'Manga ID es requerido' }, { status: 400 });
  }

  try {
    // 2. Construcción de parámetros con filtros de contenido y lenguaje
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

    // 3. Filtros de idioma optimizados (solo los más comunes)
    const preferredLanguages = [
      "es-la", "es", "en", "pt-br", "pt", "fr", "it", "uk", "ja", 
      "de", "ru", "ko", "zh", "zh-hk"
    ];

    preferredLanguages.forEach((lang) =>
      params.append("translatedLanguage[]", lang)
    );

    // 4. Fetch con Identidad (User-Agent)
    const url = `https://api.mangadex.org/chapter?${params.toString()}`;
    const res = await fetch(url, {
      headers: { 
        'User-Agent': 'Rem-AI-App/1.0',
        'Accept': 'application/json' 
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.error(`Rem AI - Error en MangaDex: ${res.status}`);
      return NextResponse.json({ error: 'Error al conectar con MangaDex' }, { status: res.status });
    }

    const data = await res.json();
    const chapters = Array.isArray(data.data) ? data.data : [];

    // 5. Mapeo de datos asegurando valores por defecto y tipado
    const formattedChapters: FormattedChapter[] = chapters.map((ch: MangaDexChapter) => ({
      id: ch.id,
      number: ch.attributes.chapter || '0',
      volume: ch.attributes.volume || 'N/A',
      language: ch.attributes.translatedLanguage || 'unknown',
    }));

    // 6. Ordenamiento inteligente: 
    // Primero por número de capítulo (numérico) y luego por prioridad de idioma (es-la > es > en...)
    formattedChapters.sort((a: FormattedChapter, b: FormattedChapter) => {
      // Ordenar por número de capítulo numéricamente si es posible
      const numA = parseFloat(a.number);
      const numB = parseFloat(b.number);
      
      if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
        return numA - numB;
      }

      // Si es el mismo capítulo, ordenamos por prioridad de idioma
      const priorityA = LANGUAGE_PRIORITY[a.language] || 99;
      const priorityB = LANGUAGE_PRIORITY[b.language] || 99;
      return priorityA - priorityB;
    });

    return NextResponse.json({
      data: formattedChapters,
      total: data.total || 0
    });

  } catch (error) {
    console.error("Rem AI - Error crítico en api/chapter:", error);
    return NextResponse.json({ error: 'Fallo interno al procesar capítulos' }, { status: 500 });
  }
}