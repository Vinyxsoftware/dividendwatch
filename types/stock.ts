export type SustainabilityStatus = "green" | "yellow" | "red";

export interface Stock {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  sector: string | null;
  region: string | null;
  currency: string;
  currentPrice: number | null;
  marketCap: number | null;
  peRatio: number | null;
  beta: number | null;
  payoutRatio: number | null;
  dividendYield: number | null;
  annualDividend: number | null;
  dividendGrowth3Y: number | null;
  sustainabilityStatus: SustainabilityStatus | null;
  debtToEquity: number | null;
  epsGrowth: number | null;
  freeCashFlowYield: number | null;
}
