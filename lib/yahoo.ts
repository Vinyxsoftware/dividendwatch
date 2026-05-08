// eslint-disable-next-line @typescript-eslint/no-require-imports
const YahooFinance = require("yahoo-finance2").default;
import { calcSustainability } from "./calculations";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey", "ripHistorical"] });

export const TOP_DIVIDEND_TICKERS: { ticker: string; region: string; exchange: string }[] = [
  // Schweiz
  { ticker: "NESN.SW", region: "CH", exchange: "SIX" },
  { ticker: "NOVN.SW", region: "CH", exchange: "SIX" },
  { ticker: "ROG.SW",  region: "CH", exchange: "SIX" },
  { ticker: "UBSG.SW", region: "CH", exchange: "SIX" },
  { ticker: "ZURN.SW", region: "CH", exchange: "SIX" },
  { ticker: "SREN.SW", region: "CH", exchange: "SIX" },
  // Europa
  { ticker: "ALV.DE",  region: "EU", exchange: "XETRA" },
  { ticker: "BAYN.DE", region: "EU", exchange: "XETRA" },
  { ticker: "MUV2.DE", region: "EU", exchange: "XETRA" },
  { ticker: "SIE.DE",  region: "EU", exchange: "XETRA" },
  { ticker: "SAP.DE",  region: "EU", exchange: "XETRA" },
  { ticker: "BAS.DE",  region: "EU", exchange: "XETRA" },
  { ticker: "DTE.DE",  region: "EU", exchange: "XETRA" },
  { ticker: "ASML.AS", region: "EU", exchange: "AMS" },
  { ticker: "SHELL.AS",region: "EU", exchange: "AMS" },
  { ticker: "TTE.PA",  region: "EU", exchange: "EPA" },
  // USA
  { ticker: "JNJ",     region: "US", exchange: "NYSE" },
  { ticker: "PG",      region: "US", exchange: "NYSE" },
  { ticker: "KO",      region: "US", exchange: "NYSE" },
  { ticker: "PEP",     region: "US", exchange: "NASDAQ" },
  { ticker: "MCD",     region: "US", exchange: "NYSE" },
  { ticker: "T",       region: "US", exchange: "NYSE" },
  { ticker: "VZ",      region: "US", exchange: "NYSE" },
  { ticker: "XOM",     region: "US", exchange: "NYSE" },
  { ticker: "CVX",     region: "US", exchange: "NYSE" },
  { ticker: "ABBV",    region: "US", exchange: "NYSE" },
  { ticker: "MMM",     region: "US", exchange: "NYSE" },
  { ticker: "IBM",     region: "US", exchange: "NYSE" },
  { ticker: "O",       region: "US", exchange: "NYSE" },
  { ticker: "MAIN",    region: "US", exchange: "NYSE" },
];

export const GROWTH_TICKERS: { ticker: string; region: string; exchange: string }[] = [
  { ticker: "NVDA",   region: "US", exchange: "NASDAQ" },
  { ticker: "MSFT",   region: "US", exchange: "NASDAQ" },
  { ticker: "AMZN",   region: "US", exchange: "NASDAQ" },
  { ticker: "META",   region: "US", exchange: "NASDAQ" },
  { ticker: "GOOGL",  region: "US", exchange: "NASDAQ" },
  { ticker: "TSLA",   region: "US", exchange: "NASDAQ" },
  { ticker: "ADBE",   region: "US", exchange: "NASDAQ" },
  { ticker: "CRM",    region: "US", exchange: "NYSE"   },
  { ticker: "SHOP",   region: "US", exchange: "NYSE"   },
  { ticker: "NFLX",   region: "US", exchange: "NASDAQ" },
  { ticker: "NOVO-B.CO", region: "EU", exchange: "CPH" },
  { ticker: "AIR.PA",    region: "EU", exchange: "EPA" },
  { ticker: "MC.PA",     region: "EU", exchange: "EPA" },
  { ticker: "LONN.SW",   region: "CH", exchange: "SIX" },
];

function detectFrequency(dates: Date[]): string {
  if (dates.length < 2) return "annual";
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const gaps: number[] = [];
  for (let i = 1; i < Math.min(sorted.length, 6); i++) {
    gaps.push((sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24));
  }
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  if (avg < 45) return "monthly";
  if (avg < 120) return "quarterly";
  if (avg < 240) return "semi-annual";
  return "annual";
}

export async function fetchDividendHistory(ticker: string) {
  try {
    const result = await yahooFinance.chart(
      ticker,
      { period1: "2014-01-01", period2: new Date(), events: "div", interval: "1mo" },
      { validateResult: false }
    );
    const divMap = result?.events?.dividends ?? {};
    const divs: { date: Date; amount: number }[] = Object.values(divMap).map(
      (d: unknown) => ({ date: new Date((d as { date: string }).date), amount: (d as { amount: number }).amount })
    );
    if (divs.length === 0) return [];
    const frequency = detectFrequency(divs.map((d) => d.date));
    return divs.map((d) => ({ exDate: d.date, amount: d.amount, frequency }));
  } catch {
    return [];
  }
}

export async function fetchStockData(ticker: string) {
  try {
    const quote = await yahooFinance.quote(ticker, {}, { validateResult: false });
    const summary = await yahooFinance.quoteSummary(ticker, {
      modules: ["summaryDetail", "defaultKeyStatistics", "financialData"],
    }, { validateResult: false });

    const detail = summary.summaryDetail;
    const stats = summary.defaultKeyStatistics;
    const financial = summary.financialData;

    const dividendYield = detail?.dividendYield ? detail.dividendYield * 100 : null;
    const annualDividend = detail?.dividendRate ?? null;
    const payoutRatio = detail?.payoutRatio ? detail.payoutRatio * 100 : null;
    const peRatio = detail?.trailingPE ?? stats?.trailingEps ?? null;
    const beta = detail?.beta ?? null;
    const dividendGrowth3Y: number | null = null; // requires historical data
    const sustainabilityStatus = calcSustainability(payoutRatio, dividendGrowth3Y);

    return {
      name: quote.longName ?? quote.shortName ?? ticker,
      currency: quote.currency ?? "USD",
      currentPrice: quote.regularMarketPrice ?? null,
      marketCap: quote.marketCap ?? null,
      peRatio: typeof peRatio === "number" ? peRatio : null,
      beta: typeof beta === "number" ? beta : null,
      payoutRatio,
      dividendYield,
      annualDividend,
      dividendGrowth3Y,
      epsGrowth: financial?.earningsGrowth ? financial.earningsGrowth * 100 : null,
      freeCashFlowYield: null,
      debtToEquity: financial?.debtToEquity ?? null,
      sustainabilityStatus,
    };
  } catch {
    return null;
  }
}
