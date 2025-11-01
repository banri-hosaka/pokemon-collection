import { defineEventHandler, getQuery, createError } from "h3";
import prisma from "../../utils/prisma";

// ページネーション設定の定数
const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,        // デフォルトのページ番号
  DEFAULT_LIMIT: 20,      // デフォルトの1ページあたりの件数
  MAX_LIMIT: 100,         // 1ページあたりの最大件数（DoS攻撃防止）
  MIN_PAGE: 1,            // 最小ページ番号
  MIN_LIMIT: 1,           // 最小の1ページあたりの件数
} as const;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // ページとリミットのパラメータを取得してバリデーション
  const page = Math.max(
    PAGINATION_CONFIG.MIN_PAGE,
    parseInt(String(query.page || PAGINATION_CONFIG.DEFAULT_PAGE))
  );
  const limit = Math.min(
    PAGINATION_CONFIG.MAX_LIMIT,
    Math.max(
      PAGINATION_CONFIG.MIN_LIMIT,
      parseInt(String(query.limit || PAGINATION_CONFIG.DEFAULT_LIMIT))
    )
  );
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

    // ページネーション情報の計算
    const totalPages = Math.ceil(total / limit);

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
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > PAGINATION_CONFIG.MIN_PAGE,
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
