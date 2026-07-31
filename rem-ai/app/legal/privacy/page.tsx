import Navbar from "@/components/layout/Navbar";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Política de Privacidad | MangasRem",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar /> {/* Integración del Navbar */}
      <main className="max-w-3xl mx-auto py-16 px-6">
        <div className="space-y-10">
          <header className="border-b border-neutral-200 pb-8">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-950">Política de Privacidad</h1>
            <p className="text-neutral-500 mt-2">Última actualización: 10 de julio de 2026</p>
          </header>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">1. Información que recopilamos</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              En MangasRem, valoramos la transparencia. Recopilamos únicamente la información básica necesaria proporcionada al iniciar sesión, como su correo electrónico o nombre de usuario a través de nuestro proveedor de autenticación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">2. Uso de la información</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              Utilizamos estos datos exclusivamente para gestionar su cuenta en nuestro sistema, otorgándole acceso a contenido de manga obtenido a través de un proveedor externo (API). Nunca compartimos su información personal con terceros.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">3. Cookies y tecnologías</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              Utilizamos cookies de sesión para mantener su cuenta conectada de forma segura durante su navegación en nuestra plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">4. Seguridad y Derechos</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              Implementamos medidas técnicas para proteger sus datos personales. Usted tiene derecho a acceder, corregir o solicitar la eliminación de su cuenta y sus datos asociados en cualquier momento mediante comunicación directa.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-sky-600">5. Contacto</h2>
            <p className="leading-relaxed text-base text-neutral-700">
              Para cualquier consulta sobre nuestra política de privacidad, puede contactarnos a través de nuestro servidor de Discord oficial.
            </p>
          </section>

          <footer className="pt-12 border-t border-neutral-200 text-sm text-neutral-500">
            &copy; 2026 MangasRem. Todos los derechos reservados.
          </footer>
        </div>
      </main>
    </div>
  );
}