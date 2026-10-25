
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import {
  obtenerFavoritos,
  crearFavorito,
  editarFavorito,
} from '../api/favoritos';

export const mutationKeys = {
  crear: ['favoritos', 'crear'] as const,
  editar: ['favoritos', 'editar'] as const,
};

export function useFavoritos() {
  return useQuery({
    queryKey: queryKeys.favoritos.lista(),
    queryFn: obtenerFavoritos,
    staleTime: 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function useCrearFavorito() {
  return useMutation({
    mutationKey: mutationKeys.crear,
    mutationFn: crearFavorito,
    networkMode: 'online',
  });
}

export function useEditarFavorito() {
  return useMutation({
    mutationKey: mutationKeys.editar,
    mutationFn: editarFavorito,
    networkMode: 'online',
  });
}
