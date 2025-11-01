import { defineEventHandler, getQuery, createError } from "h3";
import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // ページとリミットのパラメータを取得（デフォルト: page=1, limit=20）
  const page = Math.max(1, parseInt(String(query.page || "1")));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || "20"))));
  const offset = (page - 1) * limit;

  try {
    // データベースから並列でポケモンリストと総数を取得
    const [pokemons, total] = await Promise.all([
      prisma.pokemon.findMany({
        skip: offset,
        take: limit,
        orderBy: { id: "asc" },
      }),
      prisma.pokemon.count(),
    ]);

    console.log(
      `[Pagination API] ページ ${page}: ${pokemons.length}件のポケモンを取得 (total: ${total})`
    );

    // 既存のAPIレスポンス形式と互換性を持たせるためのデータ変換
    return {
      data: pokemons.map((p) => ({
        id: p.id,
        name: p.name,
        japaneseName: p.japaneseName,
        height: p.height,
        weight: p.weight,
        sprites: {
          front_default: p.spriteUrl,
        },
        types: p.types,
        stats: p.stats,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("[Pagination API] エラー:", error);
    throw createError({
      statusCode: 500,
      message: "ポケモンリストの取得に失敗しました",
    });
  }
});
