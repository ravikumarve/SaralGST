import "dotenv/config";
import { PrismaClient } from "../lib/prisma-gen/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@saralgst.in";
  const password = "admin123";
  const name = "Saral Admin";

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log(`✓ User ${email} already exists`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashed,
      tier: "ca_firm",
      role: "admin",
    },
  });

  console.log(`✓ Created admin user:`);
  console.log(`  Email: ${user.email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Tier: ${user.tier}`);
  console.log(`  Role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
