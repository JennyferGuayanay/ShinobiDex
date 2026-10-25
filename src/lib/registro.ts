
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE = 'SHINOBIDEX_REGISTROS';

export type Registro = {
  id: string;
  hora: string;
  mensaje: string;
};

export async function guardarRegistro(
  mensaje: string
): Promise<void> {
  const ahora = new Date();

  const nuevo: Registro = {
    id: `${ahora.getTime()}-${Math.random()}`,
    hora: ahora.toLocaleTimeString('es-EC', {
      hour12: false,
    }),
    mensaje,
  };

  try {
    const guardados = await obtenerRegistros();
    const actualizados = [...guardados, nuevo].slice(-30);

    await AsyncStorage.setItem(
      CLAVE,
      JSON.stringify(actualizados)
    );

    console.log('[SHINOBIDEX]', nuevo.hora, mensaje);
  } catch (error) {
    console.error('[REGISTRO ERROR]', error);
  }
}

export async function obtenerRegistros(): Promise<Registro[]> {
  const datos = await AsyncStorage.getItem(CLAVE);
  return datos ? JSON.parse(datos) : [];
}

export async function limpiarRegistros(): Promise<void> {
  await AsyncStorage.removeItem(CLAVE);
}
