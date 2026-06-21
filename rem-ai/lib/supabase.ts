import { createClient } from '@supabase/supabase-js';

// 1. Validación estricta de variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
    "Asegúrate de configurarlas en tu archivo .env.local o en el dashboard de Vercel."
  );
}

/**
 * 2. Cliente para acciones que requieren autenticación (DELETE, UPDATE, INSERT)
 * Se inyecta el token de Clerk dinámicamente.
 * 
 * @param clerkToken - El token JWT obtenido de Clerk
 */
export const getSupabaseClient = (clerkToken: string) => {
  if (!clerkToken) {
    throw new Error("Se requiere un token de autenticación válido para realizar esta acción.");
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
};

/**
 * 3. Cliente para lecturas públicas.
 * ¡OJO! Úsalo EXCLUSIVAMENTE para SELECTs públicos.
 */
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);