import { getProxiedImageUrl } from './image';

export default function mangadexLoader({ src }: { src: string }) {
  return getProxiedImageUrl(src);
}