'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/discover') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/discover');
    }
    setIsOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="relative z-50 w-full border-b border-blue-500/20 bg-gradient-to-r from-neutral-950 via-neutral-900 to-blue-950 px-6 md:px-12 lg:px-24 h-16 flex items-center justify-between transition-all">
      
      <div className="flex items-center">
        <button 
          onClick={handleLogoClick}
          className="text-2xl font-black tracking-tight text-white hover:opacity-80 transition-opacity focus:outline-none"
        >
          Rem<span className="text-sky-400">Ai</span>
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-10 text-base font-semibold h-full">
        <Link 
          href="/discover" 
          className={`relative h-full flex items-center transition-colors duration-200 ${isActive('/discover') ? 'text-sky-400' : 'text-neutral-400 hover:text-white'}`}
        >
          <span>Inicio</span>
          {isActive('/discover') && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-sky-400 rounded-t-full" />}
        </Link>
        
        <Link 
          href="/library" 
          className={`relative h-full flex items-center transition-colors duration-200 ${isActive('/library') ? 'text-sky-400' : 'text-neutral-400 hover:text-white'}`}
        >
          <span>Biblioteca</span>
          {isActive('/library') && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-sky-400 rounded-t-full" />}
        </Link>
        
        <Link 
          href="/support" 
          className={`relative h-full flex items-center transition-colors duration-200 ${isActive('/support') ? 'text-sky-400' : 'text-neutral-400 hover:text-white'}`}
        >
          <span>Soporte</span>
          {isActive('/support') && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-sky-400 rounded-t-full" />}
        </Link>
      </div>

      <div className="flex items-center space-x-4 min-h-10">
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "!h-12 !w-12 border-2 border-sky-500/30 rounded-full hover:scale-105 transition-transform",
              // La combinación de clases maneja el centrado móvil y la alineación desktop
              userButtonPopoverCard: [
                "border border-neutral-800 bg-neutral-950 text-white shadow-2xl",
                "!absolute !top-20 !left-4 !right-4 !mx-auto !w-auto !max-w-[320px]",
                "md:!absolute md:!top-14 md:!right-10 md:!left-auto md:!mx-0 md:!w-[250px]"
              ].join(" "),
              userButtonPopoverActionButton: "justify-center md:justify-start",
            }
          }}
        />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-50 relative"
          aria-label="Alternar menú"
        >
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ease-in-out ${isOpen ? '-translate-x-4 opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      <div className={`fixed inset-x-0 top-16 bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-blue-500/20 px-12 py-8 flex flex-col items-center justify-center space-y-2 md:hidden transition-all duration-300 ease-in-out shadow-2xl ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <Link href="/discover" onClick={() => setIsOpen(false)} className={`text-xl font-bold w-full text-center py-3 border-b border-neutral-800/60 active:scale-95 transition-all ${isActive('/discover') ? 'text-sky-400' : 'text-white'}`}>Inicio</Link>
        <Link href="/library" onClick={() => setIsOpen(false)} className={`text-xl font-bold w-full text-center py-3 border-b border-neutral-800/60 active:scale-95 transition-all ${isActive('/library') ? 'text-sky-400' : 'text-neutral-400 hover:text-white'}`}>Biblioteca</Link>
        <Link href="/support" onClick={() => setIsOpen(false)} className={`text-xl font-bold w-full text-center py-3 active:scale-95 transition-all ${isActive('/support') ? 'text-sky-400' : 'text-neutral-400 hover:text-white'}`}>Soporte</Link>
      </div>
    </nav>
  );
}