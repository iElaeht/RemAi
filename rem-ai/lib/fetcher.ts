export async function fetchWithGlobalHandler(url: string, options?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(url, options);

    // Si el servidor o tus rutas de API responden con un error crítico (500, 502, 503, etc.)
    if (!response.ok && response.status >= 500) {
      window.dispatchEvent(new Event("trigger-maintenance-modal"));
    }

    return response;
  } catch (error) {
    // Si ocurre un fallo total de red (sin conexión o caída absoluta)
    window.dispatchEvent(new Event("trigger-maintenance-modal"));
    throw error;
  }
}