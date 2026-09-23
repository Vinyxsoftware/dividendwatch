import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Holding {
  ticker: string;
  shares: number;
}

interface PortfolioState {
  holdings: Holding[];
  addHolding: (ticker: string, shares: number) => void;
  removeHolding: (ticker: string) => void;
  updateShares: (ticker: string, shares: number) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      holdings: [],
      addHolding: (ticker, shares) =>
        set((state) => {
          const existing = state.holdings.find((h) => h.ticker === ticker);
          if (existing) {
            return {
              holdings: state.holdings.map((h) =>
                h.ticker === ticker ? { ...h, shares: h.shares + shares } : h
              ),
            };
          }
          return { holdings: [...state.holdings, { ticker, shares }] };
        }),
      removeHolding: (ticker) =>
        set((state) => ({ holdings: state.holdings.filter((h) => h.ticker !== ticker) })),
      updateShares: (ticker, shares) =>
        set((state) => ({
          holdings: state.holdings.map((h) => (h.ticker === ticker ? { ...h, shares } : h)),
        })),
    }),
    { name: "dividendwatch-portfolio" }
  )
);
