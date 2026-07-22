// api/manhwas/route.ts
import { NextResponse } from "next/server";

// Forzamos que la ruta sea dinámica para evitar problemas con caché estática en Vercel
export const dynamic = "force-dynamic";

// Interfaces para tipar la respuesta de la API de MangaDex
interface ManhwaAttributes {
  title: Record<string, string>;
  contentRating: string;
  status: string; // "ongoing", "completed", etc.
  originalLanguage: string;
  tags: { attributes: { name: { en: string } } }[];
}

interface ManhwaRelationship {
  type: string;
  attributes?: { fileName?: string; name?: string };
}

interface ManhwaData {
  id: string;
  attributes: ManhwaAttributes;
  relationships: ManhwaRelationship[];
}

export async function GET(request: Request) {
  // 1. Capturamos los parámetros de búsqueda de la URL
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const tags = searchParams.get("tags") || "";
  const sort = searchParams.get("sort") || "latestUploadedChapter";
  const status = searchParams.get("status") || "all";

  // 2. Configuración de paginación (18 elementos por página)
  const limit = 24;
  const offset = (Math.max(1, page) - 1) * limit;

  // 3. Construcción de los parámetros de consulta para MangaDex
  const query = new URLSearchParams({
    limit: limit.toString(),
    offset: Math.min(offset, 10000 - limit).toString(),
  });

  // Solicitamos relaciones necesarias (autor y portada)
  query.append("includes[]", "author");
  query.append("includes[]", "cover_art");
  
  // FILTRO CLAVE: Exclusivo para manhwas de origen coreano ("ko y zh")
  query.append("originalLanguage[]", "ko");
  query.append("originalLanguage[]", "zh");

  // Opcional: También puedes asegurar que incluya la etiqueta de formato Webtoon si lo deseas
  // query.append("includedTags[]", "02323315-5bb5-486c-9942-c1676704d31f"); // ID de Webtoon en MangaDex

  // Restricciones de contenido permitidas
  ["safe", "suggestive", "erotica", "pornographic"].forEach((r) =>
    query.append("contentRating[]", r),
  );

  // Idiomas de traducción admitidos
  ["es", "en", "ja", "ko", "zh"].forEach((lang) => 
    query.append("availableTranslatedLanguage[]", lang)
  );

  // Aplicar búsqueda por título si existe
  if (search) query.append("title", search);

  // Aplicar filtros por etiquetas (géneros) si existen
  if (tags)
    tags
      .split(",")
      .forEach((t) => t.trim() && query.append("includedTags[]", t.trim()));

  // Criterios de ordenamiento
  if (sort === "latestUploadedChapter") {
    query.append("order[latestUploadedChapter]", "desc");
  } else if (sort === "rating") {
    query.append("order[rating]", "desc");
  } else if (sort === "followedCount") {
    query.append("order[followedCount]", "desc");
  }

  // Filtro por estado de publicación
  if (status !== "all") {
    query.append("status[]", status);
  }

  try {
    // 4. Petición principal a la API de MangaDex
    const res = await fetch(
      `https://api.mangadex.org/manga?${query.toString()}`,
      {
        headers: { "User-Agent": "Rem-AI-App/1.0" },
        next: { revalidate: 60 },
      },
    );

    if (!res.ok)
      return NextResponse.json({ results: [] }, { status: res.status });
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ results: [], totalPages: 0 });
    }

    // 5. Recolectar IDs para pedir estadísticas de calificaciones en lote
    const manhwaIds = data.data.map((m: ManhwaData) => m.id);
    const statsRes = await fetch(
      `https://api.mangadex.org/statistics/manga?${manhwaIds.map((id: string) => `manga[]=${id}`).join("&")}`,
    );
    const statsData = await statsRes.json();

    // 6. Mapear y formatear los resultados finales
    const formattedResults = data.data.map((manhwa: ManhwaData) => {
      const coverRel = manhwa.relationships.find((r) => r.type === "cover_art");
      const authorRel = manhwa.relationships.find((r) => r.type === "author");
      const stats = statsData.statistics?.[manhwa.id]?.rating?.average;

      const fileName = coverRel?.attributes?.fileName;

      return {
        id: manhwa.id,
        title:
          manhwa.attributes.title.en ||
          Object.values(manhwa.attributes.title)[0] ||
          "Sin título",
        cover: fileName
          ? `https://uploads.mangadex.org/covers/${manhwa.id}/${fileName}.256.jpg`
          : "",
        tags: manhwa.attributes.tags?.map((t) => t.attributes.name.en) || [],
        author: authorRel?.attributes?.name || "Autor desconocido",
        rating: stats ? stats.toFixed(1) : "0.0",
        status: manhwa.attributes.status,
      };
    });

    return NextResponse.json({
      results: formattedResults,
      totalPages: Math.min(Math.ceil((data.total || 0) / limit), 555),
    });
  } catch (error) {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}