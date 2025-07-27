import { defineEventHandler, createError } from "h3";
import prisma from "../../utils/prisma";

// 世代を計算する関数
function getGeneration(pokemonId: number): number {
  const GENERATION_RANGES = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 },
    6: { start: 650, end: 721 },
    7: { start: 722, end: 809 },
    8: { start: 810, end: 905 },
    9: { start: 906, end: 1025 },
  };
  
  for (const [gen, range] of Object.entries(GENERATION_RANGES)) {
    if (pokemonId >= range.start && pokemonId <= range.end) {
      return parseInt(gen);
    }
  }
  return 9;
}

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const pokemonId = parseInt(id as string);

  if (isNaN(pokemonId)) {
    throw createError({
      statusCode: 400,
      message: "無効なポケモンIDです",
    });
  }

  try {
    // まずDBから取得を試みる
    const cachedPokemon = await prisma.pokemon.findUnique({
      where: { id: pokemonId },
    });

    if (cachedPokemon) {
      console.log(`[Cache Hit] ポケモンID ${pokemonId} をDBから取得`);
      
      // DBのデータをAPIレスポンス形式に変換
      return {
        id: cachedPokemon.id,
        name: cachedPokemon.name,
        japaneseName: cachedPokemon.japaneseName,
        height: cachedPokemon.height,
        weight: cachedPokemon.weight,
        sprites: {
          front_default: cachedPokemon.spriteUrl,
        },
        types: cachedPokemon.types,
        stats: cachedPokemon.stats,
      };
    }

    // DBにない場合はPokeAPIから取得
    console.log(`[Cache Miss] ポケモンID ${pokemonId} をPokeAPIから取得`);
    
    // 基本情報の取得
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    if (!pokemonResponse.ok) {
      throw createError({
        statusCode: pokemonResponse.status,
        message: `ポケモン情報の取得に失敗しました`,
      });
    }
    const pokemon = await pokemonResponse.json();

    // 日本語名を含む種族情報の取得
    const speciesResponse = await fetch(pokemon.species.url);
    if (!speciesResponse.ok) {
      throw createError({
        statusCode: speciesResponse.status,
        message: `ポケモン種族情報の取得に失敗しました`,
      });
    }
    const species = await speciesResponse.json();

    // 日本語名の取得
    let japaneseName = pokemon.name;
    for (const name of species.names) {
      if (name.language.name === "ja-Hrkt" || name.language.name === "ja") {
        japaneseName = name.name;
        break;
      }
    }

    // 取得したデータをDBに保存（非同期で実行）
    prisma.pokemon.create({
      data: {
        id: pokemon.id,
        name: pokemon.name,
        japaneseName,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types,
        stats: pokemon.stats,
        spriteUrl: pokemon.sprites.front_default || "",
        generation: getGeneration(pokemon.id),
      },
    }).then(() => {
      console.log(`✅ ポケモンID ${pokemon.id} をDBに保存しました`);
    }).catch((error) => {
      console.error(`❌ ポケモンID ${pokemon.id} の保存に失敗:`, error);
    });

    return {
      id: pokemon.id,
      name: pokemon.name,
      japaneseName,
      height: pokemon.height,
      weight: pokemon.weight,
      sprites: pokemon.sprites,
      types: pokemon.types,
      stats: pokemon.stats,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw createError({
        statusCode:
          "statusCode" in error
            ? (error as { statusCode: number }).statusCode
            : 500,
        message: error.message || "サーバーエラーが発生しました",
      });
    }
  }
});
