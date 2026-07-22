// rem-ai/app/(main)/manhwas/[tagId]/[slug]/page.tsx
"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import ManhwasContent from "../../ManhwasContent";

export default function TaggedManhwasPage() {
  const params = useParams();
  const tagId = params.tagId as string;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#0a0f1d] text-white">
          Cargando filtro...
        </div>
      }
    >
      <ManhwasContent initialTagId={tagId} />
    </Suspense>
  );
}
