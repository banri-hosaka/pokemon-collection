import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

// ポケモンの世代情報
const GENERATION_RANGES = {
  1: { start: 1, end: 151 }, // カントー地方
  2: { start: 152, end: 251 }, // ジョウト地方
  3: { start: 252, end: 386 }, // ホウエン地方
  4: { start: 387, end: 493 }, // シンオウ地方
  5: { start: 494, end: 649 }, // イッシュ地方
  6: { start: 650, end: 721 }, // カロス地方
  7: { start: 722, end: 809 }, // アローラ地方
  8: { start: 810, end: 905 }, // ガラル地方
  9: { start: 906, end: 1025 }, // パルデア地方
};

// レート制限用の遅延関数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 世代を計算する関数
function getGeneration(pokemonId: number): number {
  for (const [gen, range] of Object.entries(GENERATION_RANGES)) {
    if (pokemonId >= range.start && pokemonId <= range.end) {
      return parseInt(gen);
    }
  }
  return 9; // デフォルトは最新世代
}

// 単一のポケモンデータを取得してDBに保存
async function seedPokemon(id: number): Promise<void> {
  try {
    console.log(`[${id}] データ取得中...`);

    // 基本情報の取得
    const pokemonResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );
    const pokemon = pokemonResponse.data;

    // 種族情報の取得（日本語名を含む）
    const speciesResponse = await axios.get(pokemon.species.url);
    const species = speciesResponse.data;

    // 日本語名の取得
    let japaneseName = pokemon.name;
    for (const name of species.names) {
      if (name.language.name === "ja-Hrkt" || name.language.name === "ja") {
        japaneseName = name.name;
        break;
      }
    }

    // データベースに保存
    await prisma.pokemon.upsert({
      where: { id },
      update: {
        name: pokemon.name,
        japaneseName,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types,
        stats: pokemon.stats,
        spriteUrl: pokemon.sprites.front_default || "",
        generation: getGeneration(id),
      },
      create: {
        id,
        name: pokemon.name,
        japaneseName,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types,
        stats: pokemon.stats,
        spriteUrl: pokemon.sprites.front_default || "",
        generation: getGeneration(id),
      },
    });

    console.log(`[${id}] ✅ ${japaneseName} (${pokemon.name}) を保存しました`);
  } catch (error) {
    console.error(
      `[${id}] ❌ エラー:`,
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}

// メイン処理
async function main() {
  console.log("🚀 ポケモンデータの初期投入を開始します...");

  // コマンドライン引数から世代を取得（デフォルトは第1世代）
  const generation = parseInt(process.argv[2]) || 1;
  const range = GENERATION_RANGES[generation as keyof typeof GENERATION_RANGES];

  if (!range) {
    console.error("❌ 無効な世代番号です（1-9を指定してください）");
    process.exit(1);
  }

  console.log(
    `📊 第${generation}世代（No.${range.start}〜${range.end}）のデータを投入します`
  );

  let successCount = 0;
  let errorCount = 0;

  for (let i = range.start; i <= range.end; i++) {
    try {
      await seedPokemon(i);
      successCount++;

      // レート制限対策：200ms待機
      await delay(200);
    } catch (_error) {
      errorCount++;
      console.error(`ポケモンID ${i} の処理中にエラーが発生しました`);

      // エラーが多い場合は中断
      if (errorCount > 10) {
        console.error("❌ エラーが多発しているため処理を中断します");
        break;
      }
    }
  }

  console.log("\n📊 処理完了:");
  console.log(`✅ 成功: ${successCount}件`);
  console.log(`❌ 失敗: ${errorCount}件`);
}

// 実行
main()
  .catch((e) => {
    console.error("致命的なエラー:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
