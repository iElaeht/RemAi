import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { esES } from '@clerk/localizations'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'RemAi',
  description: 'Plataforma de Lectura de Manga y Manhwa',
}

/**
 * Parche de localización en español para Clerk.
 * Incluye traducciones personalizadas para el flujo de validación de contraseñas.
 */
const customEsES = {
  ...esES,
  formFieldInputPlaceholder__signUpPassword: 'Crear una contraseña',
  
  unstable__errors: {
    ...esES.unstable__errors,
    form_password_not_strong_enough: 'Tu contraseña no es lo suficientemente segura.',
    
    zxcvbn: {
      notEnough: 'Tu contraseña no es lo suficientemente segura.',
      
      // Mensaje de éxito cuando la contraseña pasa los filtros de seguridad
      goodPassword: 'Tu contraseña cumple con todos los requisitos necesarios.',
      
      suggestions: {
        repeated: 'Evita repetir palabras y caracteres.',
        anotherWord: 'Añade más palabras que sean menos comunes.',
      },
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      localization={customEsES}
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: '#3b82f6',             // Azul celeste brillante
          colorBackground: '#0a0e17',          // Fondo oscuro profundo
          colorInput: '#020617',               // Fondo negro de los inputs
          colorInputForeground: '#ffffff',     // Texto blanco de los inputs
        },
        elements: {
          card: "border border-slate-800/60 shadow-2xl rounded-2xl",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide transition-all shadow-lg shadow-blue-500/20",
          socialButtonsBlockButton: "border border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition-colors",
          socialButtonsBlockButtonText: "font-medium text-slate-200",
          formFieldInput: "border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500",
        }
      }}
    >
      <html 
        lang="es" 
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        {/* 
          SOLUCIÓN: Forzamos la base del body con bg-neutral-950. 
          Si algún contenedor no llega al final de la pantalla, el fondo que quedará expuesto 
          será el negro profundo de nuestra paleta, eliminando los destellos claros por completo.
        */}
        <body 
          suppressHydrationWarning 
          className="min-h-full flex flex-col bg-neutral-950 text-neutral-50 selection:bg-blue-500/30"
        >
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}