import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas públicas que no requieren autenticación
const isPublicRoute = createRouteMatcher([
  "/",
  "/discover",
  "/sign-in",
  "/sign-up",
  "/mangas",
  "/mangas/(.*)",
  "/manhwas",
  "/manhwas/(.*)",
  "/details/manga/(.*)",
  "/details/manhwa/(.*)",
  "/watch/manga/(.*)",
  "/watch/manhwa/(.*)",
  "/manga/(.*)",
  "/api/(.*)",
  "/legal/(.*)",
  "/feedback",
]);

export default clerkMiddleware(async (auth, request) => {
  // Protege las rutas que no se encuentran en la lista blanca pública
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", request.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    // Excluye archivos internos de Next.js y recursos estáticos
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Aplica siempre para rutas de API y endpoints de Clerk
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};