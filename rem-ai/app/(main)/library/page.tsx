// rem-ai/app/(main)/library/page.tsx
'use client';

import { Suspense } from 'react';
import LibraryContent from './LibraryContent';
import PageWrapper from '@/components/layout/PageWrapper';

export default function LibraryPage() {
  return (
    <PageWrapper>
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#0a0f1d] text-white">
        Cargando biblioteca...
      </div>
    }>
      <LibraryContent />
    </Suspense>
     </PageWrapper>
  );
}