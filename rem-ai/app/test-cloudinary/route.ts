import { NextResponse } from 'next/server';

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Verificamos si las variables están cargadas
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Faltan variables de entorno de Cloudinary" }, { status: 500 });
  }

  return NextResponse.json({ 
    message: "¡Conexión lista! Credenciales detectadas correctamente.",
    cloudName 
  });
}