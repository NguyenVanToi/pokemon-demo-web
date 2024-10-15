"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

import ConfigService from "@/lib/config";
import { IPokemonLite } from "@/lib/interface";

type PokeViewProps = {
  pokemon: IPokemonLite
}

const PokeView = ({ pokemon }: PokeViewProps) => {

  const [poke, setPoke] = useState<IPokemonLite>(pokemon);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (pokemon.url) getPokeDetail(pokemon.url);
  }, [pokemon]);

  const getPokeDetail = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      setPoke({ ...poke, id: data.id });
    } catch (e) {
      console.log('Error while getting poke data :>> ', e);
    } finally {
      setIsLoading(false);
    }
  }

  return poke && poke.name ? (
    <div className="flex flex-col items-center">
      <div className={`h-24 w-24 ${isLoading ? 'bg-gray-200' : ''}`}>
        {
          poke.id && <Image src={`${ConfigService.getBaseUrlPokeImage()}/${poke.id}.png`} width={100} height={100} alt={poke.name} />
        }
      </div>

      <span className="mt-1">{poke.name}</span>
    </div>
  ) : null
}

export default PokeView;