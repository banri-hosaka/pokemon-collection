import { defineEventHandler, readBody, getQuery, createError } from "h3";
import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  // GET: コレクション一覧取得
  if (method === "GET") {
    const query = getQuery(event);
    const userId = Number(query.userId) || 1; // 開発用に仮のユーザーID

    try {
      const collection = await prisma.pokemonCollection.findMany({
        where: { userId },
        orderBy: { pokemonId: "asc" },
      });
      return collection;
    } catch (error) {
      if (error instanceof Error) {
        if ("code" in error && error.code === 500) {
          throw createError({
            statusCode: 500,
            message: "コレクション取得中にエラーが発生しました",
          });
        }
      }
    }
  }

  // POST: コレクションに追加
  if (method === "POST") {
    try {
      const body = await readBody(event);

      const { pokemonId, nickname, memo, userId = 1 } = body;

      if (!pokemonId) {
        throw createError({
          statusCode: 400,
          message: "ポケモンIDは必須です",
        });
      }

      const newEntry = await prisma.pokemonCollection.create({
        data: {
          pokemonId: Number(pokemonId),
          nickname: nickname || null,
          memo: memo || null,
          userId: Number(userId),
        },
      });

      setResponseStatus(event, 201);
      return newEntry;
    } catch (error) {
      if (error instanceof Error) {
        if ("code" in error && error.code === "P2002") {
          throw createError({
            statusCode: 409,
            message: "このポケモンはすでにコレクションに追加されています",
          });
        }

        throw createError({
          statusCode:
            "statusCode" in error && typeof error.statusCode === "number"
              ? error.statusCode
              : 500,
          message:
            error instanceof Error
              ? error.message
              : "ポケモン追加中にエラーが発生しました",
        });
      }
    }
  }
});
