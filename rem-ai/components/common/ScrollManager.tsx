'use client';
import { useEffect } from 'react';

export default function ScrollManager() {
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const body = document.body;

    const showScroll = () => {
      body.classList.remove('hide-scroll');
      clearTimeout(timeout);
      
      // Ocultar tras 1.5s de inactividad
      timeout = setTimeout(() => {
        body.classList.add('hide-scroll');
      }, 1500);
    };

    // Detectamos scroll Y movimiento de mouse
    window.addEventListener('scroll', showScroll);
    window.addEventListener('mousemove', showScroll);

    // Estado inicial
    body.classList.add('hide-scroll');

    return () => {
      window.removeEventListener('scroll', showScroll);
      window.removeEventListener('mousemove', showScroll);
      clearTimeout(timeout);
      body.classList.remove('hide-scroll');
    };
  }, []);

  return null;
}