// types/mangadex.ts

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
}

// Tipos para los filtros
export type SortOption = 'latestUploadedChapter' | 'rating' | 'followedCount';
export type StatusOption = 'all' | 'ongoing' | 'completed' | 'hiatus';