import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) return new NextResponse('Missing URL', { status: 400 });

  try {
    // Es fundamental incluir un User-Agent para evitar el bloqueo de MangaDex
    const response = await fetch(imageUrl, {
      headers: {
        'Referer': 'https://mangadex.org/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) throw new Error('Fetch failed');

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, s-maxage=86400', // Cachear la imagen por 24h
      },
    });
  } catch (error) {
    return new NextResponse('Error loading image', { status: 500 });
  }
}