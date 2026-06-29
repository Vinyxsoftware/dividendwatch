export function calcSustainability(payoutRatio: number | null, dividendGrowth3Y: number | null): "green" | "yellow" | "red" {
  if (dividendGrowth3Y !== null && dividendGrowth3Y < 0) return "red";
  if (payoutRatio === null) return "yellow";
  if (payoutRatio > 85) return "red";
  if (payoutRatio > 60 || dividendGrowth3Y === null || dividendGrowth3Y === 0) return "yellow";
  return "green";
}
