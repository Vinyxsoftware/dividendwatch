-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isin" TEXT,
    "exchange" TEXT NOT NULL,
    "sector" TEXT,
    "country" TEXT,
    "region" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "currentPrice" DOUBLE PRECISION,
    "marketCap" DOUBLE PRECISION,
    "peRatio" DOUBLE PRECISION,
    "beta" DOUBLE PRECISION,
    "payoutRatio" DOUBLE PRECISION,
    "dividendYield" DOUBLE PRECISION,
    "annualDividend" DOUBLE PRECISION,
    "dividendGrowth3Y" DOUBLE PRECISION,
    "epsGrowth" DOUBLE PRECISION,
    "freeCashFlowYield" DOUBLE PRECISION,
    "debtToEquity" DOUBLE PRECISION,
    "sustainabilityStatus" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dividend" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exDate" TIMESTAMP(3) NOT NULL,
    "payDate" TIMESTAMP(3),
    "frequency" TEXT NOT NULL,
    "yield" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dividend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceSnapshot" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_ticker_key" ON "Stock"("ticker");

-- AddForeignKey
ALTER TABLE "Dividend" ADD CONSTRAINT "Dividend_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
