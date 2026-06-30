// rem-ai/app/(main)/library/[tagId]/[slug]/page.tsx
"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import LibraryContent from "../../LibraryContent";
import PageWrapper from "@/components/layout/PageWrapper";

export default function TaggedLibraryPage() {
  const params = useParams();
  const tagId = params.tagId as string;

  return (
    <PageWrapper>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen bg-[#0a0f1d] text-white">
            Cargando filtro...
          </div>
        }
      >
        <LibraryContent initialTagId={tagId} />
      </Suspense>
    </PageWrapper>
  );
}
