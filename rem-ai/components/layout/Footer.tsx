// components/Footer.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { Compass, BookOpen, Layers, MessageSquare, Coffee } from 'lucide-react'; 

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
          
          {/* Navegación Plataforma */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-white mb-6">Plataforma</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li>
                <Link href="/discover" className="flex items-center justify-center md:justify-start gap-2 hover:text-sky-400 transition group">
                  <Compass className="w-4 h-4 text-sky-500 group-hover:rotate-45 transition-transform" />
                  <span>Explorar</span>
                </Link>
              </li>
              <li>
                <Link href="/mangas" className="flex items-center justify-center md:justify-start gap-2 hover:text-sky-400 transition group">
                  <BookOpen className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span>Mangas</span>
                </Link>
              </li>
              <li>
                <Link href="/manhwas" className="flex items-center justify-center md:justify-start gap-2 hover:text-sky-400 transition group">
                  <Layers className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span>Manhwas</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-white mb-6">Servicios</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li>
                <Link href="/feedback" className="flex items-center justify-center md:justify-start gap-2 hover:text-sky-400 transition group">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>Reportar / Sugerir</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="https://ko-fi.com/elaehtdev" 
                  target="_blank" 
                  className="flex items-center justify-center md:justify-start gap-2 hover:text-sky-400 transition group"
                >
                  <Coffee className="w-4 h-4 text-amber-500 group-hover:animate-bounce" />
                  <span>Ko-fi</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="/legal/privacy" className="hover:text-sky-400 transition">Privacidad</Link></li>
              <li><Link href="/legal/terms" className="hover:text-sky-400 transition">Términos de uso</Link></li>
            </ul>
          </div>

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