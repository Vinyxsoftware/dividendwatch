import type { Metadata } from "next";
import { SimulatorClient } from "./SimulatorClient";

export const metadata: Metadata = {
  title: "DRIP Savings Plan Simulator",
  description: "Model dividend reinvestment over up to 40 years. See how compounding turns monthly contributions into real passive income.",
  openGraph: {
    title: "DRIP Savings Plan Simulator — DividendWatch",
    description: "Model dividend reinvestment over up to 40 years. See how compounding turns monthly contributions into real passive income.",
  },
};

export default function SimulatorPage() {
  return <SimulatorClient />;
}
