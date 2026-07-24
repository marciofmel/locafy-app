import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const email = process.argv[2];
if (!email) {
  console.log("Uso: node scripts/set-admin.js email@exemplo.com");
  process.exit(1);
}

const user = await prisma.user.update({ where: { email }, data: { role: "admin" } });
console.log(`✅ ${user.name} (${user.email}) agora é admin!`);
await prisma.$disconnect();
