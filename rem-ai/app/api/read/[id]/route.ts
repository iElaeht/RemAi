import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id || id === 'undefined') {
    return NextResponse.json({ error: 'ID de capítulo inválido' }, { status: 400 });
  }

  try {
    // La API de /at-home/server/${id} es la única que necesitas.
    // Esta endpoint retorna tanto el baseUrl como el hash y el array de páginas.
    const serverRes = await fetch(`https://api.mangadex.org/at-home/server/${id}`, {
      headers: { 'User-Agent': 'RemAI-App/1.0' },
      next: { revalidate: 3600 } // Caché por 1 hora para optimizar
    });

    const serverData = await serverRes.json();

    if (serverData.result !== 'ok') {
      return NextResponse.json({ error: 'No se pudo obtener el servidor de imágenes' }, { status: 404 });
    }

    // Estructura de respuesta estandarizada
    return NextResponse.json({
      baseUrl: serverData.baseUrl,
      chapterHash: serverData.chapter.hash,
      pages: serverData.chapter.data, // Nombres de los archivos
      dataSaver: serverData.chapter.dataSaver // Opcional: imágenes de menor peso
    });

  } catch (error) {
    console.error("Error al obtener datos de MangaDex:", error);
    return NextResponse.json({ error: 'Error interno del servidor al procesar la lectura' }, { status: 500 });
  }
}