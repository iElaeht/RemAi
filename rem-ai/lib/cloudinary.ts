// En lib/cloudinary.ts
export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'unsigned_upload');

  // Asegúrate de usar estas comillas invertidas (backticks)
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json(); // Añade esto
  
  if (!res.ok) {
    console.error("Error completo de Cloudinary:", data); // Esto te dirá el motivo exacto (ej. preset inválido)
    throw new Error("Error al subir a Cloudinary");
  }
  
  return data.secure_url;
};