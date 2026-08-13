// utils/image.ts
export function getImageUrl(url: string): string {
  if (!url || url.includes('placeholder')) {
    return url || '/images/NoImage/placeholder-manga.jpg';
  }
  
  // Si ya pasa por el proxy o es una ruta interna local, la devolvemos tal cual
  if (url.startsWith('/images/') || url.startsWith('/api/proxy') || url.startsWith('/')) {
    return url;
  }

  // Forzamos el uso del proxy asegurando que la URL externa esté bien codificada
  return `/api/proxy/pages?url=${encodeURIComponent(url)}`;
}

export default getImageUrl;