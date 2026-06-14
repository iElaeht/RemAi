export interface MangaResponse {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  status: string;
  tags: string[];
  latestChapter?: string;
}
