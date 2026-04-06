import { PrismaClient } from './client';

const prisma = new PrismaClient();

async function main() {
  console.log('[Products-Service] Iniciando seed de catálogo...');

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
      },
      {
        name: 'iPad Pro M4',
        description: 'The thinnest Apple product ever.',
        price: 999.00,
        stock: 15,
      }
    ],
  });

  console.log('Seed de productos finalizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });