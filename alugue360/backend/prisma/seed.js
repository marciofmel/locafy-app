import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
  { name: "Casas", slug: "casas", icon: "🏠" },
  { name: "Carros", slug: "carros", icon: "🚗" },
  { name: "Motos", slug: "motos", icon: "🏍️" },
  { name: "Ranchos", slug: "ranchos", icon: "🌳" },
  { name: "Salões de Festa", slug: "saloes", icon: "🎉" },
];

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categorias criadas");
}

main().catch(console.error).finally(() => prisma.$disconnect());
