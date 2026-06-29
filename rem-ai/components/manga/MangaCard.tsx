// components/MangaCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
interface MangaCardProps {
  id: string;
  title: string;
  coverUrl: string;
  author?: string;
  status?: string; 
  tags?: string[];  
}

export default function MangaCard({ id, title, coverUrl, author, status, tags }: MangaCardProps) {
  // Mapeo amigable para el estado en español
  const statusMap: Record<string, { label: string; className: string }> = {
    ongoing: { label: 'En emisión', className: 'text-emerald-500 bg-emerald-500/10' },
    completed: { label: 'Finalizado', className: 'text-blue-500 bg-blue-500/10' },
    hiatus: { label: 'Pausa', className: 'text-amber-500 bg-amber-500/10' },
    cancelled: { label: 'Cancelado', className: 'text-rose-500 bg-rose-500/10' },
  };

  const currentStatus = status ? statusMap[status] : null;

  return (
    <Link 
      href={`/manga/${id}`}
      className="group flex flex-col space-y-2 rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px]"
    >
      {/* Contenedor de la Imagen con Aspect Ratio de Manga */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-900 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
        <Image
          src={coverUrl}
          alt={`Portada de ${title}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1000px) 33vw, (max-width: 1200px) 20vw, 15vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
      </div>

      {/* Textos Informativos Detallados */}
      <div className="flex flex-col space-y-0.5 px-1">
        {/* Título */}
        <h3 className="line-clamp-1 text-xs font-semibold text-neutral-900 transition-colors duration-200 group-hover:text-neutral-600 dark:text-neutral-100 dark:group-hover:text-neutral-400">
          {title}
        </h3>
        
        {/* Fila de Autor y Estado alineados a los extremos */}
        <div className="flex items-center justify-between space-x-2 text-[11px]">
          {author && (
            <span className="text-neutral-500 dark:text-neutral-400 line-clamp-1 font-medium max-w-[65%]">
              {author}
            </span>
          )}
          {currentStatus && (
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase shrink-0 ${currentStatus.className}`}>
              {currentStatus.label}
            </span>
          )}
        </div>

        {/* Tags / Géneros - Más notorios y sin opacidad baja */}
        {tags && tags.length > 0 && (
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 font-normal">
            {tags.slice(0, 2).join(' • ')}
          </p>
        )}
      </div>
    </Link>
  );
}