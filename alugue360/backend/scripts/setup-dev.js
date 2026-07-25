import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const email = "guilherme.melo2017@gmail.com";
const password = "123456";

const hash = await bcrypt.hash(password, 10);
const user = await prisma.user.update({ where: { email }, data: { password: hash, role: "admin" } });
console.log(`Admin: ${user.name} (${user.email}) / senha: ${password}`);
await prisma.$disconnect();
