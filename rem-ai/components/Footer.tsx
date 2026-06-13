import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-sky-900/20 bg-neutral-950 px-6 md:px-24 py-20">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
        
        {/* Columna Logo/Branding */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="text-3xl font-black text-white">
            Rem<span className="text-sky-400">Ai</span>
          </div>
          <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
            La plataforma definitiva para amantes del manga. Inteligencia artificial aplicada a la lectura, optimización de imágenes y una biblioteca siempre actualizada.
          </p>
        </div>

        {/* Columnas de Navegación */}
        <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
          <div>
            <h4 className="font-bold text-white mb-6">Plataforma</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="/discover" className="hover:text-sky-400 transition">Descubrir</Link></li>
              <li><Link href="#" className="hover:text-sky-400 transition">Top Mangas</Link></li>
              <li><Link href="#" className="hover:text-sky-400 transition">Novedades</Link></li>
              <li><Link href="#" className="hover:text-sky-400 transition">Comunidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="#" className="hover:text-sky-400 transition">Privacidad</Link></li>
              <li><Link href="#" className="hover:text-sky-400 transition">Términos de uso</Link></li>
              <li><Link href="#" className="hover:text-sky-400 transition">Cookies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Soporte</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="#" className="hover:text-sky-400 transition">Discord</Link></li>
              <li><Link href="#" className="hover:text-sky-400 transition">Contacto</Link></li>
              <li><Link href="#" className="hover:text-sky-400 transition">FAQ</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Línea final */}
      <div className="pt-8 border-t border-white/5 text-center">
        <p className="text-neutral-600 text-xs">
          &copy; {new Date().getFullYear()} RemAi. Desarrollado por Elaehtdev.
        </p>
      </div>
    </footer>
  );
}