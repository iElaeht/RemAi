'use server';

import { auth } from '@clerk/nextjs/server';
import { getSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// --- Interfaces ---
interface CommentPayload {
  mangaId: string;
  content: string;
  username: string;
  avatarUrl: string;
  imageUrl?: string | null;
  parentId?: string | null;
  replyToUsername?: string | null;
}

interface UpdatePayload {
  commentId: string;
  content: string;
  mangaId: string;
}

// --- Acciones ---

export async function addCommentAction(payload: CommentPayload) {
  try {
    const { userId, getToken } = await auth();
    
    if (!userId) return { success: false, error: "Usuario no autenticado" };
    if (!payload.content.trim() && !payload.imageUrl) return { success: false, error: "El comentario está vacío" };

    const token = await getToken({ template: 'supabase' });
    const supabase = getSupabaseClient(token!);

    const { error } = await supabase
      .from('comments')
      .insert({
        user_id: userId,
        manga_id: payload.mangaId,
        content: payload.content,
        username: payload.username,
        avatar_url: payload.avatarUrl,
        image_url: payload.imageUrl || null,
        parent_id: payload.parentId || null,
        reply_to_username: payload.replyToUsername || null
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: "No se pudo publicar el comentario." };
    }

    revalidatePath(`/manga/${payload.mangaId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: "Error inesperado en el servidor." };
  }
}

export async function updateCommentAction(payload: UpdatePayload) {
  try {
    const { userId, getToken } = await auth();
    
    if (!userId) return { success: false, error: "Usuario no autenticado" };
    if (!payload.content.trim()) return { success: false, error: "El contenido no puede estar vacío" };

    const token = await getToken({ template: 'supabase' });
    const supabase = getSupabaseClient(token!);

    // Blindaje: Solo permitimos actualizar si el usuario es el dueño del comentario
    const { error } = await supabase
      .from('comments')
      .update({ content: payload.content })
      .eq('id', payload.commentId)
      .eq('user_id', userId); // Verificación de seguridad en el nivel de query

    if (error) {
      console.error("Supabase update error:", error);
      return { success: false, error: "No se pudo actualizar el comentario." };
    }

    revalidatePath(`/manga/${payload.mangaId}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: "Error inesperado al actualizar." };
  }
}