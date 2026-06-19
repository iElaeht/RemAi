import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';
import { Geist, Geist_Mono } from 'next/font/google';
import SecurityGuard from '@/components/common/SecurityGuard';
import ScrollManager from '@/components/common/ScrollManager';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rem Ai',
  description: 'Plataforma de Lectura de Manga',
};

const customEsES = {
  ...esES,
  formFieldInputPlaceholder__signUpPassword: 'Crear una contraseña',
  unstable__errors: {
    ...esES.unstable__errors,
    form_password_not_strong_enough: 'Tu contraseña no es lo suficientemente segura.',
    zxcvbn: {
      notEnough: 'Tu contraseña no es lo suficientemente segura.',
      goodPassword: 'Tu contraseña cumple con todos los requisitos necesarios.',
      suggestions: {
        repeated: 'Evita repetir palabras y caracteres.',
        anotherWord: 'Añade más palabras que sean menos comunes.',
      },
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isSecurityEnabled = process.env.NEXT_PUBLIC_SECURITY_ENABLED === 'true';

  return (
    <ClerkProvider
      localization={customEsES}
      appearance={{
        variables: { colorPrimary: '#3b82f6' },
        elements: {
          rootBox: "flex justify-center items-center w-full",
          // Ajustado para armonizar con el fondo azul medianoche
          card: "border border-neutral-800 shadow-2xl rounded-2xl bg-[#1e293b] w-full max-w-md text-white",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-500 text-white font-bold",
          formFieldInput: "border-neutral-700 bg-neutral-900 focus:ring-blue-500 text-white",
          userButtonPopoverCard: "w-[90vw] max-w-[320px] mx-auto mt-2", 
          userButtonBox: "flex justify-center",
        }
      }}
    >
      <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col bg-[#0b1120] text-[#f1f5f9]">
          <SecurityGuard isEnabled={isSecurityEnabled}>
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
          </SecurityGuard>
          {/* El ScrollManager gestionará el efecto desde el cliente */}
          <ScrollManager />
        </body>
      </html>
    </ClerkProvider>
  );
}