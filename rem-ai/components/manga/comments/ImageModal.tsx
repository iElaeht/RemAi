'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Download } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const timestamp = Date.now().toString().slice(-8);
      const fileName = `AI_MangasImage_${timestamp}.jpg`;

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName; // Usamos nuestro nombre dinámico
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar:", error);
    }
  };

  return (
    // Agregamos el onClick al contenedor padre para cerrar el modal
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      {/* Detenemos la propagación del clic en el contenedor interno para que no se cierre al clickear la imagen */}
      <div 
        className="relative max-w-4xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Barra de Controles Superior */}
        <div className="absolute -top-16 right-0 flex gap-4 z-10">
          <button 
            onClick={handleDownload}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10 cursor-pointer"
            title="Descargar"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10 cursor-pointer"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Contenedor de Imagen con Next/Image */}
        <div className="relative max-h-[85vh] w-full flex items-center justify-center">
          {!hasError && imageUrl ? (
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <Image 
                src={imageUrl} 
                alt="Vista previa" 
                fill
                unoptimized
                className="object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                onError={() => setHasError(true)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-sm text-neutral-400 bg-neutral-900 rounded-2xl border border-white/10 p-6">
              No se pudo cargar la imagen
            </div>
          )}
        </div>
      </div>
    </div>
  );
}