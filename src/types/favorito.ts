
export type Favorito = {
  id: string;
  personajeId: number;
  nombre: string;
  imagen: string;
  nota: string;
};

export type NuevoFavorito = Omit<Favorito, 'id'>;

export type EditarFavorito = {
  id: string;
  nota: string;
};
