import { useQuery } from "@tanstack/react-query";
import { obtenerPersonajes } from "../api/dattebayo";
import { queryKeys } from "../lib/queryKeys";

console.log("[DIAGNOSTICO] useQuery:", typeof useQuery);
console.log("[DIAGNOSTICO] obtenerPersonajes:", typeof obtenerPersonajes);
console.log("[DIAGNOSTICO] queryKeys:", JSON.stringify(queryKeys));

export function usePersonajes(pagina: number = 1) {
  console.log("[DIAGNOSTICO] Hook ejecutado");

  return useQuery({
    queryKey: queryKeys.personajes.lista(pagina),
    queryFn: () => obtenerPersonajes(pagina),
    staleTime: 10 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
