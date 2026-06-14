'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Bookmark, Sparkles } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => { if (isOpen) setIsOpen(false); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="relative z-50 w-full border-b border-blue-500/20 bg-gradient-to-r from-neutral-950 via-neutral-900 to-blue-950 px-6 md:px-12 lg:px-24 h-16 flex items-center justify-between transition-all">
      
      {/* Logo */}
      <div className="flex items-center">
        <button onClick={() => router.push('/discover')} className="text-2xl font-black text-white hover:opacity-80 transition-opacity">
          Rem<span className="text-sky-400">Ai</span>
        </button>
      </div>

      {/* Menu Desktop */}
      <div className="hidden md:flex items-center space-x-10 text-base font-semibold h-full">
        {['Inicio', 'Biblioteca', 'Soporte'].map((item) => {
          const path = item === 'Inicio' ? '/discover' : `/${item.toLowerCase()}`;
          return (
            <Link key={item} href={path} className={`relative h-full flex items-center transition-colors ${isActive(path) ? 'text-sky-400' : 'text-neutral-400 hover:text-white'}`}>
              <span>{item}</span>
              {isActive(path) && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-sky-400 rounded-t-full" />}
            </Link>
          );
        })}
      </div>

      {/* Right Side: Colaborar, Favoritos y UserButton */}
      <div className="flex items-center space-x-6 min-h-10">
        <Link href="/colaborar" className="hidden md:flex items-center space-x-2 text-neutral-400 hover:text-sky-400 transition-colors">
          <Sparkles size={20} strokeWidth={1.5} />
          <span>Colaborar</span>
        </Link>
        <Link href="/favorites" className="hidden md:flex items-center space-x-2 text-neutral-400 hover:text-sky-400 transition-colors">
          <Bookmark size={20} strokeWidth={1.5} />
          <span>Favoritos</span>
        </Link>
        
        <UserButton appearance={{ elements: { avatarBox: "!h-12 !w-12 border-2 border-sky-500/30 rounded-full hover:scale-105 transition-transform" } }} />

        <button onClick={() => setIsOpen(!isOpen)} className="flex md:hidden flex-col justify-center items-center w-8 h-8 space-y-1.5 z-50">
          <span className={`block h-0.5 w-6 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu - Centrado */}
      <div className={`fixed inset-x-0 top-16 bg-neutral-950 border-b border-blue-500/20 py-8 flex flex-col items-center justify-center space-y-6 md:hidden transition-all shadow-2xl ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <Link href="/discover" onClick={() => setIsOpen(false)} className="text-xl font-bold text-white">Inicio</Link>
        <Link href="/library" onClick={() => setIsOpen(false)} className="text-xl font-bold text-white">Biblioteca</Link>
        <Link href="/colaborar" onClick={() => setIsOpen(false)} className="text-xl font-bold text-sky-400">Colaborar</Link>
        <Link href="/favorites" onClick={() => setIsOpen(false)} className="text-xl font-bold text-sky-400">Favoritos</Link>
      </div>
    </nav>
  );
}