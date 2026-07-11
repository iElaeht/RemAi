import Navbar from "@/components/layout/Navbar";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="max-w-3xl mx-auto py-16 px-6">
        <header className="border-b border-neutral-200 pb-8 mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-950">Términos de Uso</h1>
          <p className="text-neutral-500 mt-2">Última actualización: 10 de julio de 2026</p>
        </header>

        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">1. Aceptación de los Términos</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              Al acceder y utilizar RemAi, usted acepta quedar vinculado por estos Términos de Uso. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que se abstenga de utilizar nuestra plataforma.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">2. Naturaleza del Servicio</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              RemAi es una herramienta de visualización que facilita el acceso a contenido de manga a través de APIs de terceros (como MangaDex). No alojamos, almacenamos ni somos propietarios del contenido protegido por derechos de autor que se visualiza a través de nuestra interfaz.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">3. Conducta del Usuario</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              Usted se compromete a utilizar la plataforma de manera ética y únicamente para fines personales y no comerciales. Queda estrictamente prohibido el uso de bots, herramientas de scraping masivo o cualquier intento de comprometer la seguridad de nuestros sistemas.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">4. Limitación de Responsabilidad</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              El servicio se proporciona tal cual. No garantizamos la disponibilidad permanente del contenido ni la ausencia de errores técnicos. RemAi no se hace responsable de interrupciones causadas por fallos en servicios de terceros o API externas.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">5. Propiedad Intelectual</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              Todo el diseño, código fuente, logotipos y la marca RemAi son propiedad exclusiva de su desarrollador. El uso de la plataforma no le otorga ningún derecho de propiedad intelectual sobre los activos de la misma.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">6. Modificaciones</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la plataforma tras la publicación de los cambios constituye la aceptación automática de los nuevos términos.
            </p>
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-neutral-200 text-sm text-neutral-500">
          &copy; 2026 RemAi. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
}