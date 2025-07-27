import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 保存されたポケモンの総数
  const count = await prisma.pokemon.count();
  console.log(`\n📊 保存されたポケモン総数: ${count}匹`);

  // 世代別の内訳
  const generationCounts = await prisma.pokemon.groupBy({
    by: ["generation"],
    _count: true,
    orderBy: {
      generation: "asc",
    },
  });

  console.log("\n🎮 世代別内訳:");
  generationCounts.forEach((gen) => {
    console.log(`  第${gen.generation}世代: ${gen._count}匹`);
  });

  // サンプルデータの表示
  const samplePokemons = await prisma.pokemon.findMany({
    take: 5,
    orderBy: {
      id: "asc",
    },
  });

  console.log("\n🔍 サンプルデータ:");
  samplePokemons.forEach((pokemon) => {
    const types = pokemon.types as { type: { name: string } }[];
    const typeNames = types.map((t) => t.type.name).join("/");
    console.log(
      `  ${pokemon.id}: ${pokemon.japaneseName} (${pokemon.name}) - タイプ: ${typeNames}`
    );
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
