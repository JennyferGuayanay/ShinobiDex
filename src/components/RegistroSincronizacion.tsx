
import { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import {
  obtenerRegistros,
  limpiarRegistros,
  type Registro,
} from '../lib/registro';

export default function RegistroSincronizacion() {
  const [registros, setRegistros] = useState<Registro[]>([]);

  const actualizar = useCallback(async () => {
    try {
      const datos = await obtenerRegistros();
      setRegistros([...datos].reverse());
    } catch (error) {
      console.error('[REGISTROS]', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      actualizar();
    }, [actualizar])
  );

  async function limpiar() {
    await limpiarRegistros();
    await actualizar();
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>
        📜 Registro de sincronización
      </Text>

      <Text style={styles.descripcion}>
        Eventos reales guardados con fecha y hora.
      </Text>

      <View style={styles.botones}>
        <Pressable style={styles.boton} onPress={actualizar}>
          <Text style={styles.textoBoton}>Actualizar</Text>
        </Pressable>

        <Pressable style={styles.botonLimpiar} onPress={limpiar}>
          <Text style={styles.textoBoton}>Limpiar</Text>
        </Pressable>
      </View>

      {registros.length === 0 ? (
        <Text style={styles.vacio}>
          Todavía no hay eventos registrados.
        </Text>
      ) : (
        registros.map((registro) => (
          <View key={registro.id} style={styles.evento}>
            <Text style={styles.hora}>{registro.hora}</Text>
            <Text style={styles.mensaje}>
              {registro.mensaje}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginTop: 20,
    backgroundColor: '#282B35',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F9A603',
  },
  titulo: {
    color: '#F9A603',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descripcion: {
    color: '#F7EFE2',
    fontSize: 12,
    marginVertical: 8,
  },
  botones: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  boton: {
    backgroundColor: '#F25C00',
    padding: 10,
    borderRadius: 8,
  },
  botonLimpiar: {
    backgroundColor: '#BA383C',
    padding: 10,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  evento: {
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    paddingVertical: 8,
  },
  hora: {
    color: '#F9A603',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mensaje: {
    color: '#F7EFE2',
    fontSize: 13,
  },
  vacio: {
    color: '#AAAAAA',
    fontSize: 12,
    paddingVertical: 12,
  },
});

