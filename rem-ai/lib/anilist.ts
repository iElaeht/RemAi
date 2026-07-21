// lib/anilist.ts
import { getTranslatedDescription } from './translator';

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

export async function fetchAniListMedia(title: string): Promise<AniListMediaResult | null> {
  try {
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
    
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { search: title } }),
    });
    
    const json: AniListGraphQLResponse = await res.json();
    const media = json?.data?.Media;
    
    if (!media) return null;

    // 1. Limpieza de descripción
    const cleanDesc = media.description
      ? media.description.replace(/<[^>]+>/g, "").replace(/\n/g, " ").trim()
      : "Sin descripción disponible.";

    const siteUrl = media.siteUrl || "https://anilist.co";
    
    // 2. Traducción de la descripción usando caché
    const cacheId = `anilist-${title.toLowerCase().replace(/\s+/g, '-')}`;
    console.log("Consultando caché o traduciendo descripción...");
    const finalDesc = await getTranslatedDescription(cacheId, cleanDesc);

    // 3. Mapeo de personajes fuertemente tipado
    const characters: AniListCharacter[] = (media.characters?.edges || []).map((edge: AniListCharacterEdge) => ({
      id: edge.node.id,
      name: edge.node.name.full,
      role: edge.role === "MAIN" ? "Principal" : "Secundario",
      image: edge.node.image?.large || "/placeholder.jpg",
    }));

    return {
      description: finalDesc,
      url: siteUrl,
      characters,
    };
  } catch (e) {
    console.error("Error al obtener datos de AniList:", e);
    return null;
  }
}