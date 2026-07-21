import * as deepl from 'deepl-node';
import { createClient } from '@supabase/supabase-js';
import { supabasePublic } from '@/lib/supabase';

const translator = new deepl.Translator(process.env.DEEPL_API_KEY!);

export async function getTranslatedDescription(mangaId: string, originalText: string): Promise<string> {
  if (!originalText) return "";

  console.log("¡INSERTANDO EN SUPABASE!");
  console.trace();
  // 1. Intentar buscar en Supabase usando el cliente público (SELECT)
  const { data } = await supabasePublic
    .from('manga_translations')
    .select('description_es')
    .eq('manga_id', mangaId)
    .single();

  if (data && data.description_es) {
    console.log(`[CACHE HIT] Descripción encontrada en la base de datos para: ${mangaId}`);
    return data.description_es;
  }

  // 2. Si no existe, traducir con DeepL
  console.log(`[CACHE MISS] Traduciendo con DeepL el manga: ${mangaId}...`);
  const result = await translator.translateText(originalText, null, 'es');
  const translatedText = result.text;

  // 3. Guardar en Supabase usando upsert para evitar duplicados por concurrencia
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    const adminSupabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { error: insertError } = await adminSupabase
      .from('manga_translations')
      .upsert(
        [
          { manga_id: mangaId, description_es: translatedText }
        ],
        { onConflict: 'manga_id' }
      );

    if (insertError) {
      console.error("[DB ERROR] No se pudo guardar la traducción en la base de datos:", insertError.message);
    } else {
      console.log(`[DB SUCCESS] Guardado/Actualizado exitosamente en la base de datos.`);
    }
  } else {
    console.error("[CONFIG ERROR] Faltan las credenciales de Supabase en el servidor.");
  }

  return translatedText;
}