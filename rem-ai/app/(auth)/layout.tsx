// app/(auth)/layout.tsx
import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Hemos añadido 'flex flex-col items-center justify-center' al contenedor principal
    // Esto asegura que cualquier cosa dentro de 'children' sea forzada al centro exacto.
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-neutral-950 via-slate-950 to-blue-950/40 p-6">
      <div className="w-full max-w-md flex justify-center">
        {children}
      </div>
    </div>
  );
}