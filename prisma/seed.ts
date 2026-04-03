// prisma/seed.ts ni ganas de hacerlo, genere el seed con ia
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando seed (v6 Stable)...');

  await prisma.product.deleteMany();
  
  await prisma.product.createMany({
    data: [
      {
        name: 'iPhone 15 Pro',
        description: 'Titanium design, A17 Pro chip.',
        price: 999.00,
        stock: 50,
      },
      {
        name: 'MacBook Air M3',
        description: 'Thin, light, and powerful.',
        price: 1099.00,
        stock: 20,
      }
    ],
  });

  console.log(' Seed finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });