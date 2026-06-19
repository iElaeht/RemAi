'use client';

import { useEffect } from 'react';

const SecurityGuard = ({ children, isEnabled }: { children: React.ReactNode, isEnabled: boolean }) => {
  useEffect(() => {
    if (!isEnabled) return;

    // Solo bloqueamos los atajos de teclado para abrir DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || 
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Eliminamos el event listener del contextmenu para que el click derecho funcione normal
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEnabled]);

  return <>{children}</>;
};

export default SecurityGuard;