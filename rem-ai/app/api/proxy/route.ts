import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url || !url.startsWith('https://')) {
    return new NextResponse('URL inválida o no permitida', { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Referer': 'https://mangadex.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error('Error al obtener la imagen');

    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: { 
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cachea la imagen por 24 horas en el navegador
      }
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse('Error al cargar la imagen', { status: 502 });
  }
}