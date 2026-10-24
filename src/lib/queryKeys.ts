
export const queryKeys = {
  personajes: {
    all: ['personajes'] as const,
    lista: (pagina: number) =>
      ['personajes', 'lista', pagina] as const,
    detalle: (id: number) =>
      ['personajes', 'detalle', id] as const,
  },

  favoritos: {
    all: ['favoritos'] as const,
    lista: () =>
      ['favoritos', 'lista'] as const,
    detalle: (id: string) =>
      ['favoritos', 'detalle', id] as const,
  },
};
