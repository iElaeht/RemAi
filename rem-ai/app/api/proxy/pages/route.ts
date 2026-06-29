import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');

  // 1. Validación de seguridad mejorada
  if (!urlParam || !urlParam.startsWith('https://')) {
    return new NextResponse('URL inválida', { status: 400 });
  }

  try {
    // 2. Fetch con configuración para seguir redirecciones
    const response = await fetch(urlParam, {
      redirect: 'follow', // IMPORTANTE: MangaDex a menudo redirige a los nodos de carga
      headers: {
        'Referer': 'https://mangadex.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // 3. Manejo de error más tolerante
    if (!response.ok) {
        console.error(`Error de MangaDex: ${response.status} en ${urlParam}`);
        return new NextResponse('Error al obtener la imagen', { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: { 
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      }
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse('Error interno al cargar', { status: 502 });
  }
}