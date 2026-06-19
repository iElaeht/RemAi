import { Chapter } from '@/service/mangaService';

export interface VolumeGroup {
  volume: string;
  chapters: Chapter[];
  range: string;
  isComplete: boolean;
  count: number;
}

export function groupChaptersByVolume(chapters: Chapter[], lang: string): VolumeGroup[] {
  // 1. Filtramos normalizando el idioma para evitar discrepancias
  const filtered = chapters.filter((ch) => 
    ch.language?.toLowerCase().trim() === lang.toLowerCase().trim()
  );

  // 2. Agrupamos por volumen buscando en diferentes lugares de la estructura
  const grouped = filtered.reduce((acc: Record<string, Chapter[]>, ch: Chapter) => {
    // Intentamos extraer el volumen: raíz del objeto o dentro de attributes
    const chapterAny = ch as any;
    const volRaw = chapterAny.volume || chapterAny.attributes?.volume;
    
    const vol = (volRaw !== null && volRaw !== undefined && volRaw !== "") 
      ? String(volRaw) 
      : 'Sin Volumen';
    
    if (!acc[vol]) acc[vol] = [];
    acc[vol].push(ch);
    return acc;
  }, {} as Record<string, Chapter[]>);

  // 3. Transformamos en array, ordenando volúmenes y capítulos internos
  return Object.keys(grouped)
    .sort((a, b) => {
      if (a === 'Sin Volumen') return 1;
      if (b === 'Sin Volumen') return -1;
      return parseFloat(a) - parseFloat(b);
    })
    .map((vol) => {
      const vols = grouped[vol].sort((a, b) => 
        parseFloat(a.number || '0') - parseFloat(b.number || '0')
      );
      
      const first = vols[0].number;
      const last = vols[vols.length - 1].number;
      
      return {
        volume: vol,
        chapters: vols,
        range: first === last ? `Capítulo ${first}` : `Capítulos ${first} - ${last}`,
        isComplete: vols.length >= 8,
        count: vols.length
      };
    });
}