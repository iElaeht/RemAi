import { TAG_DICTIONARY } from "@/data/tagDictionary";

// Definimos la versión unificada y mejorada de normalize
export const normalize = (str: string): string => {
  return str.replace(/[\s-']/g, '').toLowerCase(); 
};

export const getTagIdByName = (name: string): string | undefined => {
  if (!name) return undefined;
  const normalizedInput = normalize(name);
  const key = Object.keys(TAG_DICTIONARY).find(
    (k) => normalize(k) === normalizedInput
  );
  return key ? TAG_DICTIONARY[key] : undefined;
};

export const getTagNameById = (id: string): string | undefined => {
  if (!id) return undefined;
  return Object.keys(TAG_DICTIONARY).find((key) => TAG_DICTIONARY[key] === id);
};

export const tagToSlug = (tagName: string): string => {
  return tagName
    .replace(/'/g, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
};

export const slugToTagName = (slug: string): string => {
  return slug.split('-').join('');
};

export const getAllTags = () => TAG_DICTIONARY;