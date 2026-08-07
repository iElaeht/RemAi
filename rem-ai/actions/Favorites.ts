// actions/Favorites.ts
"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface ToggleFavoriteParams {
  mangaId: string;
  title: string;
  coverImage: string;
  type: "manga" | "manhwa";
}

// Función auxiliar para obtener el cliente administrador de Supabase
function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    throw new Error("Faltan variables de entorno críticas de Supabase en el servidor.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

export async function toggleFavorite({ mangaId, title, coverImage, type }: ToggleFavoriteParams) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Verificar si ya existe en favoritos usando admin (evita bloqueos RLS)
  const { data: existing, error: selectError } = await supabaseAdmin
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("manga_id", mangaId)
    .maybeSingle();

  if (selectError) {
    console.error("Error al buscar favorito existente:", selectError.message);
  }

  if (existing) {
    const { error: deleteError } = await supabaseAdmin
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("manga_id", mangaId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    revalidatePath("/favorites");
    return { status: "removed" };
  } else {
    const { error: insertError } = await supabaseAdmin
      .from("favorites")
      .insert([{ user_id: userId, manga_id: mangaId, title, cover_image: coverImage, type }]);

    if (insertError) {
      throw new Error(insertError.message);
    }

    revalidatePath("/favorites");
    return { status: "added" };
  }
}

export async function getUserFavorites(userId: string) {
  if (!userId) return [];

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener favoritos:", error.message);
    return [];
  }

  return data || [];
}

export async function checkIsFavorite(userId: string, mangaId: string) {
  if (!userId || !mangaId) return false;

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("manga_id", mangaId)
    .maybeSingle();

  if (error) {
    console.error("Error en checkIsFavorite:", error.message);
    return false;
  }
  
  return !!data;
}

// NUEVA FUNCIÓN PARA ELIMINAR DIRECTAMENTE DESDE LA VISTA DE FAVORITOS
export async function removeFavorite(favoriteId: string | number) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { error } = await supabaseAdmin
    .from("favorites")
    .delete()
    .eq("id", favoriteId)
    .eq("user_id", userId); // Seguridad extra para que el usuario solo borre lo suyo

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/favorites");
  return { success: true };
}