
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ShinobiTheme } from "../constants/shinobiTheme";
import { usePersonajes } from "../hooks/usePersonajes";

const C = ShinobiTheme.colors;

const narutoHero = require("../../assets/images/naruto-hero.png");
const mangaTexture = require("../../assets/images/manga-texture.png");

export default function Inicio() {
  const [busqueda, setBusqueda] = useState("");

  const {
    data,
    isPending,
    isError,
    isFetching,
    isStale,
    error,
  } = usePersonajes();

  const personajes = data?.characters ?? [];

  const personajesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return personajes.filter((personaje) =>
      personaje.name.toLowerCase().includes(texto)
    );
  }, [personajes, busqueda]);

  return (
    <SafeAreaView style={styles.contenedor}>
      <ImageBackground
        source={mangaTexture}
        resizeMode="cover"
        style={styles.fondoGeneral}
        imageStyle={styles.imagenFondo}
      >
        <FlatList
          data={personajesFiltrados}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.fila}
          contentContainerStyle={styles.lista}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              {/* PORTADA NARUTO */}
              <View style={styles.hero}>
                <View style={styles.fondoHero} />

                <Text style={styles.marca}>
                  ◉ ARCHIVO NINJA
                </Text>

                <Image
                  source={narutoHero}
                  resizeMode="contain"
                  style={styles.narutoHero}
                />

                <View style={styles.titulosHero}>
                  <Text
                    style={styles.tituloPrincipal}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    SHINOBIDEX
                  </Text>

                  <View style={styles.cintaNegra}>
                    <Text style={styles.frase}>
                      DESCUBRE A LOS NINJAS
                    </Text>
                    <Text style={styles.frase}>
                      DEL UNIVERSO NARUTO
                    </Text>
                  </View>
                </View>
              </View>

              {/* BUSCADOR */}
              <View style={styles.zonaBusqueda}>
                <View style={styles.buscador}>
                  <Text style={styles.iconoBuscar}>⌕</Text>

                  <TextInput
                    value={busqueda}
                    onChangeText={setBusqueda}
                    placeholder="Buscar personaje..."
                    placeholderTextColor="#AAAAAA"
                    style={styles.entradaBuscar}
                  />

                  {busqueda.length > 0 && (
                    <Pressable
                      onPress={() => setBusqueda("")}
                      hitSlop={10}
                    >
                      <Text style={styles.limpiar}>✕</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.barraEstado}>
                  <Text style={styles.estado}>
                    {isFetching
                      ? "Actualizando..."
                      : isStale
                        ? "Datos en caché"
                        : "Expedientes disponibles"}
                  </Text>

                  <Text style={styles.contador}>
                    {personajesFiltrados.length} NINJAS
                  </Text>
                </View>

                {isPending && (
                  <ActivityIndicator
                    color={C.blanco}
                    size="large"
                    style={styles.cargando}
                  />
                )}

                {isError && personajes.length === 0 && (
                  <Text style={styles.error}>
                    No se pudieron cargar los ninjas:
                    {" "}{error?.message}
                  </Text>
                )}
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.sinResultados}>
              {!isPending && !isError && (
                <Text style={styles.vacio}>
                  No encontramos ninjas con ese nombre.
                </Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <View style={styles.contenedorImagen}>
                {item.images?.[0] ? (
                  <Image
                    source={{ uri: item.images[0] }}
                    resizeMode="cover"
                    style={styles.imagenPersonaje}
                  />
                ) : (
                  <View style={styles.sinImagen}>
                    <Text style={styles.emojiNinja}>🥷</Text>
                  </View>
                )}

                <View style={styles.insignia}>
                  <Text style={styles.insigniaTexto}>
                    SHINOBI
                  </Text>
                </View>
              </View>

              <View style={styles.datosTarjeta}>
                <Text
                  style={styles.nombrePersonaje}
                  numberOfLines={2}
                >
                  {item.name.toUpperCase()}
                </Text>

                <Text style={styles.expediente}>
                  EXPEDIENTE #{item.id}
                </Text>
              </View>
            </View>
          )}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: C.naranja,
  },

  fondoGeneral: {
    flex: 1,
  },

  imagenFondo: {
    opacity: 0.85,
  },

  lista: {
    paddingBottom: 36,
  },

  // PORTADA
  hero: {
    height: 430,
    position: "relative",
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  fondoHero: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(215,65,0,0.12)",
  },

  marca: {
    position: "absolute",
    top: 18,
    left: 20,
    zIndex: 4,
    fontSize: 16,
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    color: C.blanco,
    letterSpacing: 1,
    textShadowColor: C.negro,
    textShadowRadius: 4,
  },

  narutoHero: {
    position: "absolute",
    top: 5,
    right: -35,
    width: 365,
    height: 335,
    zIndex: 1,
  },

  titulosHero: {
    zIndex: 3,
    paddingHorizontal: 16,
    paddingBottom: 15,
  },

  tituloPrincipal: {
    color: C.blanco,
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    fontSize: 62,
    letterSpacing: -2,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: {
      width: 3,
      height: 4,
    },
    textShadowRadius: 3,
  },

  cintaNegra: {
    alignSelf: "flex-start",
    backgroundColor: C.negro,
    paddingVertical: 9,
    paddingHorizontal: 14,
    transform: [{ rotate: "-2deg" }],
    marginTop: 5,
  },

  frase: {
    color: C.blanco,
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    fontSize: 19,
    lineHeight: 23,
  },

  // BUSCADOR
  zonaBusqueda: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },

  buscador: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    paddingHorizontal: 13,
    borderRadius: 12,
    backgroundColor: C.negro,
    borderWidth: 2,
    borderColor: C.blanco,
  },

  iconoBuscar: {
    color: C.blanco,
    fontSize: 32,
    marginRight: 10,
  },

  entradaBuscar: {
    flex: 1,
    color: C.blanco,
    fontSize: 15,
  },

  limpiar: {
    color: C.blanco,
    fontSize: 20,
  },

  barraEstado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  estado: {
    fontSize: 11,
    color: C.blanco,
    fontWeight: "700",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  contador: {
    fontSize: 11,
    color: C.blanco,
    fontWeight: "900",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  cargando: {
    marginVertical: 16,
  },

  // TARJETAS
  fila: {
    paddingHorizontal: 12,
    gap: 12,
    marginBottom: 13,
  },

  tarjeta: {
    flex: 1,
    backgroundColor: C.crema,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: C.negro,
    overflow: "hidden",
    borderBottomWidth: 5,
    borderBottomColor: C.negro,
  },

  contenedorImagen: {
    position: "relative",
    backgroundColor: C.negro,
  },

  imagenPersonaje: {
    width: "100%",
    height: 155,
  },

  sinImagen: {
    height: 155,
    backgroundColor: "#DFCDB3",
    justifyContent: "center",
    alignItems: "center",
  },

  emojiNinja: {
    fontSize: 46,
  },

  insignia: {
    position: "absolute",
    top: 7,
    left: 7,
    backgroundColor: C.negro,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
  },

  insigniaTexto: {
    color: C.blanco,
    fontSize: 9,
    fontWeight: "900",
  },

  datosTarjeta: {
    backgroundColor: C.crema,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  nombrePersonaje: {
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    fontSize: 22,
    color: C.negro,
    minHeight: 45,
  },

  expediente: {
    color: C.naranja,
    fontWeight: "900",
    fontSize: 11,
    marginTop: 3,
  },

  sinResultados: {
    paddingHorizontal: 16,
  },

  vacio: {
    color: C.blanco,
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
  },

  error: {
    color: C.blanco,
    backgroundColor: "#7B1717",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
});
