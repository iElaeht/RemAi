// services/mangaService.ts

// Definimos la estructura básica de lo que recibimos de nuestra propia API
export interface Chapter {
  id: string;
  number: string;
  language: string;
  volume: string | null | undefined;
}

export const fetchAllChapters = async (mangaId: string): Promise<Chapter[]> => {
  try {
    let allChapters: Chapter[] = [];
    let offset = 0;
    let total = 1;

    while (allChapters.length < total) {
      const res = await fetch(`/api/chapter?mangaId=${mangaId}&offset=${offset}`);
      if (!res.ok) throw new Error("Error en API");
      
      const result = await res.json();
      
      // BLINDAJE: Verificamos que result.data exista
      if (result && Array.isArray(result.data)) {
        allChapters = [...allChapters, ...result.data];
        total = result.total || 0;
        offset += 100;
      } else {
        break; // Salimos si no hay más datos
      }
    }
    
    // Eliminamos duplicados
    return Array.from(new Map(allChapters.map(item => [item.id, item])).values());
  } catch (error) {
    console.error("Rem AI - Error recuperando capítulos:", error);
    return []; // BLINDAJE: Retornamos array vacío para que no explote el frontend
  }
};