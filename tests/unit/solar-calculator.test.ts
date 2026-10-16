import { describe, expect, it } from 'vitest';
import { calculateSolar } from '@/lib/calculators/solar';

describe('calculateSolar', () => {
  it('matches the approved ₹4,600 estimate', () => {
    expect(calculateSolar(4600)).toMatchObject({
      recommendedKw: 2.6,
      annualSavings: 27600,
      lifetimeSavings: 690000,
      solarBill: 230,
    });
  });

  it.each([2499, 30001, Number.NaN])('rejects an unsupported bill value: %s', (bill) => {
    expect(() => calculateSolar(bill)).toThrow(/between/i);
  });
});
