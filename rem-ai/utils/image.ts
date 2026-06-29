// utils/image.ts
export function getProxiedImageUrl(baseUrl: string): string {
  if (!baseUrl || baseUrl.includes('placeholder')) return '/placeholder-manga.jpg';
  
  // Quitamos https:// porque el route.ts lo añade
  const cleanUrl = baseUrl.replace(/^https?:\/\//, '');
  return `/api/proxy/images/${cleanUrl}`;
}