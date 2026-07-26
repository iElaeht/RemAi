// utils/image.ts
export function getProxiedImageUrl(url: string): string {
  if (!url || url.includes('placeholder')) return url || '/placeholder-manga.jpg';
  
  // Si ya está apuntando al proxy o es una ruta interna, no la alteramos
  if (url.startsWith('/api/proxy') || url.startsWith('/')) return url;

  // Corregido para apuntar a tu proxy real /api/proxy/pages?url=...
  return `/api/proxy/pages?url=${encodeURIComponent(url)}`;
}