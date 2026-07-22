// utils/mangaTypeDetector.ts
import { MangaResponse } from "@/types/mangadex";

export function detectContentType(manga: MangaResponse): 'manga' | 'manhwa' | 'manhua' {
  // Si ya viene definido explícitamente, lo respetamos
  if (manga.type) return manga.type;
  if (manga.contentType) return manga.contentType;

  // Analizamos los tags en minúsculas por si MangaDex incluye la etiqueta de formato
  const tagsLower = manga.tags?.map((t) => t.toLowerCase()) || [];

  if (tagsLower.some((tag) => tag.includes('manhwa') || tag.includes('korean'))) {
    return 'manhwa';
  }
  
  if (tagsLower.some((tag) => tag.includes('manhua') || tag.includes('chinese'))) {
    return 'manhua';
  }

  // Por defecto se queda como manga
  return 'manga';
}