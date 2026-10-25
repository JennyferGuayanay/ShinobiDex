import type {
  EditarFavorito,
  Favorito,
  NuevoFavorito,
} from "../types/favorito";

import { guardarRegistro } from "../lib/registro";

const BASE_URL = process.env.EXPO_PUBLIC_MOCKAPI_URL;

// Obtener la URL de MockAPI
function obtenerURL() {
  if (!BASE_URL) {
    throw new Error("Falta EXPO_PUBLIC_MOCKAPI_URL");
  }

  const url = `${BASE_URL.replace(/\/$/, "")}/favoritos`;

  console.log("[MOCKAPI URL]", url);

  return url;
}

// GET: Obtener favoritos
export async function obtenerFavoritos(): Promise<Favorito[]> {
  console.log("[GET FAVORITOS]", new Date().toISOString());

  const respuesta = await fetch(obtenerURL());

  if (!respuesta.ok) {
    const detalle = await respuesta.text();

    console.log("[ERROR MOCKAPI]", {
      url: respuesta.url,
      estado: respuesta.status,
      detalle,
    });

    throw new Error(`GET favoritos: ${respuesta.status} - ${detalle}`);
  }

  return respuesta.json();
}

// POST: Crear favorito
export async function crearFavorito(datos: NuevoFavorito): Promise<Favorito> {
  console.log("[POST INICIO]", new Date().toISOString(), datos.nombre);

  await guardarRegistro(`Iniciando POST: ${datos.nombre}`);

  const respuesta = await fetch(obtenerURL(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();

    console.log("[ERROR MOCKAPI]", {
      url: respuesta.url,
      estado: respuesta.status,
      detalle,
    });

    await guardarRegistro(`Error POST ${respuesta.status}: ${datos.nombre}`);

    throw new Error(`POST favoritos: ${respuesta.status} - ${detalle}`);
  }

  const favorito: Favorito = await respuesta.json();

  await guardarRegistro(`POST exitoso: ${datos.nombre}`);

  console.log("[POST EXITOSO]", new Date().toISOString());

  return favorito;
}

// PUT: Editar favorito
export async function editarFavorito(datos: EditarFavorito): Promise<Favorito> {
  console.log("[PUT INICIO]", new Date().toISOString(), datos.id);

  await guardarRegistro(`Iniciando PUT: ${datos.id}`);

  const respuesta = await fetch(`${obtenerURL()}/${datos.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nota: datos.nota,
    }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();

    console.log("[ERROR MOCKAPI]", {
      url: respuesta.url,
      estado: respuesta.status,
      detalle,
    });

    await guardarRegistro(`Error PUT ${respuesta.status}: ${datos.id}`);

    throw new Error(`PUT favoritos: ${respuesta.status} - ${detalle}`);
  }

  const favorito: Favorito = await respuesta.json();

  await guardarRegistro(`PUT exitoso: ${datos.id}`);

  console.log("[PUT EXITOSO]", new Date().toISOString());

  return favorito;
}
