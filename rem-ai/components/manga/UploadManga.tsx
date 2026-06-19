'use client';

import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';

export default function UploadManga() {
  return (
    <CldUploadWidget 
      uploadPreset="unsigned_upload" 
        onSuccess={(result: CloudinaryUploadWidgetResults) => {
            const info = result.info as { secure_url: string };
            console.log("¡Éxito! URL de la imagen:", info.secure_url);
            alert("¡Imagen subida correctamente!");
        }}
    >
      {({ open }) => (
        <button 
          onClick={() => open()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Subir Portada de Manga
        </button>
      )}
    </CldUploadWidget>
  );
}