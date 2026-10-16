export type SolarEstimate = {
  recommendedKw: number;
  annualSavings: number;
  lifetimeSavings: number;
  solarBill: number;
  paybackYears: number;
  returnPercent: number;
};

export function calculateSolar(monthlyBill: number): SolarEstimate {
  if (!Number.isFinite(monthlyBill) || monthlyBill < 2500 || monthlyBill > 30000) {
    throw new RangeError('Please enter an amount between ₹2,500 and ₹30,000.');
  }
  const recommendedKw = Math.round((monthlyBill / 1769.23) * 10) / 10;
  const annualSavings = Math.round(monthlyBill * 6);
  const lifetimeSavings = annualSavings * 25;
  const solarBill = Math.round(monthlyBill * 0.05);
  const indicativeCost = recommendedKw * 34000;
  const paybackYears = Math.round((indicativeCost / annualSavings) * 10) / 10;
  const returnPercent = Math.round((annualSavings / indicativeCost) * 1000) / 10;
  return { recommendedKw, annualSavings, lifetimeSavings, solarBill, paybackYears, returnPercent };
}
