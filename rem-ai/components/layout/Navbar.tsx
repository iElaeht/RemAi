'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Bookmark, Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const menuItems = [
    { name: 'Inicio', path: '/discover' },
    { name: 'Biblioteca', path: '/library' }
  ];

  return (
    <nav className="w-full border-b border-blue-900/50 bg-[#0a0f1d] h-16 flex items-center justify-between px-6 md:px-12 transition-all relative">
      
      {/* Logo con imagen a la derecha */}
      <div className="flex items-center z-50">
        <button onClick={() => router.push('/discover')} className="flex items-center text-2xl font-black text-white">
          Rem<span className="text-sky-400">Ai</span>
          {/* Imagen a la derecha del texto */}
          <img 
            src="/images/navbar/rem-navbar.png" 
            alt="Rem" 
            className="w-8 h-8 ml-2 object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" 
          />
        </button>
      </div>

      {/* Menu Desktop */}
      <div className="hidden md:flex items-center space-x-1 h-full">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.path} 
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isActive(item.path) ? 'text-white bg-sky-900/50' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right Side (Acciones) */}
      <div className="flex items-center space-x-2 z-50">
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/colaborar" className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/5"><Sparkles size={18} /></Link>
          <Link href="/favorites" className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/5"><Bookmark size={18} /></Link>
        </div>
        
        <div className="pl-2 md:pl-4 ml-2 border-l border-blue-900/50 flex items-center">
          <UserButton appearance={{ elements: { avatarBox: "!h-8 !w-8" } }} />
          {/* Botón Hamburguesa Móvil */}
          <button className="md:hidden ml-4 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Desplegable */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#0a0f1d] border-b border-blue-900/50 p-6 flex flex-col gap-4 md:hidden z-40 shadow-2xl">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path} 
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg font-medium ${isActive(item.path) ? 'text-sky-400' : 'text-neutral-300'}`}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t border-white/10 pt-4 flex gap-6">
            <Link href="/colaborar" className="text-neutral-300 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}><Sparkles size={20}/> Colaborar</Link>
            <Link href="/favorites" className="text-neutral-300 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}><Bookmark size={20}/> Favoritos</Link>
          </div>
        </div>
      )}
    </nav>
  );
}