import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');

  // 1. Validación estricta
  if (!urlParam) {
    return new NextResponse('Missing URL', { status: 400 });
  }

  try {
    // 2. Fetch optimizado
    const response = await fetch(urlParam, {
      redirect: 'follow',
      headers: {
        'Referer': 'https://mangadex.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Proxy Error ${response.status}: ${urlParam}`);
      return new NextResponse('Upstream Error', { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: { 
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable', // Caché agresiva para imágenes (1 año)
      }
    });
  } catch (error) {
    console.error('Proxy Exception:', error);
    return new NextResponse('Internal Proxy Error', { status: 502 });
  }
}