export function getProxiedImageUrl(url: string): string {
  if (!url || url.includes('placeholder')) return url || '/placeholder-manga.jpg';
  
  // Si ya está apuntando al proxy o es una ruta interna, no la alteramos
  if (url.startsWith('/api/proxy') || url.startsWith('/')) return url;

  // Quitamos http:// o https:// para que el proxy la procese limpio
  const cleanUrl = url.replace(/^https?:\/\//, '');
  return `/api/proxy/images/${cleanUrl}`;
}