// types/mangadex.ts
export interface AniListCharacter {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface MangaCover {
  id: string;
  volume: string | null;
  fileName: string;
  imageUrl: string;
  locale?: string | null;
}

// Interfaces crudas para tipar la respuesta directa de la API de MangaDex
export interface MangaDexCoverItem {
  id: string;
  attributes: {
    fileName: string;
    volume?: string | null;
    locale?: string | null;
  };
}

export interface MangaDexCoverResponse {
  result: string;
  data: MangaDexCoverItem[];
}

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
  descriptionUrl?: string;
  characters?: AniListCharacter[];
  covers?: MangaCover[];
}

export type SortOption = 'latestUploadedChapter' | 'rating' | 'followedCount';
export type StatusOption = 'all' | 'ongoing' | 'completed' | 'hiatus';