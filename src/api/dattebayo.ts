import type { RespuestaPersonajes } from "../types/personaje";

const API_URL = "https://dattebayo-api.onrender.com";

export async function obtenerPersonajes(
  pagina: number = 1,
): Promise<RespuestaPersonajes> {
  console.log("[GET INICIO]", new Date().toISOString());

  const respuesta = await fetch(
    `${API_URL}/characters?page=${pagina}&limit=20`,
  );

  if (!respuesta.ok) {
    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  const datos: RespuestaPersonajes = await respuesta.json();

  console.log("[GET TERMINADO]", new Date().toISOString());
  console.log("[PERSONAJES]", datos.characters?.length);

  return datos;
}
