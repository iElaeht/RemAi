'use client';

import { Suspense } from 'react';
import LibraryContent from './LibraryContent';

export default function LibraryPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#0a0f1d] text-white">
        Cargando biblioteca...
      </div>
    }>
      <LibraryContent />
    </Suspense>
  );
}