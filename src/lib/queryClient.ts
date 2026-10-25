
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { queryKeys } from './queryKeys';
import {
  crearFavorito,
  editarFavorito,
} from '../api/favoritos';

const UN_DIA = 24 * 60 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: UN_DIA,
      retry: 2,
    },
    mutations: {
      retry: 3,
      networkMode: 'online',
      gcTime: UN_DIA,
    },
  },
});

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'SHINOBIDEX_CACHE',
  throttleTime: 300,
});

// Funciones necesarias para restaurar mutaciones offline
queryClient.setMutationDefaults(['favoritos', 'crear'], {
  mutationFn: crearFavorito,
  onSuccess: async () => {
    console.log('[SYNC] Favorito creado correctamente');
    await queryClient.invalidateQueries({
      queryKey: queryKeys.favoritos.all,
    });
  },
});

queryClient.setMutationDefaults(['favoritos', 'editar'], {
  mutationFn: editarFavorito,
  onSuccess: async () => {
    console.log('[SYNC] Favorito editado correctamente');
    await queryClient.invalidateQueries({
      queryKey: queryKeys.favoritos.all,
    });
  },
});
