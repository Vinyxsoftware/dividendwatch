import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PortfolioClient } from "@/components/PortfolioClient";
import type { Stock } from "@/types/stock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Track your own dividend stock holdings and see your real annual and monthly dividend income. No account needed.",
  openGraph: {
    title: "My Portfolio — DividendWatch",
    description: "Track your own dividend stock holdings and see your real annual and monthly dividend income. No account needed.",
  },
};

export default async function PortfolioPage() {
  const stocks = (await prisma.stock.findMany({
    orderBy: { name: "asc" },
  })) as unknown as Stock[];

  return <PortfolioClient stocks={stocks} />;
}
