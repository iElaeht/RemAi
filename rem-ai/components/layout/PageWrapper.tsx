import BackButton from "../ui/BackButton";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0f1d] px-4 py-8 md:py-16">
      {/* Usamos un max-width un poco mayor si la biblioteca lo requiere */}
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex justify-start">
          <BackButton />
        </div>
        {children}
      </div>
    </div>
  );
}