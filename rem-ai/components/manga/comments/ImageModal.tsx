'use client';

import { X, Download } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
  if (!isOpen) return null;

const handleDownload = async () => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const timestamp = Date.now().toString().slice(-8);
    const fileName = `MangaRemImage_${timestamp}.jpg`;

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
        <div className="absolute -top-16 right-0 flex gap-4">
          <button 
            onClick={handleDownload}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10"
            title="Descargar"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Imagen */}
        <img 
          src={imageUrl} 
          alt="Vista previa" 
          className="max-h-[85vh] w-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10" 
        />
      </div>
    </div>
  );
}