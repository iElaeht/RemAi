import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');

  // BLINDAJE: Solo permitimos URLs que pertenezcan a los nodos de carga de MangaDex
  // Esto evita que alguien use tu proxy para hacer peticiones a otros sitios maliciosos
  if (!urlParam || !urlParam.startsWith('https://uploads.mangadex.org/')) {
    return new NextResponse('Acceso denegado o URL no permitida', { status: 403 });
  }

  try {
    const response = await fetch(urlParam, {
      headers: {
        'Referer': 'https://mangadex.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`MangaDex error: ${response.status} - ${response.statusText}`);
      return new NextResponse('Error al obtener la imagen del capítulo', { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    
    // Devolvemos la imagen con caché para optimizar velocidad en el lector
    return new NextResponse(buffer, {
      headers: { 
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // 24 horas de caché
      }
    });
  } catch (error) {
    console.error('Proxy Error en Capítulos:', error);
    return new NextResponse('Error interno al cargar la página', { status: 502 });
  }
}