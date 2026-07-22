// rem-ai/app/(main)/manhwas/page.tsx
"use client";

import { Suspense } from "react";
import ManhwasContent from "./ManhwasContent";

export default function ManhwasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#0a0f1d] text-white">
          Cargando manhwas...
        </div>
      }
    >
      <ManhwasContent />
    </Suspense>
  );
}
