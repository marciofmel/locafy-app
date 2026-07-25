import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const email = process.argv[2];
const password = process.argv[3] || "123456";

if (!email) {
  console.log("Uso: node scripts/set-password.js email@exemplo.com [senha]");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const user = await prisma.user.update({ where: { email }, data: { password: hash } });
console.log(`Senha alterada para "${password}" — usuário: ${user.name} (${user.email})`);
await prisma.$disconnect();
