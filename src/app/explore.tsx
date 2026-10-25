
import { useMutationState } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RegistroSincronizacion from "../components/RegistroSincronizacion";
import { ShinobiTheme } from "../constants/shinobiTheme";
import {
  mutationKeys,
  useCrearFavorito,
  useEditarFavorito,
  useFavoritos,
} from "../hooks/useFavoritos";
import { guardarRegistro } from "../lib/registro";
import type { Favorito, NuevoFavorito } from "../types/favorito";

const C = ShinobiTheme.colors;

const mangaTexture = require("../../assets/images/manga-texture.png");

// TARJETA DE FAVORITO
function TarjetaFavorito({ item }: { item: Favorito }) {
  const [nota, setNota] = useState(item.nota ?? "");
  const editar = useEditarFavorito();

  // Actualiza el campo si llegan cambios desde MockAPI.
  useEffect(() => {
    setNota(item.nota ?? "");
  }, [item.nota]);

  return (
    <View style={styles.tarjetaFavorito}>
      <View style={styles.encabezadoTarjeta}>
        <Text style={styles.insignia}>
          EXPEDIENTE NINJA
        </Text>

        <Text style={styles.numero}>
          #{item.personajeId}
        </Text>
      </View>

      <Text style={styles.nombre}>
        {item.nombre.toUpperCase()}
      </Text>

      <Text style={styles.etiquetaCampo}>
        NOTAS DEL SHINOBI
      </Text>

      <TextInput
        style={[styles.entrada, styles.entradaNota]}
        value={nota}
        onChangeText={setNota}
        placeholder="Escribe tu nota ninja..."
        placeholderTextColor="#777777"
        multiline
      />

      <Pressable
        style={styles.botonNegro}
        onPress={() =>
          editar.mutate({
            id: item.id,
            nota: nota.trim(),
          })
        }
      >
        <Text style={styles.textoBoton}>
          GUARDAR CAMBIOS
        </Text>
      </Pressable>

      {editar.isPaused && (
        <Text style={styles.pendienteOscuro}>
          EDICIÓN PENDIENTE DE SINCRONIZACIÓN
        </Text>
      )}

      {editar.isError && (
        <Text style={styles.errorEnTarjeta}>
          {editar.error.message}
        </Text>
      )}
    </View>
  );
}

// PANTALLA MI COLECCIÓN
export default function Coleccion() {
  const [personajeId, setPersonajeId] = useState("1344");
  const [nombre, setNombre] = useState("Naruto Uzumaki");
  const [nota, setNota] = useState("");

  const favoritos = useFavoritos();
  const crear = useCrearFavorito();

  // Mutaciones pendientes de creación
  const pendientesCrear = useMutationState({
    filters: {
      mutationKey: mutationKeys.crear,
      status: "pending",
    },
    select: (mutation) => ({
      variables: mutation.state.variables as NuevoFavorito,
      pausada: mutation.state.isPaused,
      id: mutation.mutationId,
    }),
  });

  // Mutaciones pendientes de edición
  const pendientesEditar = useMutationState({
    filters: {
      mutationKey: mutationKeys.editar,
      status: "pending",
    },
    select: (mutation) => ({
      id: mutation.mutationId,
      pausada: mutation.state.isPaused,
    }),
  });

  // Evitar registrar varias veces la misma pausa
  const registrados = useRef<Set<number>>(new Set());

  const idsPausados = pendientesCrear
    .filter((item) => item.pausada)
    .map((item) => item.id)
    .join(",");

  useEffect(() => {
    pendientesCrear.forEach((item) => {
      if (
        item.pausada &&
        !registrados.current.has(item.id)
      ) {
        registrados.current.add(item.id);

        void guardarRegistro(
          `Mutación pendiente sin internet: ${
            item.variables?.nombre ?? "Favorito"
          }`
        );
      }
    });
  }, [idsPausados]);

  function guardar() {
    const id = Number(personajeId);

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      !nombre.trim()
    ) {
      return;
    }

    crear.mutate({
      personajeId: id,
      nombre: nombre.trim(),
      imagen: "",
      nota: nota.trim(),
    });

    setNota("");
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <ImageBackground
        source={mangaTexture}
        resizeMode="cover"
        style={styles.fondoGeneral}
        imageStyle={styles.imagenFondo}
      >
        <ScrollView
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
        >
          {/* ENCABEZADO */}
          <View style={styles.hero}>
            <Text style={styles.heroEtiqueta}>
              ◉ MI ALDEA NINJA
            </Text>

            <Text
              style={styles.heroTitulo}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              MI COLECCIÓN
            </Text>

            <Text style={styles.heroDescripcion}>
              Guarda tus ninjas favoritos y registra
              tus propias notas de misión.
            </Text>
          </View>

          {/* FORMULARIO */}
          <View style={styles.formulario}>
            <View style={styles.cintaTitulo}>
              <Text style={styles.seccionOscura}>
                NUEVO EXPEDIENTE
              </Text>
            </View>

            <Text style={styles.etiquetaCampo}>
              IDENTIFICADOR NINJA
            </Text>

            <TextInput
              style={styles.entrada}
              value={personajeId}
              onChangeText={setPersonajeId}
              keyboardType="numeric"
              placeholder="ID del personaje"
              placeholderTextColor="#777777"
            />

            <Text style={styles.etiquetaCampo}>
              NOMBRE DEL PERSONAJE
            </Text>

            <TextInput
              style={styles.entrada}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre del ninja"
              placeholderTextColor="#777777"
            />

            <Text style={styles.etiquetaCampo}>
              NOTA PERSONAL
            </Text>

            <TextInput
              style={[styles.entrada, styles.entradaNota]}
              value={nota}
              onChangeText={setNota}
              placeholder="Escribe una nota..."
              placeholderTextColor="#777777"
              multiline
            />

            <Pressable
              style={styles.botonNegro}
              onPress={guardar}
            >
              <Text style={styles.textoBoton}>
                + AGREGAR A MI ALDEA
              </Text>
            </Pressable>
          </View>

          {/* CREACIONES PENDIENTES */}
          {pendientesCrear.map((item) => (
            <View
              key={item.id}
              style={styles.pendienteTarjeta}
            >
              <Text style={styles.pendienteNombre}>
                {item.variables?.nombre ??
                  "Nuevo favorito"}
              </Text>

              <Text style={styles.pendiente}>
                {item.pausada
                  ? "PENDIENTE DE SINCRONIZACIÓN"
                  : "ENVIANDO A MOCKAPI"}
              </Text>
            </View>
          ))}

          {/* EDICIONES PENDIENTES */}
          {pendientesEditar.length > 0 && (
            <Text style={styles.pendienteGeneral}>
              Ediciones en proceso:{" "}
              {pendientesEditar.length}
            </Text>
          )}

          {/* LISTADO DE FAVORITOS */}
          <View style={styles.tituloSeccion}>
            <Text style={styles.seccion}>
              EXPEDIENTES GUARDADOS
            </Text>

            <View style={styles.lineaNaranja} />
          </View>

          {favoritos.isPending && (
            <ActivityIndicator
              color={C.blanco}
              size="large"
            />
          )}

          {favoritos.isError && (
            <Text style={styles.error}>
              {favoritos.error.message}
            </Text>
          )}

          {favoritos.isSuccess &&
            favoritos.data.length === 0 && (
              <Text style={styles.textoVacio}>
                Todavía no tienes ninjas
                en tu colección.
              </Text>
            )}

          {favoritos.data?.map((item) => (
            <TarjetaFavorito
              key={item.id}
              item={item}
            />
          ))}

          {crear.isError && (
            <Text style={styles.error}>
              {crear.error.message}
            </Text>
          )}

          {/* REGISTRO DE SINCRONIZACIÓN */}
          <RegistroSincronizacion />
        </ScrollView>
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

  contenido: {
    paddingBottom: 80,
    gap: 13,
  },

  // ENCABEZADO
  hero: {
    backgroundColor: "rgba(217,75,0,0.32)",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 18,
  },

  heroEtiqueta: {
    color: C.blanco,
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 12,
  },

  heroTitulo: {
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    fontSize: 48,
    letterSpacing: -1,
    color: C.blanco,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowRadius: 3,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },

  heroDescripcion: {
    color: C.blanco,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    marginTop: 6,
    maxWidth: 320,
  },

  // FORMULARIO
  formulario: {
    marginHorizontal: 13,
    backgroundColor: C.crema,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: C.negro,
    borderBottomWidth: 5,
    borderBottomColor: C.naranja,
    padding: 15,
    gap: 8,
  },

  cintaTitulo: {
    backgroundColor: C.negro,
    alignSelf: "flex-start",
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginBottom: 4,
    transform: [{ rotate: "-1deg" }],
  },

  seccionOscura: {
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    fontSize: 26,
    color: C.blanco,
  },

  etiquetaCampo: {
    color: C.negro,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.6,
    marginTop: 5,
  },

  entrada: {
    backgroundColor: "#FFF9F0",
    color: C.negro,
    borderWidth: 1,
    borderColor: "#B5A99C",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    minHeight: 48,
  },

  entradaNota: {
    minHeight: 58,
    textAlignVertical: "top",
  },

  botonNegro: {
    backgroundColor: C.negro,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
  },

  textoBoton: {
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    fontSize: 22,
    color: C.blanco,
    textAlign: "center",
  },

  // TÍTULO EXPEDIENTES
  tituloSeccion: {
    marginHorizontal: 17,
    marginTop: 15,
    gap: 6,
  },

  seccion: {
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    fontSize: 30,
    color: C.blanco,
    textShadowColor: C.negro,
    textShadowRadius: 3,
  },

  lineaNaranja: {
    width: 95,
    height: 5,
    backgroundColor: C.naranjaIntenso,
  },

  // FAVORITOS
  tarjetaFavorito: {
    marginHorizontal: 13,
    backgroundColor: C.crema,
    padding: 14,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: C.negro,
    borderBottomWidth: 5,
    borderBottomColor: C.naranja,
    gap: 8,
  },

  encabezadoTarjeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  insignia: {
    color: C.naranja,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  numero: {
    color: "#696969",
    fontSize: 12,
    fontWeight: "900",
  },

  nombre: {
    fontFamily: "sans-serif-condensed",
    fontWeight: "900",
    fontSize: 26,
    color: C.negro,
  },

  // PENDIENTES
  pendienteTarjeta: {
    marginHorizontal: 13,
    backgroundColor: "#231B16",
    borderWidth: 2,
    borderColor: C.dorado,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },

  pendienteNombre: {
    color: C.blanco,
    fontSize: 15,
    fontWeight: "900",
  },

  pendiente: {
    color: C.dorado,
    fontWeight: "900",
    fontSize: 12,
  },

  pendienteGeneral: {
    marginHorizontal: 17,
    color: C.blanco,
    fontWeight: "900",
    fontSize: 12,
  },

  pendienteOscuro: {
    color: C.naranja,
    fontWeight: "900",
    fontSize: 12,
  },

  // MENSAJES
  textoVacio: {
    marginHorizontal: 17,
    color: C.blanco,
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: 14,
    borderRadius: 9,
    fontSize: 13,
  },

  error: {
    marginHorizontal: 17,
    color: C.blanco,
    backgroundColor: "#872323",
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
  },

  errorEnTarjeta: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "700",
  },
});
