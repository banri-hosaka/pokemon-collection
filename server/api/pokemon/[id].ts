import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  try {
    // 基本情報の取得
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`
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
    let japaneseName = pokemon.name; // デフォルト値
    for (const name of species.names) {
      if (name.language.name === "ja-Hrkt" || name.language.name === "ja") {
        japaneseName = name.name;
        break;
      }
    }

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
