'use client';

import { useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import Navbar from "@/components/layout/Navbar";
import { getSupabaseClient } from '@/lib/supabase';
import { useEffect } from "react";

export default function FeedbackPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  
  const [type, setType] = useState('Reporte');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Centro de Ayuda | MangasRem";
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) throw new Error("No se pudo obtener el token de autenticación");

      const supabase = getSupabaseClient(token);

      const { error } = await supabase.from('feedback').insert([
        {
          user_id: user.id,
          type,
          subject,
          description,
        }
      ]);

      if (error) throw error;

      setSuccess(true);
      setSubject('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      {/* Contenedor responsivo ajustado para móviles y tablets */}
      <main className="w-full max-w-2xl mx-auto py-10 sm:py-16 px-6 sm:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Centro de Ayuda</h1>
          <p className="text-neutral-500 mt-2">
            ¿Tienes alguna sugerencia o encontraste un error? Cuéntanoslo aquí.
          </p>
        </header>

        {!isSignedIn ? (
          <div className="border border-neutral-200 p-6 sm:p-8 rounded-lg text-center bg-neutral-50">
            <h2 className="text-xl font-bold mb-2">Acceso restringido</h2>
            <p className="text-neutral-600">Para enviar un reporte o sugerencia, debes iniciar sesión en RemAi.</p>
          </div>
        ) : success ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 sm:p-8 rounded-lg text-center">
            <h2 className="text-xl font-bold text-emerald-800 mb-2">¡Gracias por tu aporte!</h2>
            {/* Mensaje dinámico */}
            <p className="text-emerald-600">Hemos recibido tu {type.toLowerCase()} correctamente. Tu {type.toLowerCase()} nos ayuda a mejorar.</p>
            <button 
              onClick={() => setSuccess(false)} 
              className="mt-6 text-sky-600 font-bold hover:underline"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">
                Tipo de mensaje
              </label>
              <select 
                className="w-full p-3 border border-neutral-300 rounded-md bg-white focus:ring-2 focus:ring-sky-600 outline-none transition-all"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Reporte</option>
                <option>Sugerencia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">
                Asunto
              </label>
              <input 
                type="text" 
                className="w-full p-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-sky-600 outline-none transition-all" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={type === 'Reporte' ? 'Ej. El manga no carga...' : 'Ej. Agregar género H...'}
                required 
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500 mb-2">
                Descripción
              </label>
              <textarea 
                className="w-full p-3 border border-neutral-300 rounded-md h-32 focus:ring-2 focus:ring-sky-600 outline-none transition-all" 
                placeholder={type === 'Reporte' ? 'Describe detalladamente el error...' : 'Cuéntanos tu idea para mejorar...'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-neutral-950 text-white px-6 py-3 rounded-md font-bold hover:bg-neutral-800 transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Enviando...' : `Enviar ${type}`}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}