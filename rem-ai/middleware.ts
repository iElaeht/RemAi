import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Definimos explícitamente qué rutas se pueden ver SIN iniciar sesión
const isPublicRoute = createRouteMatcher([
  "/",
  "/discover",
  "/sign-in",
  "/sign-up",
  "/mangas",
  "/mangas/(.*)",
  "/manhwas",
  "/manhwas/(.*)",
  // Nuevas rutas de detalles estructuradas
  "/details/manga/(.*)",
  "/details/manhwa/(.*)",
  // Por compatibilidad temporal o si aún queda alguna referencia vieja:
  "/manga/(.*)",
  "/leer/(.*)",
  "/api/(.*)",
  "/legal/(.*)",
  "/feedback",
]);

export default clerkMiddleware(async (auth, request) => {
  // 2. Si el usuario intenta entrar a una ruta que NO está en la lista pública...
  if (!isPublicRoute(request)) {
    // Forzamos la redirección interna a nuestra página propia de /sign-in
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", request.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    // Se salta los archivos internos de Next.js y archivos estáticos (.css, .js, imágenes, etc.)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Siempre se ejecuta para rutas de API
    "/(api|trpc)(.*)",
    // Siempre se ejecuta para rutas internas de la API de Clerk
    "/__clerk/(.*)",
  ],
};