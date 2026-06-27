import { Chapter } from '@/service/mangaService';

export interface VolumeGroup {
  volume: string;
  chapters: Chapter[];
  range: string;
  isComplete: boolean;
  count: number;
}

/**
 * Blindado y optimizado para evitar errores de tipo en tiempo de ejecución.
 */
export function groupChaptersByVolume(chapters: Chapter[], lang: string): VolumeGroup[] {
  // BLINDAJE: Si no hay capítulos o no es un array, devolvemos array vacío inmediatamente
  if (!chapters || !Array.isArray(chapters)) {
    return [];
  }

  // 1. Filtramos normalizando el idioma con seguridad ante nulos
  const langNormalized = (lang || 'es').toLowerCase().trim();
  const filtered = chapters.filter((ch) => 
    ch?.language?.toLowerCase().trim() === langNormalized
  );

  // 2. Agrupamos por volumen
  const grouped = filtered.reduce((acc: Record<string, Chapter[]>, ch: Chapter) => {
    // Usamos el tipado para acceder a 'volume' de forma segura
    const volRaw = (ch as any).volume || (ch as any).attributes?.volume;
    
    const vol = (volRaw !== null && volRaw !== undefined && volRaw !== "") 
      ? String(volRaw) 
      : 'Sin Volumen';
    
    if (!acc[vol]) acc[vol] = [];
    acc[vol].push(ch);
    return acc;
  }, {} as Record<string, Chapter[]>);

  // 3. Transformamos en array y ordenamos
  return Object.keys(grouped)
    .sort((a, b) => {
      if (a === 'Sin Volumen') return 1;
      if (b === 'Sin Volumen') return -1;
      return parseFloat(a) - parseFloat(b);
    })
    .map((vol) => {
      // Ordenar los capítulos internos por número
      const vols = grouped[vol].sort((a, b) => 
        parseFloat(a.number || '0') - parseFloat(b.number || '0')
      );
      
      const first = vols[0]?.number || '?';
      const last = vols[vols.length - 1]?.number || '?';
      
      return {
        volume: vol,
        chapters: vols,
        range: first === last ? `Capítulo ${first}` : `Capítulos ${first} - ${last}`,
        isComplete: vols.length >= 8,
        count: vols.length
      };
    });
}