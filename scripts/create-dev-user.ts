import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // 開発用ユーザーの作成または取得
    const user = await prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        email: 'dev@example.com',
        name: '開発ユーザー',
      },
    });

    console.log('✅ 開発用ユーザーを作成/確認しました:', user);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();