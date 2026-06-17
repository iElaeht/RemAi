import { getSupabaseClient, supabase } from "./supabase";

// 1. CONSULTAS PÚBLICAS (No necesitan token)
export const getMangas = async () => {
  return await supabase.from('mangas').select('*');
};

// 2. CONSULTAS AUTENTICADAS (Necesitan token)
// Aquí llamamos a la función que nos diste
export const getBookmarks = async (clerkToken: string) => {
  const client = getSupabaseClient(clerkToken);
  return await client.from('bookmarks').select('*, mangas(*)');
};

export const addBookmark = async (clerkToken: string, mangaId: string, userId: string) => {
  const client = getSupabaseClient(clerkToken);
  return await client.from('bookmarks').insert({ 
    manga_id: mangaId, 
    user_id: userId 
  });
};