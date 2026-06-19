'use client';
import { useEffect, useState, use } from 'react';

export default function LectorManga({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id || id === 'undefined') return;

    const fetchChapterData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/read/${id}`);
        
        if (!res.ok) throw new Error("Capítulo no encontrado");
        
        const data = await res.json();
        
        // Construimos las URLs completas usando la estructura de MangaDex
        // URL base: {baseUrl}/data/{chapterHash}/{filename}
        const imageUrls = data.pages.map((filename: string) => ({
          url: `${data.baseUrl}/data/${data.chapterHash}/${filename}`
        }));

        setImages(imageUrls);
      } catch (err) {
        console.error("Error en LectorManga:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterData();
  }, [id]);

  if (isLoading) return <div className="text-white p-10 text-center">Cargando páginas...</div>;

  return (
    <div className="flex flex-col items-center bg-[#0a0f1d] min-h-screen py-10">
      <h1 className="text-white mb-6">Visualizando capítulo: {id}</h1>
      
      {images.map((img, index) => (
        <img 
          key={index} 
          src={img.url} 
          alt={`Página ${index + 1}`} 
          className="w-full max-w-2xl mb-2 border border-white/10"
          loading="lazy" // Optimización para cargar imágenes a medida que haces scroll
        />
      ))}
    </div>
  );
}