// utils/image.ts
export function getProxiedImageUrl(url: string): string {
  if (!url || url.includes('placeholder')) {
    return url || '/images/NoImage/placeholder-manga.jpg';
  }
  
  // Si ya es una ruta interna (como /images/...) o ya pasa por el proxy, la devolvemos tal cual
  if (url.startsWith('/images/') || url.startsWith('/api/proxy') || url.startsWith('/')) {
    return url;
  }

  // Si es externa de MangaDex, la pasamos por el proxy de páginas
  return `/api/proxy/pages?url=${encodeURIComponent(url)}`;
}