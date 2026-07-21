// types/mangadex.ts
export interface AniListCharacter {
  id: number;
  name: string;
  role: string;
  image: string;
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
}

export type SortOption = 'latestUploadedChapter' | 'rating' | 'followedCount';
export type StatusOption = 'all' | 'ongoing' | 'completed' | 'hiatus';