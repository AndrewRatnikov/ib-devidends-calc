import { describe, expect, it } from 'vitest';
import { calculateTaxes } from './taxCalculations';

describe('calculateTaxes', () => {
  it('should calculate taxes correctly', () => {
    const item = {
      total: 100,
      tax: -15,
      curExchange: 40.5,
    };

    const result = calculateTaxes(item);

    expect(result.absTax).toBe(15);
    expect(result.income).toBe(85);
    expect(result.localIncome).toBe(3442.5);
    expect(result.pit).toBe(309.825); // 3442.5 * 0.09
    expect(result.militaryTax).toBe(172.125); // 3442.5 * 0.05
    expect(result.totalTax).toBe(481.95); // 309.825 + 172.125
    expect(result.netIncome).toBe(2960.55); // 3442.5 - 481.95
  });

  it('should handle zero tax', () => {
    const item = {
      total: 100,
      tax: 0,
      curExchange: 40,
    };

    const result = calculateTaxes(item);

    expect(result.absTax).toBe(0);
    expect(result.income).toBe(100);
    expect(result.localIncome).toBe(4000);
  });

  it('should handle decimal precision correctly', () => {
    // Test case that demonstrates precise decimal arithmetic
    // Without Decimal.js: 0.1 + 0.2 = 0.30000000000000004
    const item = {
      total: 0.1 + 0.2, // 0.30000000000000004 in floating-point
      tax: -0.03,
      curExchange: 40.33,
    };

    const result = calculateTaxes(item);

    // total (0.3) - absTax (0.03) = 0.27
    expect(result.income).toBeCloseTo(0.27, 10);
    // 0.27 * 40.33 = 10.8891
    expect(result.localIncome).toBeCloseTo(10.8891, 10);
    // 10.8891 * 0.09 = 0.980019
    expect(result.pit).toBeCloseTo(0.980019, 6);
    // 10.8891 * 0.05 = 0.544455
    expect(result.militaryTax).toBeCloseTo(0.544455, 6);
  });

  it('should handle negative tax values correctly', () => {
    const item = {
      total: 50,
      tax: -10,
      curExchange: 38.5,
    };

    const result = calculateTaxes(item);

    expect(result.absTax).toBe(10);
    expect(result.income).toBe(40);
    expect(result.localIncome).toBe(1540);
    expect(result.pit).toBe(138.6); // 1540 * 0.09
    expect(result.militaryTax).toBe(77); // 1540 * 0.05
    expect(result.totalTax).toBe(215.6);
    expect(result.netIncome).toBe(1324.4);
  });

  it('should return all required fields', () => {
    const item = {
      total: 100,
      tax: -15,
      curExchange: 40,
    };

    const result = calculateTaxes(item);

    expect(result).toHaveProperty('absTax');
    expect(result).toHaveProperty('income');
    expect(result).toHaveProperty('localIncome');
    expect(result).toHaveProperty('pit');
    expect(result).toHaveProperty('militaryTax');
    expect(result).toHaveProperty('totalTax');
    expect(result).toHaveProperty('netIncome');
  });
});
