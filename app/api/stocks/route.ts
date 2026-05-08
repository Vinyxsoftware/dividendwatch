import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const sector = searchParams.get("sector");
  const sort = searchParams.get("sort") ?? "dividendYield";

  const stocks = await prisma.stock.findMany({
    where: {
      ...(region && region !== "all" ? { region } : {}),
      ...(sector && sector !== "all" ? { sector } : {}),
      dividendYield: { not: null },
    },
    orderBy: sort === "dividendYield"
      ? { dividendYield: "desc" }
      : sort === "price"
      ? { currentPrice: "asc" }
      : { marketCap: "desc" },
  });

  return NextResponse.json(stocks);
}
