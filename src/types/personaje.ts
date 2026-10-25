
export type Personaje = {
  id: number;
  name: string;
  images: string[];
};

export type RespuestaPersonajes = {
  characters: Personaje[];
  currentPage: number;
  pageSize: number;
  totalCharacters: number;
};
