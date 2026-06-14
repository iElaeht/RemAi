'use client';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-sky-900/20 bg-neutral-950 px-6 py-12 md:px-24 md:py-20">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-12">
        
        {/* Columna Branding */}
        <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div className="text-3xl font-black text-white">
            Rem<span className="text-sky-400">Ai</span>
          </div>
          <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
            La plataforma definitiva para amantes del manga. Inteligencia artificial aplicada a la lectura, optimización de imágenes y una biblioteca siempre actualizada.
          </p>
        </div>

        {/* Columnas de Navegación */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center md:text-left">
          {[
            { title: 'Plataforma', links: [{n: 'Explorar', h: '/discover'}, {n: 'Top Mangas', h: '#'}, {n: 'Novedades', h: '#'}] },
            { title: 'Legal', links: [{n: 'Privacidad', h: '#'}, {n: 'Términos de uso', h: '#'}] },
            { title: 'Soporte', links: [{n: 'Discord', h: '#'}, {n: 'Contacto', h: '#'}] }
          ].map((section) => (
            <div key={section.title} className="flex flex-col items-center md:items-start">
              <h4 className="font-bold text-white mb-6">{section.title}</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                {section.links.map((link) => (
                  <li key={link.n}>
                    <Link href={link.h} className="hover:text-sky-400 transition cursor-pointer">
                      {link.n}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/5 text-center">
        <p className="text-neutral-600 text-xs">
          &copy; {currentYear} RemAi. Desarrollado por Elaehtdev.
        </p>
      </div>
    </footer>
  );
}