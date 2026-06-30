import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Actualizamos interfaces para incluir status y rating
interface MangaAttributes {
  title: Record<string, string>;
  contentRating: string;
  status: string; // "ongoing", "completed", etc.
  tags: { attributes: { name: { en: string } } }[];
}

interface MangaRelationship {
  type: string;
  attributes?: { fileName?: string; name?: string };
}

interface MangaData {
  id: string;
  attributes: MangaAttributes;
  relationships: MangaRelationship[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const tags = searchParams.get("tags") || "";
  const sort = searchParams.get("sort") || "latestUploadedChapter";
  const status = searchParams.get("status") || "all";

  const limit = 18;
  const offset = (Math.max(1, page) - 1) * limit;

  const query = new URLSearchParams({
    limit: limit.toString(),
    offset: Math.min(offset, 10000 - limit).toString(),
  });
  query.append("includes[]", "author");
  query.append("includes[]", "cover_art");
  ["safe", "suggestive", "erotica"].forEach((r) => query.append("contentRating[]", r));

  if (search) query.append("title", search);
  if (tags) tags.split(",").forEach((t) => t.trim() && query.append("includedTags[]", t.trim()));
  if (sort === "latestUploadedChapter") {
  query.append("order[latestUploadedChapter]", "desc");
} else if (sort === "rating") {
  query.append("order[rating]", "desc");
} else if (sort === "followedCount") {
  query.append("order[followedCount]", "desc");
}
if (status !== "all") {
  query.append("status[]", status);
}

  try {
    // 1. Obtener lista de mangas
    const res = await fetch(`https://api.mangadex.org/manga?${query.toString()}`, {
      headers: { "User-Agent": "Rem-AI-App/1.0" },
      next: { revalidate: 60 },
    });
    
    if (!res.ok) return NextResponse.json({ results: [] }, { status: res.status });
    const data = await res.json();
    
    // 2. Recolectar IDs para pedir estadísticas masivamente
    const mangaIds = data.data.map((m: MangaData) => m.id);
    const statsRes = await fetch(`https://api.mangadex.org/statistics/manga?${mangaIds.map((id: string) => `manga[]=${id}`).join('&')}`);
    const statsData = await statsRes.json();

    // 3. Mapear resultados finales
    const formattedResults = data.data.map((manga: MangaData) => {
      const coverRel = manga.relationships.find((r) => r.type === "cover_art");
      const authorRel = manga.relationships.find((r) => r.type === "author");
      const stats = statsData.statistics?.[manga.id]?.rating?.average;
      
      const fileName = coverRel?.attributes?.fileName;

      return {
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "Sin título",
        cover: fileName ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg` : "",
        tags: manga.attributes.tags?.map((t) => t.attributes.name.en) || [],
        author: authorRel?.attributes?.name || "Autor desconocido",
        rating: stats ? stats.toFixed(1) : "0.0", // Puntaje real (ej: 8.5)
        status: manga.attributes.status // "ongoing", "completed", etc.
      };
    });

    return NextResponse.json({ 
      results: formattedResults, 
      totalPages: Math.min(Math.ceil((data.total || 0) / limit), 555) 
    });
  } catch (error) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}