import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePersonajes } from "../hooks/usePersonajes";
console.log("TIPO DE usePersonajes:", typeof usePersonajes);

export default function Inicio() {
  const { data, isPending, isError, isFetching, isStale, fetchStatus, error } =
    usePersonajes();

  const personajes = data?.characters ?? [];

  console.log("[QUERY]", new Date().toISOString(), {
    personajes: personajes.length,
    isPending,
    isFetching,
    isStale,
    fetchStatus,
  });

  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.simbolo}>🍥 ARCHIVO SHINOBI</Text>
        <Text style={styles.titulo}>ShinobiDex</Text>
        <Text style={styles.subtitulo}>
          Descubre a los ninjas del universo Naruto
        </Text>

        <Text style={styles.estado}>
          {isFetching
            ? "🔄 Actualizando expedientes ninja..."
            : isStale
              ? "📜 Datos en caché pendientes de actualizar"
              : "✅ Expedientes disponibles"}
        </Text>
      </View>

      {isPending ? (
        <ActivityIndicator
          size="large"
          color="#F57C20"
          style={{ marginTop: 40 }}
        />
      ) : isError && personajes.length === 0 ? (
        <Text style={styles.mensaje}>Error al cargar: {error?.message}</Text>
      ) : (
        <FlatList
          data={personajes}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.lista}
          columnWrapperStyle={styles.fila}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              {item.images?.[0] ? (
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.imagen}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.sinImagen}>
                  <Text>🥷</Text>
                </View>
              )}

              <Text style={styles.nombre} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.codigo}>EXPEDIENTE #{item.id}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#171820",
    paddingTop: 28,
  },
  encabezado: {
    paddingHorizontal: 22,
    paddingVertical: 22,
    borderBottomWidth: 2,
    borderBottomColor: "#F57C20",
  },
  simbolo: {
    color: "#F57C20",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 2,
  },
  titulo: {
    color: "#F4E8D2",
    fontWeight: "900",
    fontSize: 34,
    marginTop: 7,
  },
  subtitulo: {
    color: "#B6B8C5",
    fontSize: 13,
    marginTop: 5,
  },
  estado: {
    color: "#F8BE83",
    fontSize: 12,
    marginTop: 14,
  },
  lista: {
    padding: 14,
    paddingBottom: 35,
  },
  fila: {
    gap: 12,
    marginBottom: 14,
  },
  tarjeta: {
    flex: 1,
    backgroundColor: "#284968",
    borderRadius: 16,
    overflow: "hidden",
    borderBottomWidth: 3,
    borderBottomColor: "#F57C20",
    paddingBottom: 12,
  },
  imagen: {
    width: "100%",
    height: 155,
    backgroundColor: "#293342",
  },
  sinImagen: {
    height: 155,
    alignItems: "center",
    justifyContent: "center",
  },
  nombre: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginTop: 10,
  },
  codigo: {
    color: "#F8BE83",
    fontSize: 10,
    marginHorizontal: 10,
    marginTop: 5,
  },
  mensaje: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 40,
  },
});
