// types/mangadex.ts

export interface MangaResponse {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  descriptionUrl?: string;
  status: string;
  tags: string[];
  latestChapter?: string;
  rating: number;
  altTitles?: { [key: string]: string }[];
  arts?: string[]; 
  
}

export type SortOption = 'latestUploadedChapter' | 'rating' | 'followedCount';
export type StatusOption = 'all' | 'ongoing' | 'completed' | 'hiatus';