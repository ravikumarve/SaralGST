import { PrismaClient } from "../lib/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const email = process.env.SEED_EMAIL || "admin@saralgst.in";
const password = process.env.SEED_PASSWORD || "admin123";
const name = process.env.SEED_NAME || "Saral Admin";

const exists = await prisma.user.findUnique({ where: { email } });
if (exists) {
  console.log(`✓ User ${email} already exists`);
} else {
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
  console.log(`✓ Created admin user: ${user.email} / ${password}`);
  console.log(`  Tier: ${user.tier}, Role: ${user.role}`);
}

await prisma.$disconnect();
