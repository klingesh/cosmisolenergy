import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const context: Record<string, unknown> = {};
runInNewContext(readFileSync('public/legacy/calculator.js', 'utf8'), context);
const calculator = context.CosmisolCalculator as {
  averageEnteredBills(values: Array<number | string | null>): number | null;
  calculateDomesticBill(units: number): number;
  estimateResidential(input: Record<string, unknown>): Record<string, number>;
  estimateCommercial(input: Record<string, unknown>): Record<string, number>;
  estimateIndustrial(input: Record<string, unknown>): Record<string, number>;
};

describe('Cosmisol calculator engine', () => {
  it('averages only entered bi-monthly residential bills', () => {
    expect(calculator.averageEnteredBills([600, '', null, 900, 300, ''])).toBe(600);
    expect(calculator.averageEnteredBills(['', null])).toBeNull();
  });

  it('applies the supplied domestic slab logic', () => {
    expect(calculator.calculateDomesticBill(200)).toBe(0);
    expect(calculator.calculateDomesticBill(400)).toBeCloseTo(940);
    expect(calculator.calculateDomesticBill(600)).toBeCloseTo(2880);
  });

  it('sizes residential solar from the average of the entered bills', () => {
    const result = calculator.estimateResidential({
      bills: [600, 700, 800, 900, 1000, 1100],
      solarYield: 4,
      installedCostPerKw: 60000,
      offsetPercent: 85,
    });
    expect(result.averageBimonthlyUnits).toBe(850);
    expect(result.recommendedSizeKw).toBe(4);
    expect(result.estimatedBimonthlyBill).toBeGreaterThan(0);
    expect(result.annualSavings).toBeGreaterThan(0);
  });

  it('accounts for billing cycle and connected load for commercial estimates', () => {
    const monthly = calculator.estimateCommercial({ units: 1200, connectedLoadKw: 10, billingCycle: 'monthly', energyRate: 9, fixedChargePerKw: 110, solarYield: 4, installedCostPerKw: 60000, offsetPercent: 85 });
    const bimonthly = calculator.estimateCommercial({ units: 2400, connectedLoadKw: 10, billingCycle: 'bimonthly', energyRate: 9, fixedChargePerKw: 110, solarYield: 4, installedCostPerKw: 60000, offsetPercent: 85 });
    expect(monthly.estimatedCycleBill).toBe(11900);
    expect(bimonthly.estimatedCycleBill).toBe(23800);
    expect(monthly.recommendedSizeKw).toBe(bimonthly.recommendedSizeKw);
    expect(monthly.annualSavings).toBeCloseTo(bimonthly.annualSavings);
  });

  it('uses contract demand and demand charges for industrial estimates', () => {
    const result = calculator.estimateIndustrial({ units: 5000, contractDemandKva: 50, billingCycle: 'monthly', energyRate: 8, demandChargePerKva: 350, solarYield: 4, installedCostPerKw: 60000, offsetPercent: 85 });
    expect(result.energyCharge).toBe(40000);
    expect(result.demandCharge).toBe(17500);
    expect(result.estimatedCycleBill).toBe(57500);
    expect(result.recommendedSizeKw).toBe(42);
  });
});

