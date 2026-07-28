// types/mangadex.ts

/**
 * Estructura de los personajes obtenidos desde AniList.
 */
export interface AniListCharacter {
  id: number;
  name: string;
  role: string;
  image: string;
}

/**
 * Estructura procesada para las portadas/artes del manga.
 */
export interface MangaCover {
  id: string;
  volume: string | null;
  fileName: string;
  imageUrl: string;
  locale?: string | null;
}

/**
 * Estructura del item individual de portada que devuelve la API de MangaDex.
 */
export interface MangaDexCoverItem {
  id: string;
  attributes: {
    fileName: string;
    volume?: string | null;
    locale?: string | null;
  };
}

/**
 * Respuesta global de la API de MangaDex al solicitar portadas.
 */
export interface MangaDexCoverResponse {
  result: string;
  data: MangaDexCoverItem[];
}

/**
 * Estructura principal que modela los datos de un manga para la aplicación.
 */
export interface MangaResponse {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  status: string;
  tags: string[];
  latestChapter?: string;
  rating: number;
  altTitles?: { [key: string]: string }[];
  arts?: string[]; 
  
  // Propiedades de origen y enlace para la descripción
  descriptionUrl?: string;                  // URL del sitio de origen (AniList o MangaDex)
  sourceName?: "AniList" | "MangaDex";      // Identifica de qué plataforma proviene la data actual

  characters?: AniListCharacter[];
  covers?: MangaCover[];
  type?: 'manga' | 'manhwa' | 'manhua';       // Tipado estricto principal
  contentType?: 'manga' | 'manhwa' | 'manhua'; // Alias por compatibilidad
}

// Opciones de filtrado y ordenamiento globales
export type SortOption = 'latestUploadedChapter' | 'rating' | 'followedCount';
export type StatusOption = 'all' | 'ongoing' | 'completed' | 'hiatus';