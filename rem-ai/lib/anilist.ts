// lib/anilist.ts
import { getTranslatedDescription } from "./translator";

export interface AniListCharacter {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface AniListMediaResult {
  description: string;
  url: string;
  characters: AniListCharacter[];
}

// Interfaces internas para tipar la respuesta de la API de AniList sin usar any
interface AniListCharacterEdge {
  role: string;
  node: {
    id: number;
    name: {
      full: string;
    };
    image?: {
      large?: string;
    };
  };
}

interface AniListGraphQLResponse {
  data?: {
    Media?: {
      description?: string;
      siteUrl?: string;
      characters?: {
        edges?: AniListCharacterEdge[];
      };
    };
  };
}

export async function fetchAniListMedia(
  titles: string | string[],
  mangaId?: string,
): Promise<AniListMediaResult | null> {
  // Convertimos a arreglo y eliminamos duplicados o nulos
  const titlesList = Array.isArray(titles) ? titles : [titles];
  const uniqueTitles = Array.from(new Set(titlesList.filter(Boolean)));

  const query = `
    query ($search: String) { 
      Media(search: $search, type: MANGA) { 
        description(asHtml: false)
        siteUrl
        characters(sort: [ROLE, FAVOURITES_DESC], perPage: 10, page: 1) {
          edges {
            role
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
      } 
    }`;

  // Iteramos sobre cada título en orden de prioridad
  for (const currentTitle of uniqueTitles) {
    try {
      console.log(
        `Intentando buscar en AniList con el título: "${currentTitle}"`,
      );

      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { search: currentTitle } }),
      });

      const json: AniListGraphQLResponse = await res.json();
      const media = json?.data?.Media;

      // Si encuentra un resultado válido con descripción, lo procesamos y retornamos
      if (media && media.description) {
        // 1. Limpieza de descripción
        const cleanDesc = media.description
          .replace(/<[^>]+>/g, "")
          .replace(/\n/g, " ")
          .trim();

        const siteUrl = media.siteUrl || "https://anilist.co";

        // 2. Generación de la clave de caché estricta usando el UUID único de MangaDex
        const slugTitle = currentTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        const cacheId = mangaId
          ? `anilist-${mangaId}`
          : slugTitle
            ? `anilist-${slugTitle}`
            : `anilist-fallback-${Date.now()}`;

        console.log(
          `Consultando caché en Supabase con ID único (${cacheId}) o traduciendo descripción...`,
        );
        const finalDesc = await getTranslatedDescription(cacheId, cleanDesc);

        // 3. Mapeo de personajes con el detalle de rol estilo AniList
        const characters: AniListCharacter[] = (
          media.characters?.edges || []
        ).map((edge: AniListCharacterEdge) => ({
          id: edge.node.id,
          name: edge.node.name.full,
          role:
            edge.role === "MAIN"
              ? "Main (Principal)"
              : "Supporting (Secundario)",
          image: edge.node.image?.large || "/placeholder.jpg",
        }));

        return {
          description: finalDesc,
          url: siteUrl,
          characters,
        };
      }
    } catch (e) {
      console.error(
        `Error al buscar en AniList con el título "${currentTitle}":`,
        e,
      );
    }
  }

  console.warn(
    "No se pudo encontrar información en AniList con ninguno de los títulos provistos.",
  );
  return null;
}