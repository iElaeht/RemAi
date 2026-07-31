// rem-ai/app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { mangaId, title, coverImage, type } = body;

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json({ error: "Faltan variables de entorno en el servidor" }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // 1. Verificar estrictamente si ya existe en la base de datos para este usuario
    const { data: existing, error: selectError } = await supabaseAdmin
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("manga_id", mangaId)
      .maybeSingle();

    if (selectError) {
      throw new Error(selectError.message);
    }

    // 2. Si ya existe, lo eliminamos (Toggle: Quitar)
    if (existing) {
      const { error: deleteError } = await supabaseAdmin
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("manga_id", mangaId);

      if (deleteError) throw new Error(deleteError.message);
      return NextResponse.json({ status: "removed" });
    } 
    
    // 3. Si NO existe, lo insertamos (Toggle: Añadir)
    else {
      const { error: insertError } = await supabaseAdmin
        .from("favorites")
        .insert([{ user_id: userId, manga_id: mangaId, title, cover_image: coverImage, type }]);

      if (insertError) throw new Error(insertError.message);
      return NextResponse.json({ status: "added" });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en API /api/favorites:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}