const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const u of users) {
    if (u.display_name && (u.display_name.includes("(Google)") || u.display_name.includes("(gg)"))) {
      const cleanName = u.display_name.replace(/\s*\((?:Google|gg|GG)\)/i, "").trim();
      await prisma.user.update({
        where: { id: u.id },
        data: { display_name: cleanName },
      });
      console.log(`Updated user ${u.id}: "${u.display_name}" -> "${cleanName}"`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

