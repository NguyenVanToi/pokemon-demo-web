import type { NextApiRequest, NextApiResponse } from "next";

import { IPokemonLite, ITypePokemonDetail } from "@/lib/interface";

type Data = {
  count: number;
  next: string | null;
  previous: string | null;
  results: IPokemonLite[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { types = '', page = 1, limit = 48 } = req.query;
  const listTypes = (types as string).split(',');
  const currentPage = +page;
  const perPage = +limit;

  if (types && listTypes && listTypes.length > 0) {
    const allResults = await Promise.all(
      listTypes.map(async (type) => {
        const response = await fetch(`${process.env.POKEMON_API_URL}/type/${type}`);
        const data: ITypePokemonDetail = await response.json();
        return data.pokemon.map((p) => p.pokemon);
      })
    );
    const commonPokemon = allResults.reduce((pokemonArr, current) =>
      pokemonArr.filter((pokemon) => current.some((p) => p.name === pokemon.name))
    );
  
    const start: number = (currentPage - 1) * perPage;
    const count = commonPokemon.length;
    const nextPage = currentPage < Math.ceil(count / perPage) ? currentPage + 1 : null;

    res.status(200).json({
      count: commonPokemon.length,
      next: nextPage ? `/api/pokemonByTypes?types=${types}&page=${nextPage}&perPage=${perPage}` : null,
      previous: currentPage > 1 ? `/api/pokemonByTypes?types=${types}&page=${currentPage - 1}&perPage=${perPage}` : null,
      results: count > perPage ? commonPokemon.slice(start, start + perPage) : commonPokemon
    });
  } else {
    const response = await fetch(`${process.env.POKEMON_API_URL}/pokemon?limit=${perPage}`);
    const data = await response.json();

    res.status(200).json({...data});
  }
}
