import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get('url');

  if (!urlParam) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    // Decodificar la URL por si viene doblemente codificada
    const targetUrl = decodeURIComponent(urlParam);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://mangadex.org/',
        'Origin': 'https://mangadex.org/',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch from source: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get('Content-Type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Error in image proxy:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}