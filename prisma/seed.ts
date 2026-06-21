import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // Clean slate
  await db.metric.deleteMany();
  await db.board.deleteMany();
  await db.account.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();

  // Demo user
  const passwordHash = await bcrypt.hash("password123", 12);
  const user = await db.user.create({
    data: {
      name: "Demo User",
      email: "demo@pulseboard.dev",
      passwordHash,
    },
  });
  console.log(`  Created user: ${user.email}`);

  // Board 1: Product Metrics (public)
  const board1 = await db.board.create({
    data: {
      name: "Product Metrics",
      description: "Key product KPIs tracked weekly",
      isPublic: true,
      ownerId: user.id,
    },
  });

  const now = new Date();
  const weekAgo = (n: number) =>
    new Date(now.getTime() - n * 7 * 24 * 60 * 60 * 1000);

  await db.metric.createMany({
    data: [
      { boardId: board1.id, name: "Daily Active Users", value: 1240, unit: "users", timestamp: weekAgo(6) },
      { boardId: board1.id, name: "Daily Active Users", value: 1380, unit: "users", timestamp: weekAgo(5) },
      { boardId: board1.id, name: "Daily Active Users", value: 1520, unit: "users", timestamp: weekAgo(4) },
      { boardId: board1.id, name: "Daily Active Users", value: 1490, unit: "users", timestamp: weekAgo(3) },
      { boardId: board1.id, name: "Daily Active Users", value: 1620, unit: "users", timestamp: weekAgo(2) },
      { boardId: board1.id, name: "Daily Active Users", value: 1780, unit: "users", timestamp: weekAgo(1) },
      { boardId: board1.id, name: "Daily Active Users", value: 1930, unit: "users", timestamp: now },

      { boardId: board1.id, name: "Conversion Rate", value: 3.2, unit: "%", timestamp: weekAgo(6) },
      { boardId: board1.id, name: "Conversion Rate", value: 3.5, unit: "%", timestamp: weekAgo(4) },
      { boardId: board1.id, name: "Conversion Rate", value: 3.8, unit: "%", timestamp: weekAgo(2) },
      { boardId: board1.id, name: "Conversion Rate", value: 4.1, unit: "%", timestamp: now },

      { boardId: board1.id, name: "Avg Session (s)", value: 142, unit: "s", timestamp: weekAgo(4) },
      { boardId: board1.id, name: "Avg Session (s)", value: 158, unit: "s", timestamp: weekAgo(2) },
      { boardId: board1.id, name: "Avg Session (s)", value: 165, unit: "s", timestamp: now },

      { boardId: board1.id, name: "Revenue", value: 12400, unit: "USD", timestamp: weekAgo(4) },
      { boardId: board1.id, name: "Revenue", value: 15800, unit: "USD", timestamp: weekAgo(2) },
      { boardId: board1.id, name: "Revenue", value: 19200, unit: "USD", timestamp: now },
    ],
  });
  console.log(`  Created board: ${board1.name} (public, share token: ${board1.shareToken})`);

  // Board 2: Infrastructure (private)
  const board2 = await db.board.create({
    data: {
      name: "Infrastructure Health",
      description: "Server performance metrics",
      isPublic: false,
      ownerId: user.id,
    },
  });

  await db.metric.createMany({
    data: [
      { boardId: board2.id, name: "CPU Usage", value: 45, unit: "%", timestamp: weekAgo(2) },
      { boardId: board2.id, name: "CPU Usage", value: 52, unit: "%", timestamp: weekAgo(1) },
      { boardId: board2.id, name: "CPU Usage", value: 38, unit: "%", timestamp: now },

      { boardId: board2.id, name: "Memory Usage", value: 68, unit: "%", timestamp: weekAgo(2) },
      { boardId: board2.id, name: "Memory Usage", value: 71, unit: "%", timestamp: weekAgo(1) },
      { boardId: board2.id, name: "Memory Usage", value: 65, unit: "%", timestamp: now },

      { boardId: board2.id, name: "p99 Latency", value: 245, unit: "ms", timestamp: weekAgo(2) },
      { boardId: board2.id, name: "p99 Latency", value: 198, unit: "ms", timestamp: weekAgo(1) },
      { boardId: board2.id, name: "p99 Latency", value: 187, unit: "ms", timestamp: now },

      { boardId: board2.id, name: "Error Rate", value: 0.8, unit: "%", timestamp: weekAgo(2) },
      { boardId: board2.id, name: "Error Rate", value: 0.5, unit: "%", timestamp: weekAgo(1) },
      { boardId: board2.id, name: "Error Rate", value: 0.3, unit: "%", timestamp: now },
    ],
  });
  console.log(`  Created board: ${board2.name} (private)`);

  console.log("\n✅ Seed complete!");
  console.log("   Login: demo@pulseboard.dev / password123");
  console.log(`   Public share: /share/${board1.shareToken}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
