// api/mangas/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Interfaces para tipar la respuesta de la API de MangaDex
interface MangaAttributes {
  title: Record<string, string>;
  contentRating: string;
  status: string; // "ongoing", "completed", etc.
  originalLanguage: string;
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
  // 1. Capturamos los parámetros de búsqueda de la URL (página, texto, tags, orden, estado)
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
  
  // FILTRO CLAVE: Exclusivo para mangas de origen japonés ("ja")
  query.append("originalLanguage[]", "ja");

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

  // Filtro por estado de publicación (ej. en emisión, finalizado)
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

    // Si no hay resultados, retornamos vacío
    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ results: [], totalPages: 0 });
    }

    // 5. Recolectar IDs para pedir estadísticas de calificaciones en lote
    const mangaIds = data.data.map((m: MangaData) => m.id);
    const statsRes = await fetch(
      `https://api.mangadex.org/statistics/manga?${mangaIds.map((id: string) => `manga[]=${id}`).join("&")}`,
    );
    const statsData = await statsRes.json();

    // 6. Mapear y formatear los resultados finales para enviarlos al cliente
    const formattedResults = data.data.map((manga: MangaData) => {
      const coverRel = manga.relationships.find((r) => r.type === "cover_art");
      const authorRel = manga.relationships.find((r) => r.type === "author");
      const stats = statsData.statistics?.[manga.id]?.rating?.average;

      const fileName = coverRel?.attributes?.fileName;

      return {
        id: manga.id,
        title:
          manga.attributes.title.en ||
          Object.values(manga.attributes.title)[0] ||
          "Sin título",
        cover: fileName
          ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.512.jpg`
          : "",
        tags: manga.attributes.tags?.map((t) => t.attributes.name.en) || [],
        author: authorRel?.attributes?.name || "Autor desconocido",
        rating: stats ? stats.toFixed(1) : "0.0",
        status: manga.attributes.status,
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