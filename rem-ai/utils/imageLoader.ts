// utils/imageLoader.ts
import { getImageUrl } from './image';

export default function mangadexLoader({ src }: { src: string }) {
  return getImageUrl(src);
}