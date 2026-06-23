import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TOP_DIVIDEND_TICKERS, fetchStockData } from "@/lib/yahoo";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (secret !== process.env.REFRESH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let updated = 0;
  for (const { ticker, region, exchange } of TOP_DIVIDEND_TICKERS) {
    const data = await fetchStockData(ticker);
    if (!data) continue;
    await prisma.stock.upsert({
      where: { ticker },
      update: { ...data, region, exchange },
      create: { ticker, region, exchange, ...data },
    });
    updated++;
  }

  return NextResponse.json({ updated });
}
