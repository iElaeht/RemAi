// utils/image.ts
export function getImageUrl(url: string): string {
  if (!url || url.includes('placeholder')) {
    return url || '/images/NoImage/placeholder-manga.jpg';
  }
  
  // Si la URL ya apunta al proxy, la dejamos igual
  if (url.startsWith('/api/proxy/pages')) {
    return url;
  }

  // Enviamos al proxy
  return `/api/proxy/pages?url=${encodeURIComponent(url)}`;
}