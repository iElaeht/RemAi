import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';
import { Geist, Geist_Mono } from 'next/font/google';
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
  return (
    <ClerkProvider
      localization={customEsES}
      appearance={{
        variables: { colorPrimary: '#3b82f6' },
        elements: {
          rootBox: "flex justify-center items-center w-full",
          card: "border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl bg-white dark:bg-neutral-900 w-full max-w-md",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-500 text-white font-bold",
          formFieldInput: "border-neutral-300 dark:border-neutral-700 focus:ring-blue-500",
          userButtonPopoverCard: "w-[90vw] max-w-[320px] mx-auto mt-2", 
          userButtonBox: "flex justify-center",
        }
      }}
    >
      <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 transition-colors duration-300">
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}