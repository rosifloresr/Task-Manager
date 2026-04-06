import { PrismaClient } from './client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('[Auth-Service] Iniciando seed de usuarios...');

  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password1243', 10);

  await prisma.user.create({
    data: {
      email: 'CIROFLORES.developer@apple.com',
      password: hashedPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('Seed de usuarios finalizado (Usuario: Ciro creado).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });