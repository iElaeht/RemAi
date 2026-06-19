// app/(main)/layout.tsx
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 'flex-col' con 'min-h-screen' asegura que el footer siempre
    // se empuje al fondo si el contenido es corto.
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* El contenedor principal que expande el contenido.
        Al usar flex-1, obligamos a que el main siempre ocupe el espacio
        restante entre el Navbar y el Footer.
      */}
      <div className="flex-1 w-full flex flex-col">{children}</div>

      <Footer />
    </div>
  );
}
