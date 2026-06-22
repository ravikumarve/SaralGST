import "dotenv/config";
import { PrismaClient } from "../lib/prisma-gen/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Admin user ──
  const email = "admin@saralgst.in";
  const password = "admin123";

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const hashed = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        email,
        name: "Saral Admin",
        password: hashed,
        tier: "ca_firm",
        role: "admin",
      },
    });
    console.log(`✓ Created admin user: ${email} / ${password}`);
  } else {
    console.log(`✓ Admin user ${email} already exists`);
  }

  // ── Sample API Keys ──
  const existingKeys = await prisma.apiKey.count({ where: { userId: user.id } });
  if (existingKeys === 0) {
    await prisma.apiKey.createMany({
      data: [
        { key: "sg_prod_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p", label: "Production Server", tier: "paid", userId: user.id },
        { key: "sg_test_z9y8x7w6v5u4t3s2r1q0p9o8i7u6y5t", label: "Development / Testing", tier: "paid", userId: user.id, active: true },
        { key: "sg_old_00000000000000000000000000000000", label: "Deprecated Key", tier: "paid", userId: user.id, active: false },
      ],
    });
    console.log("✓ Created 3 sample API keys");
  }

  // ── Sample Favorites ──
  const existingFavs = await prisma.favorite.count({ where: { userId: user.id } });
  if (existingFavs === 0) {
    await prisma.favorite.createMany({
      data: [
        { hsnCode: "8528", label: "LED / LCD TVs", notes: "GST 2.0: 28% → 18%", userId: user.id },
        { hsnCode: "8517", label: "Mobile Phones", notes: "Unchanged at 18%", userId: user.id },
        { hsnCode: "2523", label: "Cement", notes: "GST 2.0: 28% → 18%", userId: user.id },
        { hsnCode: "3004", label: "Pharmaceuticals", notes: "Medicines — 12%", userId: user.id },
        { hsnCode: "6307", label: "Textiles / Readymade Garments", notes: "", userId: user.id },
      ],
    });
    console.log("✓ Created 5 sample favorites");
  }

  // ── Sample Usage Logs (last 14 days) ──
  const existingLogs = await prisma.usageLog.count({ where: { userId: user.id } });
  if (existingLogs === 0) {
    const queries = [
      { query: "LED TV", hsn: "8528", rate: 18 },
      { query: "cement", hsn: "2523", rate: 18 },
      { query: "mobile phone", hsn: "8517", rate: 18 },
      { query: "paracetamol", hsn: "3004", rate: 12 },
      { query: "readymade shirt", hsn: "6307", rate: 12 },
      { query: "wheat flour", hsn: "1101", rate: 0 },
      { query: "steel tmt bar", hsn: "7214", rate: 18 },
      { query: "soap", hsn: "3401", rate: 18 },
      { query: "laptop", hsn: "8471", rate: 18 },
      { query: "bicycle", hsn: "8712", rate: 12 },
    ];

    const logs: Array<{
      query: string;
      hsnCode: string;
      resultRate: number;
      success: boolean;
      source: string;
      userId: string;
      createdAt: Date;
    }> = [];

    // Generate 30 days of varied usage
    const now = new Date();
    for (let day = 29; day >= 0; day--) {
      // 2-5 lookups per day
      const count = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const q = queries[Math.floor(Math.random() * queries.length)];
        const date = new Date(now);
        date.setDate(date.getDate() - day);
        date.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));

        logs.push({
          query: q.query,
          hsnCode: q.hsn,
          resultRate: q.rate,
          success: Math.random() > 0.08, // 92% success rate
          source: Math.random() > 0.3 ? "web" : "api",
          userId: user.id,
          createdAt: date,
        });
      }
    }

    // Insert in batches of 50
    for (let i = 0; i < logs.length; i += 50) {
      await prisma.usageLog.createMany({ data: logs.slice(i, i + 50) });
    }
    console.log(`✓ Created ${logs.length} sample usage logs (30 days)`);
  }

  console.log("\n── Seed complete ──");
  console.log(`  Login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
