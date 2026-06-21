import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SQLite database...");

  await db.metric.deleteMany();
  await db.board.deleteMany();
  await db.account.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();

  const hash = await bcrypt.hash("password123", 12);
  const user = await db.user.create({
    data: { name: "Demo User", email: "demo@pulseboard.dev", passwordHash: hash },
  });
  console.log("✅ User:", user.email);

  const now = new Date();
  const w = (n) => new Date(now.getTime() - n * 7 * 24 * 60 * 60 * 1000);

  const b1 = await db.board.create({
    data: {
      name: "Product Metrics",
      description: "Key product KPIs tracked weekly",
      isPublic: true,
      ownerId: user.id,
    },
  });

  await db.metric.createMany({
    data: [
      { boardId: b1.id, name: "Daily Active Users", value: 1240, unit: "users", timestamp: w(6) },
      { boardId: b1.id, name: "Daily Active Users", value: 1380, unit: "users", timestamp: w(5) },
      { boardId: b1.id, name: "Daily Active Users", value: 1520, unit: "users", timestamp: w(4) },
      { boardId: b1.id, name: "Daily Active Users", value: 1620, unit: "users", timestamp: w(2) },
      { boardId: b1.id, name: "Daily Active Users", value: 1930, unit: "users", timestamp: now },
      { boardId: b1.id, name: "Revenue",            value: 12400, unit: "USD",   timestamp: w(4) },
      { boardId: b1.id, name: "Revenue",            value: 15800, unit: "USD",   timestamp: w(2) },
      { boardId: b1.id, name: "Revenue",            value: 19200, unit: "USD",   timestamp: now },
      { boardId: b1.id, name: "Conversion Rate",    value: 3.2,   unit: "%",     timestamp: w(4) },
      { boardId: b1.id, name: "Conversion Rate",    value: 3.8,   unit: "%",     timestamp: w(2) },
      { boardId: b1.id, name: "Conversion Rate",    value: 4.1,   unit: "%",     timestamp: now },
    ],
  });
  console.log("✅ Board:", b1.name, "| share token:", b1.shareToken);

  const b2 = await db.board.create({
    data: {
      name: "Infrastructure Health",
      description: "Server performance metrics",
      isPublic: false,
      ownerId: user.id,
    },
  });

  await db.metric.createMany({
    data: [
      { boardId: b2.id, name: "CPU Usage",   value: 45,  unit: "%",  timestamp: w(2) },
      { boardId: b2.id, name: "CPU Usage",   value: 52,  unit: "%",  timestamp: w(1) },
      { boardId: b2.id, name: "CPU Usage",   value: 38,  unit: "%",  timestamp: now  },
      { boardId: b2.id, name: "p99 Latency", value: 245, unit: "ms", timestamp: w(2) },
      { boardId: b2.id, name: "p99 Latency", value: 198, unit: "ms", timestamp: w(1) },
      { boardId: b2.id, name: "p99 Latency", value: 187, unit: "ms", timestamp: now  },
      { boardId: b2.id, name: "Error Rate",  value: 0.8, unit: "%",  timestamp: w(2) },
      { boardId: b2.id, name: "Error Rate",  value: 0.3, unit: "%",  timestamp: now  },
    ],
  });
  console.log("✅ Board:", b2.name);

  console.log("\n🎉 Seed complete!");
  console.log("   Login: demo@pulseboard.dev / password123");
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
