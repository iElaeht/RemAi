"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import Footer from "@/components/layout/Footer";
import { ArrowRight, BookOpen, Heart, Coffee, Users } from "lucide-react";

export default function HomePage() {
  const [isScrolled] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 overflow-x-hidden select-none">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-24 h-16 md:h-20 transition-all duration-300"
        animate={{
          backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.8)" : "rgba(0, 0, 0, 0)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        }}
      >
        <div className="text-24 md:text-3xl font-black text-white">
          Rem<span className="text-sky-400">Ai</span>
        </div>
        <Link
          href="/discover"
          className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs md:text-sm font-medium transition-all"
        >
          <BookOpen size={12} /> Explorar
        </Link>
      </motion.nav>

      {/* Hero Section */}
      <header className="relative h-[80vh] flex items-center px-6 md:px-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-black/20" />
        </div>

        <div className="relative z-10 space-y-6 max-w-2xl mt-16">
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter text-white leading-[0.9]">
            El arte de <br />
            <span className="text-neutral-500">contar.</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-md font-light leading-relaxed">
            Sumérgete en historias que definen generaciones. Un espacio dedicado a la pasión por el manga, diseñado para lectores que aprecian los detalles.
          </p>
        </div>
      </header>

      {/* Sección Filosofía - Sustituyendo la parte técnica */}
      <section className="py-24 px-6 md:px-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Más que páginas.</h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Cada manga es una ventana a un mundo distinto. En RemAi, nos enfocamos en respetar la visión del autor, permitiendo que el arte y la narrativa fluyan sin interrupciones. Creemos que una buena historia merece el mejor escenario posible para ser descubierta.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-center">
              <Coffee size={48} className="text-neutral-700" />
            </div>
            <div className="h-64 bg-neutral-900 rounded-2xl border border-neutral-800 mt-8 flex items-center justify-center">
              <Heart size={48} className="text-neutral-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de comunidad */}
      <section className="py-20 bg-neutral-900/20 border-y border-neutral-900">
        <div className="px-6 md:px-24 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <Users className="text-sky-400" size={48} />
            <div>
              <h3 className="text-2xl font-bold">Comunidad de lectores</h3>
              <p className="text-neutral-400">Únete a miles de personas compartiendo su pasión por las grandes historias.</p>
            </div>
          </div>
          <Link href="/discover" className="px-8 py-3 border border-neutral-700 hover:border-white transition-all rounded-full">
            Ver nuestra colección
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}