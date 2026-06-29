import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const stock = await prisma.stock.findUnique({
      where: { ticker: decodeURIComponent(ticker) },
      include: { dividends: { orderBy: { exDate: "desc" }, take: 10 } },
    });

    if (!stock) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(stock);
  } catch (error) {
    console.error("[GET /api/stocks/[ticker]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
