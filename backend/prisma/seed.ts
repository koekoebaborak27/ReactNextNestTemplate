import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // テスト用ユーザーの作成
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      name: '管理者',
    },
  });

  // テスト用会社1の作成
  const company1 = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '株式会社地図太郎',
      address: '東京都千代田区1-1-1',
      contactName: '山田 太郎',
    },
  });

  // テスト用会社2の作成
  const company2 = await prisma.company.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: '有限会社マップ商事',
      address: '大阪府大阪市2-2-2',
      contactName: '鈴木 花子',
    },
  });

  // 会社1の契約データ（SQLiteはskipDuplicates非対応のため省略）
  await prisma.contract.createMany({
    data: [
      {
        companyId: company1.id,
        mapType: '道路地図',
        quantity: 1000,
        royaltyRate: '0.05',
      },
      {
        companyId: company1.id,
        mapType: '観光地図',
        quantity: 500,
        royaltyRate: '0.08',
      },
    ],
  });

  // 会社2の契約データ
  await prisma.contract.createMany({
    data: [
      {
        companyId: company2.id,
        mapType: '住宅地図',
        quantity: 2000,
        royaltyRate: '0.10',
      },
    ],
  });

  console.log('シードデータの投入が完了しました');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
