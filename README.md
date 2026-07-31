# 🌸 MangasRem

> Un sitio web moderno y elegante para lectores apasionados por el manga y manhwa, diseñado con un enfoque minimalista, transiciones fluidas y una experiencia de usuario prémium.

---

## 🚀 Características Principales

* **Interfaz Moderna y Minimalista:** Estética oscura optimizada (`#0b1120` y tonos `neutral-950`) con acentos celestes distintivos.
* **Experiencia de Carga Optimizada:** Implementación de *skeleton loaders* personalizados en secciones clave (como Favoritos) y transiciones fluidas en la página principal (`HomePage`).
* **Autenticación Segura:** Integración completa con **Clerk** para la gestión de usuarios y control de acceso a colecciones personales.
* **Gestión de Favoritos:** Sistema interactivo para guardar, administrar y explorar títulos preferidos.
* **Navegación Dinámica:** Navbar inteligente con efecto de desenfoque (`blur`) al hacer scroll y barra de exploración optimizada.
* **Diseño Totalmente Responsivo:** Adaptado de manera fluida para dispositivos móviles, tablets y pantallas de escritorio.
---

## 🛠️ Tecnologías y Stack

Este proyecto ha sido desarrollado utilizando las tecnologías web más modernas:

* **Framework:** [Next.js](https://nextjs.org/) (App Router & Server Actions)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
* **Autenticación:** [Clerk](https://clerk.com/)
* **Iconos:** [Lucide React](https://lucide.dev/)

---

## 📦 Instalación y Configuración Local

Sigue estos pasos para clonar y ejecutar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
* **git clone:** https://github.com/iElaeht/RemAi.git
* **cd:** RemAi/rem-ai
2. **Instalar las dependencias:**
* **npm install**

## 📂 Estructura del Proyecto

La arquitectura del proyecto está organizada de la siguiente manera dentro de la carpeta `rem-ai`:

```text
rem-ai/
├── actions/        # Server actions para consultas y mutaciones (Favoritos, etc.)
├── app/            # Rutas y páginas de Next.js (App Router: discover, favorites, etc.)
├── components/     # Componentes reutilizables (UI, layout como Navbar y Footer)
├── context/        # Contextos globales de la aplicación
├── data/           # Datos estáticos o configuraciones iniciales
├── Hooks/          # Custom hooks de React
├── lib/            # Configuración de librerías externas (ej. cliente de base de datos)
├── public/         # Archivos estáticos e imágenes
└── types/          # Definiciones de tipos e interfaces en TypeScript
```

---

## 🔐 Variables de Entorno

Crea un archivo llamado `.env.local` dentro de la carpeta `rem-ai` y añade lo siguiente:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clave_publica_de_clerk
CLERK_SECRET_KEY=tu_clave_secreta_de_clerk
```
---

## ☁️ Despliegue

1. Importa tu repositorio de GitHub (`iElaeht/RemAi`) en Vercel.
2. Configura el **Root Directory** seleccionando la carpeta `rem-ai`.
3. Añade tus variables de entorno en el panel de Vercel.
4. ¡Haz deploy y listo!

---

## 👤 Autor

Desarrollado con pasión por **[iElaeht]** (https://github.com/iElaeht).