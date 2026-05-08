import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { TOP_DIVIDEND_TICKERS, GROWTH_TICKERS, fetchStockData, fetchDividendHistory } from "../lib/yahoo";

const url = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter } as never);

async function seedList(
  list: { ticker: string; region: string; exchange: string }[],
  label: string
) {
  console.log(`\n── ${label} (${list.length}) ──`);
  for (const { ticker, region, exchange } of list) {
    process.stdout.write(`  → ${ticker.padEnd(14)}`);
    const data = await fetchStockData(ticker);
    if (!data) { console.log("SKIP"); continue; }

    const stock = await prisma.stock.upsert({
      where: { ticker },
      update: { ...data, region, exchange },
      create: { ticker, region, exchange, ...data },
    });

    // Seed dividend history
    const history = await fetchDividendHistory(ticker);
    if (history.length > 0) {
      await prisma.dividend.deleteMany({ where: { stockId: stock.id } });
      await prisma.dividend.createMany({
        data: history.map((d: { exDate: Date; amount: number; frequency: string }) => ({
          stockId: stock.id,
          amount: d.amount,
          currency: data.currency,
          exDate: new Date(d.exDate),
          frequency: d.frequency,
        })),
      });
    }

    console.log(`${data.name.slice(0, 40).padEnd(40)} | ${data.dividendYield?.toFixed(2)?.padStart(5) ?? "  —  "}% | ${history.length} div records`);
    await new Promise((r) => setTimeout(r, 350));
  }
}

async function main() {
  await seedList(TOP_DIVIDEND_TICKERS, "Dividendenaktien");
  await seedList(GROWTH_TICKERS, "Wachstumsaktien");
  console.log("\n✓ Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
