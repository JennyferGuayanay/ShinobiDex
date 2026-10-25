import type {
    EditarFavorito,
    Favorito,
    NuevoFavorito,
} from "../types/favorito";

const BASE_URL = process.env.EXPO_PUBLIC_MOCKAPI_URL;

function obtenerURL() {
  if (!BASE_URL) {
    throw new Error("Falta EXPO_PUBLIC_MOCKAPI_URL");
  }

  const url = `${BASE_URL.replace(/\/$/, "")}/favoritos`;

  console.log("[MOCKAPI URL]", url);

  return url;
}

export async function obtenerFavoritos(): Promise<Favorito[]> {
  console.log("[GET FAVORITOS]", new Date().toISOString());

  const respuesta = await fetch(obtenerURL());

  if (!respuesta.ok) {
    const detalle = await respuesta.text();

    console.log("[ERROR MOCKAPI]", {
      url: respuesta.url,
      estado: respuesta.status,
      detalle: detalle,
    });

    throw new Error(`MockAPI ${respuesta.status}: ${detalle}`);
  }

  return respuesta.json();
}

export async function crearFavorito(datos: NuevoFavorito): Promise<Favorito> {
  console.log("[POST INICIO]", new Date().toISOString(), datos.nombre);

  const respuesta = await fetch(obtenerURL(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();

    console.log("[ERROR MOCKAPI]", {
      url: respuesta.url,
      estado: respuesta.status,
      detalle: detalle,
    });

    throw new Error(`MockAPI ${respuesta.status}: ${detalle}`);
  }

  console.log("[POST EXITOSO]", new Date().toISOString());
  return respuesta.json();
}

export async function editarFavorito(datos: EditarFavorito): Promise<Favorito> {
  console.log("[PUT INICIO]", new Date().toISOString(), datos.id);

  const respuesta = await fetch(`${obtenerURL()}/${datos.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nota: datos.nota }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();

    console.log("[ERROR MOCKAPI]", {
      url: respuesta.url,
      estado: respuesta.status,
      detalle,
    });

    throw new Error(`POST favoritos: ${respuesta.status} - ${detalle}`);
  }

  console.log("[PUT EXITOSO]", new Date().toISOString());
  return respuesta.json();
}
