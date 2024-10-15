import localFont from "next/font/local";
import { useState } from "react";

import { IPokemonLite, IResponse, ITypePokemon } from "@/lib/interface";
import PokeView from "./components/PokeView";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

type HomeProps = {
  initialData: IResponse<IPokemonLite>;
  pokemonTypes: ITypePokemon[];
}

export default function Home({ initialData, pokemonTypes }: HomeProps) {
  const [data, setData] = useState(initialData ? initialData.results : []);
  const [nextUrl, setNextUrl] = useState(initialData ? initialData.next : null);
  const [prevUrl, setPrevUrl] = useState(initialData ? initialData.previous : null);
  const [total, setTotal] = useState(initialData ? initialData.count : 0);
  const [typeSelected, setTypeSelected] = useState<string[]>([]);


  const loadMore = async (url: string | null) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const _data: IResponse<IPokemonLite> = await response.json();
      setData(_data.results);
      setTotal(_data.count)
      setNextUrl(_data.next);
      setPrevUrl(_data.previous);
    } catch (e) {
      console.log('Error while getting pokemon data :>> ', e);
    }
  };

  const loadPokemonByTypes = async (type: string) => {
    let _types: string[] = [...typeSelected];
    if (typeSelected.includes(type))
      _types = _types.filter(item => item !== type);
    else 
      _types.push(type);
  
    setTypeSelected(_types);
    try {
      const response = await fetch(`/api/pokemonByTypes?types=${_types.join(',')}&limit=48`);
      const _data: IResponse<IPokemonLite> = await response.json();
      setData(_data.results);
      setTotal(_data.count)
      setNextUrl(_data.next);
      setPrevUrl(_data.previous);
    } catch (e) {
      console.log('Error while getting pokemon data by types :>> ', e);
    }

  }

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} items-center justify-center min-h-screen p-8 gap-16 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="container">
          <div className="flex flex-col sm:flex-row">
            <h2 className="mr-4 font-bold py-2">Types:</h2>
            <ul className="flex gap-4 flex-wrap w-full">
              {
                pokemonTypes?.map(type => (
                  <li key={`pokemonType_${type.name}`}>
                    <button
                      onClick={() => loadPokemonByTypes(type.name)}
                      className={`p-2 border-2 border-red-900 rounded-md font-bold  ${typeSelected.includes(type.name) ? 'bg-red-900 text-white' : 'text-red-900'}`}
                    >
                      {type.name}
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="mt-6">
            <h2 className="font-bold">{total} results found.</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-4">
            {
              data && data.length > 0 ? data.map(item => (
                <PokeView pokemon={item} key={item.name} />
              )) : null
            }
          </div>
          {
            total > 0 && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => loadMore(prevUrl)}
                  className="bg-red-900 text-white rounded-md p-2 mr-4 disabled:opacity-40"
                  disabled={!prevUrl}
                >
                  Prev
                </button>
                <button
                  onClick={() => loadMore(nextUrl)}
                  className="bg-red-900 text-white rounded-md p-2 disabled:opacity-40"
                  disabled={!nextUrl}
                >
                  Next
                </button>
              </div>
            )
          }
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const response = await Promise.all([
    fetch(`${process.env.POKEMON_API_URL}/pokemon?limit=48`),
    fetch(`${process.env.POKEMON_API_URL}/type/`)
  ]);
  const pokeResponse: IResponse<IPokemonLite> = await response[0].json();
  const typesOfPokeResponse: IResponse<ITypePokemon> = await response[1].json();

  return {
    props: {
      initialData: pokeResponse || null,
      pokemonTypes: typesOfPokeResponse.results || [],
    }
  }
}