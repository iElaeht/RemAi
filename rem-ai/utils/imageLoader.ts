// utils/imageLoader.ts
export default function mangadexLoader({ src }: { src: string }) {
  // Si es un placeholder, lo servimos directo
  if (src.includes('placeholder')) return src;
  
  // Transformamos la URL al formato que tu proxy espera
  const cleanUrl = src.replace(/^https?:\/\//, '');
  return `/api/proxy/images/${cleanUrl}`;
}