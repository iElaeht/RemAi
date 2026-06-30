"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { name: "Inicio", path: "/discover" },
    { name: "Biblioteca", path: "/library" },
  ];

  return (
    <nav className="w-full border-b border-white/5 bg-[#0c101d] h-16 flex items-center justify-between px-6 md:px-12 static select-none">
      {/* Lado Izquierdo */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => router.push("/")}
          className="text-xl font-bold tracking-tight text-white mr-2 cursor-pointer"
        >
          Mangas<span className="text-sky-400">Rem</span>
        </button>

        {/* Divisor vertical moderno */}
        <div className="h-5 w-[1px] bg-white/10" />

        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`text-sm transition-all duration-200 ${isActive(item.path) ? "text-white font-medium" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Lado Derecho */}
      <div className="hidden md:flex items-center gap-4">
        <div className="h-5 w-[1px] bg-white/10" />
        {isLoaded &&
          (isSignedIn ? (
            // Contenedor que agrupa el perfil
            <div className="flex items-center gap-2 bg-white/3 px-3 py-1.5 rounded-full border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "!h-9 !w-9",
                  },
                }}
              />
              <span className="text-xs font-medium text-white select-none">
                Mi Perfil
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-sm text-neutral-500 hover:text-white transition-colors"
              >
                Ingresar
              </Link>

              <div className="h-5 w-[1px] bg-white/10" />

              <Link
                href="/sign-up"
                className="text-sm px-5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-sky-500/10 hover:border-sky-500/30 transition-all font-medium"
              >
                Unirse
              </Link>
            </div>
          ))}
      </div>

      {/* Hamburguesa */}
      <button
        className="md:hidden text-neutral-400"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Menú Mobile */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#0c101d] border-b border-white/5 p-6 flex flex-col gap-6 md:hidden z-50">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-base ${isActive(item.path) ? "text-white font-bold" : "text-neutral-500"}`}
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
            {isLoaded &&
              (isSignedIn ? (
                <div className="flex items-center gap-3 text-white">
                  <UserButton
                    appearance={{ elements: { avatarBox: "!h-9 !w-9" } }}
                  />
                  <span className="text-sm font-medium">Mi Cuenta</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-neutral-400"
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sky-400 font-bold"
                  >
                    Unirse
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}
