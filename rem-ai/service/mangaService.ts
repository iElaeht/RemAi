// services/mangaService.ts

// Definimos la estructura básica de lo que recibimos de nuestra propia API
export interface Chapter {
  id: string;
  number: string;
  language: string;
  volume: string | null | undefined;
}

export const fetchAllChapters = async (mangaId: string): Promise<Chapter[]> => {
  let allChapters: Chapter[] = [];
  let offset = 0;
  let total = 1;

  // Lógica recursiva: pedimos bloques de 100 hasta completar el 'total'
  while (allChapters.length < total) {
    const res = await fetch(`/api/chapter?mangaId=${mangaId}&offset=${offset}`);
    const result = await res.json();
    
    if (result?.data) {
      allChapters = [...allChapters, ...result.data];
      total = result.total; // Aquí MangaDex nos dice el total real
      offset += 100;
    } else {
      break;
    }
  }
  
  // Limpiamos duplicados (importante por si MangaDex envía páginas traslapadas)
  return Array.from(new Map(allChapters.map(item => [item.id, item])).values());
};