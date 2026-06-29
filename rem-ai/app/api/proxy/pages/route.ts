// rem-ai/app/api/proxy/pages/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');
  
  // Permitimos dominios de datos de capítulos
  if (!urlParam || !urlParam.startsWith('https://uploads.mangadex.org/data/')) {
    return new NextResponse('Acceso denegado', { status: 403 });
  }

  try {
    const response = await fetch(decodeURIComponent(urlParam), {
      headers: { 'Referer': 'https://mangadex.org/' }
    });

    if (!response.ok) return new NextResponse('Error', { status: response.status });

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      headers: { 
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=3600' // Caché más corta para capítulos
      }
    });
  } catch {
    return new NextResponse('Error', { status: 502 });
  }
}