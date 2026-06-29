import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TOP_DIVIDEND_TICKERS, fetchStockData, fetchDividendHistory } from "@/lib/yahoo";

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const refreshSecret = process.env.REFRESH_SECRET ?? "";

    if (!secret || !safeCompare(secret, refreshSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let updated = 0;
    for (const { ticker, region, exchange } of TOP_DIVIDEND_TICKERS) {
      const data = await fetchStockData(ticker);
      if (!data) {
        await sleep(300);
        continue;
      }

      const stock = await prisma.stock.upsert({
        where: { ticker },
        update: { ...data, region, exchange },
        create: { ticker, region, exchange, ...data },
      });

      const history = await fetchDividendHistory(ticker);
      if (history.length > 0) {
        await prisma.dividend.deleteMany({ where: { stockId: stock.id } });
        await prisma.dividend.createMany({
          data: history.map((d) => ({
            stockId: stock.id,
            amount: d.amount,
            currency: data.currency,
            exDate: new Date(d.exDate),
            frequency: d.frequency,
          })),
        });
      }

      updated++;
      await sleep(300);
    }

    return NextResponse.json({ updated });
  } catch (error) {
    console.error("[/api/refresh]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
