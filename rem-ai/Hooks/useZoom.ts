// hooks/useZoom.ts
import { useState, useEffect } from 'react';

export const useZoom = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [offset, setOffset] = useState({ x: 50, y: 50 });
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Bloqueo de rueda del mouse cuando está con zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => { if (isZoomed) e.preventDefault(); };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isZoomed]);

const handleInteraction = (clientX: number, clientY: number, element: HTMLElement) => {
  if (!isZoomed || isTouch) return;
  const { left, top, width, height } = element.getBoundingClientRect();
  // Limitamos entre 0 y 100 para que no se "salga" del marco
  const x = Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
  const y = Math.max(0, Math.min(100, ((clientY - top) / height) * 100));
  setOffset({ x, y });
};

  const resetZoom = () => {
    setIsZoomed(false);
    setOffset({ x: 50, y: 50 });
  };

  return {
    isZoomed,
    setIsZoomed,
    offset,
    isTouch,
    handleInteraction,
    resetZoom
  };
};