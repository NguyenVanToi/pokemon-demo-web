export interface IPokemonLite {
  id?: number;
  name: string;
  url: string;
}

export interface IResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[]
}

export interface ITypePokemon {
  name: string;
  url: string;
  pokemon: {pokemon: IPokemonLite}[]
}

export interface ITypePokemonDetail {
  id: number;
  pokemon: {pokemon: IPokemonLite}[]
}
