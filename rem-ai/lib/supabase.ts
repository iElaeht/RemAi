import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Esta función es la que usarás para hacer peticiones autenticadas
export const getSupabaseClient = (clerkToken: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
};

// Mantén esta versión "sin auth" solo para lecturas públicas (ej: listar mangas iniciales)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);