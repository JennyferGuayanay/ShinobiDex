import { useMutationState } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  mutationKeys,
  useCrearFavorito,
  useEditarFavorito,
  useFavoritos,
} from "../hooks/useFavoritos";
import type { Favorito, NuevoFavorito } from "../types/favorito";

function TarjetaFavorito({ item }: { item: Favorito }) {
  const [nota, setNota] = useState(item.nota);
  const editar = useEditarFavorito();

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.nombre}>🥷 {item.nombre}</Text>
      <Text style={styles.detalle}>ID Ninja: {item.personajeId}</Text>

      <TextInput
        style={styles.entrada}
        value={nota}
        onChangeText={setNota}
        placeholder="Escribe tu nota ninja"
        placeholderTextColor="#777"
      />

      <Pressable
        style={styles.boton}
        onPress={() => editar.mutate({ id: item.id, nota })}
      >
        <Text style={styles.textoBoton}>Guardar cambios</Text>
      </Pressable>
      {editar.isPaused && (
        <Text style={styles.pendiente}>⏳ Edición pendiente</Text>
      )}
      {editar.isError && (
        <Text style={styles.error}>{editar.error.message}</Text>
      )}
    </View>
  );
}

export default function Coleccion() {
  const [personajeId, setPersonajeId] = useState("1344");
  const [nombre, setNombre] = useState("Naruto Uzumaki");
  const [nota, setNota] = useState("");

  const favoritos = useFavoritos();
  const crear = useCrearFavorito();

  const pendientesCrear = useMutationState({
    filters: { mutationKey: mutationKeys.crear, status: "pending" },
    select: (mutation) => ({
      variables: mutation.state.variables as NuevoFavorito,
      pausada: mutation.state.isPaused,
      id: mutation.mutationId,
    }),
  });

  const pendientesEditar = useMutationState({
    filters: { mutationKey: mutationKeys.editar, status: "pending" },
    select: (mutation) => ({
      id: mutation.mutationId,
      pausada: mutation.state.isPaused,
    }),
  });

  function guardar() {
    const id = Number(personajeId);

    if (!Number.isInteger(id) || id <= 0 || !nombre.trim()) {
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
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.etiqueta}>🍥 ALDEA SHINOBI</Text>
        <Text style={styles.titulo}>Mi colección</Text>
        <Text style={styles.subtitulo}>
          Guarda tus ninjas favoritos y sus notas.
        </Text>

        <View style={styles.tarjeta}>
          <Text style={styles.seccion}>Nuevo expediente</Text>

          <TextInput
            style={styles.entrada}
            value={personajeId}
            onChangeText={setPersonajeId}
            keyboardType="numeric"
            placeholder="ID del personaje"
            placeholderTextColor="#777"
          />

          <TextInput
            style={styles.entrada}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del ninja"
            placeholderTextColor="#777"
          />

          <TextInput
            style={styles.entrada}
            value={nota}
            onChangeText={setNota}
            placeholder="Nota personal"
            placeholderTextColor="#777"
          />

          <Pressable style={styles.boton} onPress={guardar}>
            <Text style={styles.textoBoton}>🍥 Agregar favorito</Text>
          </Pressable>
        </View>

        {pendientesCrear.map((item) => (
          <View key={item.id} style={styles.pendienteTarjeta}>
            <Text style={styles.nombre}>
              {item.variables?.nombre ?? "Nuevo favorito"}
            </Text>
            <Text style={styles.pendiente}>
              {item.pausada
                ? "⏳ Pendiente de sincronización"
                : "🔄 Enviando a MockAPI"}
            </Text>
          </View>
        ))}

        {pendientesEditar.length > 0 && (
          <Text style={styles.pendiente}>
            Ediciones en proceso: {pendientesEditar.length}
          </Text>
        )}

        <Text style={styles.seccion}>Mis expedientes guardados</Text>

        {favoritos.isPending && <ActivityIndicator color="#F25C00" />}

        {favoritos.isError && (
          <Text style={styles.error}>{favoritos.error.message}</Text>
        )}

        {favoritos.isSuccess && favoritos.data.length === 0 && (
          <Text style={styles.subtitulo}>
            Todavía no tienes favoritos guardados.
          </Text>
        )}

        {favoritos.data?.map((item) => (
          <TarjetaFavorito key={item.id} item={item} />
        ))}

        {crear.isError && (
          <Text style={styles.error}>{crear.error.message}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#171820" },
  contenido: { padding: 20, paddingBottom: 60, gap: 12 },
  etiqueta: { color: "#F9A603", fontSize: 12, fontWeight: "bold" },
  titulo: { color: "#F7EFE2", fontSize: 30, fontWeight: "900" },
  subtitulo: { color: "#C0B8AE", fontSize: 13 },
  seccion: {
    color: "#F9A603",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  tarjeta: {
    backgroundColor: "#282B35",
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F25C00",
    gap: 10,
  },
  entrada: {
    backgroundColor: "#F7EFE2",
    color: "#171820",
    padding: 12,
    borderRadius: 9,
  },
  boton: {
    backgroundColor: "#F25C00",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  textoBoton: { color: "#FFFFFF", fontWeight: "bold" },
  nombre: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  detalle: { color: "#C0B8AE", fontSize: 12 },
  pendiente: { color: "#F9A603", fontSize: 13 },
  pendienteTarjeta: {
    borderWidth: 1,
    borderColor: "#F9A603",
    borderRadius: 12,
    padding: 14,
    gap: 5,
  },
  error: { color: "#FF7777", fontSize: 13 },
});
