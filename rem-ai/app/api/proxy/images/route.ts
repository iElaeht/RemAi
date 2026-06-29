// app/api/proxy/images/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('No url', { status: 400 });

  try {
    const response = await fetch(url, {
      headers: { 'Referer': 'https://mangadex.org/' }
    });
    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'image/jpeg' }
    });
  } catch {
    return new NextResponse('Error', { status: 500 });
  }
}