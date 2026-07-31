"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, Heart, ChevronDown, BookOpen, Book, Compass, MessageSquareCode, Bookmark } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isMobileLibraryOpen, setIsMobileLibraryOpen] = useState(false);
  
  // Estado para el mensaje temporal en móvil cuando no está autenticado
  const [favoritesMobileMsg, setFavoritesMobileMsg] = useState(false);
  
  const { isSignedIn, isLoaded } = useUser();

  const isActive = (path: string) => pathname === path;

  // Detección de sección para aplicar colores dinámicos
  const isManhwa = pathname.startsWith("/manhwas");
  const isManga = pathname.startsWith("/mangas");
  const isDiscover = pathname.startsWith("/discover");

  // Configuración de temas para el Navbar
  const theme = isManhwa
    ? {
        navBg: "bg-[#170a0d]",
        border: "border-red-500/10",
        accentText: "text-red-500",
        hoverText: "hover:text-red-400",
        activeLink: "text-red-400 font-medium bg-red-500/10",
        dropdownBg: "bg-[#1f0c11]",
        signUpHover: "hover:bg-red-500/10 hover:border-red-500/30",
      }
    : isManga
    ? {
        navBg: "bg-[#140b15]",
        border: "border-pink-500/10",
        accentText: "text-pink-500",
        hoverText: "hover:text-pink-400",
        activeLink: "text-pink-400 font-medium bg-pink-500/10",
        dropdownBg: "bg-[#1d0f20]",
        signUpHover: "hover:bg-pink-500/10 hover:border-pink-500/30",
      }
    : isDiscover
    ? {
        navBg: "bg-[#100d1c]",
        border: "border-violet-500/10",
        accentText: "text-violet-400",
        hoverText: "hover:text-violet-300",
        activeLink: "text-violet-400 font-medium bg-violet-500/10",
        dropdownBg: "bg-[#18132d]",
        signUpHover: "hover:bg-violet-500/10 hover:border-violet-500/30",
      }
    : {
        navBg: "bg-[#0c101d]",
        border: "border-white/5",
        accentText: "text-sky-400",
        hoverText: "hover:text-neutral-300",
        activeLink: "text-sky-400 font-medium bg-white/5",
        dropdownBg: "bg-[#0c101d]",
        signUpHover: "hover:bg-sky-500/10 hover:border-sky-500/30",
      };

  // Icono dinámico para el botón Biblioteca según la sección activa
  const LibraryIcon = isActive("/mangas") ? BookOpen : isActive("/manhwas") ? Book : BookOpen;

  // Manejador para clics en Favoritos cuando no está logueado en móvil
  const handleMobileFavoritesClick = (e: React.MouseEvent) => {
    if (!isSignedIn) {
      e.preventDefault();
      setFavoritesMobileMsg(true);
      setTimeout(() => setFavoritesMobileMsg(false), 3500);
    } else {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`w-full border-b ${theme.border} ${theme.navBg} h-16 flex items-center justify-between px-6 md:px-12 static select-none z-50 transition-colors duration-300`}>
      {/* Lado Izquierdo */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => router.push("/")}
          className="text-xl font-bold tracking-tight text-white mr-2 cursor-pointer"
        >
          Mangas<span className={theme.accentText}>Rem</span>
        </button>

        <div className="h-5 w-[1px] bg-white/10" />

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/discover"
            className={`text-sm flex items-center gap-2 transition-all duration-200 px-3 py-1.5 rounded-lg ${isActive("/discover") ? theme.activeLink : `text-neutral-400 ${theme.hoverText}`}`}
          >
            <Compass size={15} />
            <span>Inicio</span>
          </Link>

          {/* Menú desplegable con Hover para Desktop */}
          <div 
            className="relative py-5"
            onMouseEnter={() => setIsLibraryOpen(true)}
            onMouseLeave={() => setIsLibraryOpen(false)}
          >
            <div className={`flex items-center gap-2 text-sm cursor-pointer transition-all duration-200 px-3 py-1.5 rounded-lg ${pathname.includes("/mangas") || pathname.includes("/manhwas") ? theme.activeLink : `text-neutral-400 ${theme.hoverText}`}`}>
              <LibraryIcon size={15} />
              <span>Biblioteca</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isLibraryOpen ? "rotate-180" : ""}`} />
            </div>

            {isLibraryOpen && (
              <div className={`absolute top-14 left-0 w-48 ${theme.dropdownBg} border ${theme.border} rounded-xl shadow-2xl py-2 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200`}>
                <Link
                  href="/mangas"
                  onClick={() => setIsLibraryOpen(false)}
                  className={`px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${isActive("/mangas") ? "text-pink-400 font-medium bg-pink-500/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
                >
                  <BookOpen size={15} className="text-pink-400" />
                  <span>Mangas</span>
                </Link>
                <Link
                  href="/manhwas"
                  onClick={() => setIsLibraryOpen(false)}
                  className={`px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${isActive("/manhwas") ? "text-red-400 font-medium bg-red-500/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
                >
                  <Book size={15} className="text-red-400" />
                  <span>Manhwas</span>
                </Link>
              </div>
            )}
          </div>

          {/* Enlace de Favoritos (Inteligente para Desktop: deshabilitado si no hay sesión con tooltip hacia abajo) */}
          {isSignedIn ? (
            <Link
              href="/favorites"
              className={`text-sm flex items-center gap-2 transition-all duration-200 px-3 py-1.5 rounded-lg ${isActive("/favorites") ? theme.activeLink : `text-neutral-400 ${theme.hoverText}`}`}
            >
              <Bookmark size={15} />
              <span>Favoritos</span>
            </Link>
          ) : (
            <div className="relative group/fav">
              <span className="text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-600 cursor-not-allowed select-none">
                <Bookmark size={15} />
                <span>Favoritos</span>
              </span>
              <div className="absolute left-0 top-full mt-2 hidden group-hover/fav:flex px-3 py-1.5 bg-neutral-900 border border-white/10 text-neutral-300 text-xs rounded-md shadow-xl whitespace-nowrap z-50">
                Inicia sesión para ver tus favoritos
              </div>
            </div>
          )}

          <Link
            href="/feedback"
            className={`text-sm flex items-center gap-2 transition-all duration-200 px-3 py-1.5 rounded-lg ${isActive("/feedback") ? theme.activeLink : `text-neutral-400 ${theme.hoverText}`}`}
          >
            <MessageSquareCode size={15} />
            <span>Reportes</span>
          </Link>
        </div>
      </div>

      {/* Lado Derecho */}
      <div className="hidden md:flex items-center gap-4">
        <a 
          href="https://ko-fi.com/tu-usuario" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-pink-400 transition-colors mr-2"
        >
          <Heart size={16} />
          <span>Apóyanos</span>
        </a>

        <div className="h-5 w-[1px] bg-white/10" />
        
        {isLoaded &&
          (isSignedIn ? (
            <div className="flex items-center gap-2 bg-white/3 px-3 py-1.5 rounded-full border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <UserButton appearance={{ elements: { avatarBox: "!h-9 !w-9" } }} />
              <span className="text-xs font-medium text-white select-none">Mi Perfil</span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm text-neutral-400 hover:text-white transition-colors">Ingresar</Link>
              <div className="h-5 w-[1px] bg-white/10" />
              <Link href="/sign-up" className={`text-sm px-5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white ${theme.signUpHover} transition-all font-medium`}>Unirse</Link>
            </div>
          ))}
      </div>

      {/* Hamburguesa (Móvil) */}
      <button className="md:hidden text-neutral-400 p-1 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Menú Mobile Mejorado */}
      {isMenuOpen && (
        <div className={`absolute top-16 left-0 w-full ${theme.navBg} border-b ${theme.border} px-6 py-6 flex flex-col gap-5 md:hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200`}>
          <Link
            href="/discover"
            onClick={() => setIsMenuOpen(false)}
            className={`text-base font-medium flex items-center gap-3 py-1 ${isActive("/discover") ? theme.accentText : "text-neutral-400"}`}
          >
            <Compass size={18} />
            <span>Inicio</span>
          </Link>
          
          <div className="flex flex-col">
            <button
              onClick={() => setIsMobileLibraryOpen(!isMobileLibraryOpen)}
              className="flex items-center justify-between text-base font-medium text-neutral-400 hover:text-white py-1 w-full text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LibraryIcon size={18} className={theme.accentText} />
                <span>Biblioteca</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isMobileLibraryOpen ? `rotate-180 ${theme.accentText}` : ""}`} />
            </button>

            {isMobileLibraryOpen && (
              <div className="flex flex-col gap-3 pl-7 pt-3 pb-2 my-2 border-l border-white/10 bg-white/[0.02] rounded-r-xl">
                <Link
                  href="/mangas"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsMobileLibraryOpen(false);
                  }}
                  className={`text-sm flex items-center gap-2.5 py-1 transition-colors ${isActive("/mangas") ? "text-pink-400 font-bold" : "text-neutral-400 hover:text-white"}`}
                >
                  <BookOpen size={15} />
                  <span>Mangas</span>
                </Link>
                <Link
                  href="/manhwas"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsMobileLibraryOpen(false);
                  }}
                  className={`text-sm flex items-center gap-2.5 py-1 transition-colors ${isActive("/manhwas") ? "text-red-400 font-bold" : "text-neutral-400 hover:text-white"}`}
                >
                  <Book size={15} />
                  <span>Manhwas</span>
                </Link>
              </div>
            )}
          </div>

          {/* Enlace de Favoritos en Móvil (Inteligente: muestra mensaje abajo) */}
          <div className="flex flex-col gap-1.5">
            <Link
              href={isSignedIn ? "/favorites" : "#"}
              onClick={handleMobileFavoritesClick}
              className={`text-base font-medium flex items-center gap-3 py-1 ${
                !isSignedIn 
                  ? "text-neutral-600 cursor-not-allowed" 
                  : isActive("/favorites") 
                  ? theme.accentText 
                  : "text-neutral-400"
              }`}
            >
              <Bookmark size={18} />
              <span>Favoritos</span>
            </Link>
            {favoritesMobileMsg && (
              <span className="text-xs text-amber-400/90 pl-7 animate-in fade-in duration-300">
                Inicia sesión para ver tus favoritos
              </span>
            )}
          </div>

          <Link
            href="/feedback"
            onClick={() => setIsMenuOpen(false)}
            className={`text-base font-medium flex items-center gap-3 py-1 ${isActive("/feedback") ? theme.accentText : "text-neutral-400"}`}
          >
            <MessageSquareCode size={18} />
            <span>Reportes</span>
          </Link>
          
          <a 
            href="https://ko-fi.com/tu-usuario" 
            target="_blank" 
            className="text-base text-pink-400 font-medium flex items-center gap-3 py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            <Heart size={18} />
            <span>Apoyar en Ko-fi</span>
          </a>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
            {isLoaded && (isSignedIn ? (
              <div className="flex items-center gap-3 text-white py-1">
                <UserButton appearance={{ elements: { avatarBox: "!h-9 !w-9" } }} />
                <span className="text-sm font-medium">Mi Cuenta</span>
              </div>
            ) : (
              <div className="flex items-center gap-4 pt-1">
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)} className="text-sm text-neutral-400 hover:text-white">Ingresar</Link>
                <div className="h-4 w-[1px] bg-white/10" />
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)} className="text-sm px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-medium">Unirse</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}