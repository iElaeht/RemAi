// utils/image.ts
export function getImageUrl(url: string): string {
  if (!url || url.includes('placeholder')) {
    return url || '/images/NoImage/placeholder-manga.jpg';
  }
  
  // Devolvemos la URL directa sin pasar por ningún proxy
  return url;
}