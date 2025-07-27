import { defineEventHandler, readBody, createError } from "h3";
import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const method = event.node.req.method;

  // 存在確認
  const existingEntry = await prisma.pokemonCollection.findUnique({
    where: { id },
  });

  if (!existingEntry) {
    throw createError({
      statusCode: 404,
      message: "コレクションエントリーが見つかりません",
    });
  }

  // PUT: 更新
  if (method === "PUT") {
    try {
      const body = await readBody(event);
      const { nickname, memo, isFavorite } = body;

      const updatedEntry = await prisma.pokemonCollection.update({
        where: { id },
        data: {
          nickname: nickname !== undefined ? nickname : existingEntry.nickname,
          memo: memo !== undefined ? memo : existingEntry.memo,
          isFavorite:
            isFavorite !== undefined ? isFavorite : existingEntry.isFavorite,
        },
      });

      return updatedEntry;
    } catch (_error) {
      throw createError({
        statusCode: 500,
        message: "更新中にエラーが発生しました",
      });
    }
  }

  // DELETE: 削除
  if (method === "DELETE") {
    try {
      await prisma.pokemonCollection.delete({
        where: { id },
      });

      setResponseStatus(event, 204);
      return null;
    } catch (_error) {
      throw createError({
        statusCode: 500,
        message: "削除中にエラーが発生しました",
      });
    }
  }

  throw createError({
    statusCode: 405,
    message: "Method Not Allowed",
  });
});
