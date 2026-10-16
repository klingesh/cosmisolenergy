(function () {
  const DOMESTIC_RATES = Object.freeze({
    r201_400: 4.7,
    r401_500: 6.3,
    r501_600: 8.4,
    r601_800: 9.45,
    r801_1000: 10.5,
    r1001plus: 11.55,
  });

  function positiveNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function averageEnteredBills(values) {
    const entered = values
      .filter(value => value !== '' && value !== null && value !== undefined)
      .map(Number)
      .filter(value => Number.isFinite(value) && value >= 0);
    if (!entered.length) return null;
    return entered.reduce((sum, value) => sum + value, 0) / entered.length;
  }

  function calculateDomesticBill(units) {
    const u = Math.max(0, Number(units) || 0);
    if (u <= 200) return 0;
    if (u <= 400) return (u - 200) * DOMESTIC_RATES.r201_400;
    if (u <= 500) return 200 * DOMESTIC_RATES.r201_400 + (u - 400) * DOMESTIC_RATES.r401_500;

    let bill = 100 * DOMESTIC_RATES.r201_400
      + 200 * DOMESTIC_RATES.r201_400
      + 100 * DOMESTIC_RATES.r401_500;
    if (u <= 600) return bill + (u - 500) * DOMESTIC_RATES.r501_600;
    bill += 100 * DOMESTIC_RATES.r501_600;
    if (u <= 800) return bill + (u - 600) * DOMESTIC_RATES.r601_800;
    bill += 200 * DOMESTIC_RATES.r601_800;
    if (u <= 1000) return bill + (u - 800) * DOMESTIC_RATES.r801_1000;
    bill += 200 * DOMESTIC_RATES.r801_1000;
    return bill + (u - 1000) * DOMESTIC_RATES.r1001plus;
  }

  function commonSolarEstimate({ monthlyUnits, annualEnergyCharge, cycleBill, cyclesPerYear, energyRate, solarYield, installedCostPerKw, offsetPercent }) {
    const yieldPerDay = positiveNumber(solarYield, 4);
    const costPerKw = positiveNumber(installedCostPerKw, 60000);
    const offset = Math.min(95, Math.max(1, positiveNumber(offsetPercent, 85))) / 100;
    const averageDailyUnits = monthlyUnits / 30;
    const rawSizeKw = averageDailyUnits / yieldPerDay;
    const recommendedSizeKw = Math.ceil(rawSizeKw * 2) / 2;
    const annualGeneration = recommendedSizeKw * yieldPerDay * 365;
    const annualSavings = Math.min(annualEnergyCharge * offset, annualGeneration * Math.max(0, energyRate));
    const installedCost = recommendedSizeKw * costPerKw;
    return {
      monthlyUnits,
      averageDailyUnits,
      rawSizeKw,
      recommendedSizeKw,
      annualGeneration,
      annualSavings,
      lifetimeSavings: annualSavings * 25,
      installedCost,
      paybackYears: annualSavings > 0 ? installedCost / annualSavings : 0,
      returnPercent: installedCost > 0 ? annualSavings / installedCost * 100 : 0,
      residualCycleBill: Math.max(0, cycleBill - annualSavings / cyclesPerYear),
    };
  }

  function estimateResidential(input) {
    const averageBimonthlyUnits = averageEnteredBills(input.bills || []);
    if (averageBimonthlyUnits === null) throw new Error('Enter at least one bi-monthly bill.');
    const estimatedBimonthlyBill = calculateDomesticBill(averageBimonthlyUnits);
    const effectiveRate = averageBimonthlyUnits > 0 ? estimatedBimonthlyBill / averageBimonthlyUnits : 0;
    return {
      mode: 'residential',
      averageBimonthlyUnits,
      estimatedBimonthlyBill,
      ...commonSolarEstimate({
        monthlyUnits: averageBimonthlyUnits / 2,
        annualEnergyCharge: estimatedBimonthlyBill * 6,
        cycleBill: estimatedBimonthlyBill,
        cyclesPerYear: 6,
        energyRate: effectiveRate,
        solarYield: input.solarYield,
        installedCostPerKw: input.installedCostPerKw,
        offsetPercent: input.offsetPercent,
      }),
    };
  }

  function estimateCommercial(input) {
    const units = positiveNumber(input.units, 0);
    if (!units) throw new Error('Enter consumed units.');
    const connectedLoadKw = positiveNumber(input.connectedLoadKw, 0);
    const energyRate = positiveNumber(input.energyRate, 9);
    const fixedChargePerKw = positiveNumber(input.fixedChargePerKw, 110);
    const monthsPerCycle = input.billingCycle === 'monthly' ? 1 : 2;
    const cyclesPerYear = 12 / monthsPerCycle;
    const energyCharge = units * energyRate;
    const fixedCharge = connectedLoadKw * fixedChargePerKw * monthsPerCycle;
    const estimatedCycleBill = energyCharge + fixedCharge;
    return {
      mode: 'commercial',
      units,
      connectedLoadKw,
      monthsPerCycle,
      energyCharge,
      fixedCharge,
      estimatedCycleBill,
      ...commonSolarEstimate({
        monthlyUnits: units / monthsPerCycle,
        annualEnergyCharge: energyCharge * cyclesPerYear,
        cycleBill: estimatedCycleBill,
        cyclesPerYear,
        energyRate,
        solarYield: input.solarYield,
        installedCostPerKw: input.installedCostPerKw,
        offsetPercent: input.offsetPercent,
      }),
    };
  }

  function estimateIndustrial(input) {
    const units = positiveNumber(input.units, 0);
    if (!units) throw new Error('Enter consumed units.');
    const contractDemandKva = positiveNumber(input.contractDemandKva, 0);
    const energyRate = positiveNumber(input.energyRate, 8);
    const demandChargePerKva = positiveNumber(input.demandChargePerKva, 350);
    const monthsPerCycle = input.billingCycle === 'monthly' ? 1 : 2;
    const cyclesPerYear = 12 / monthsPerCycle;
    const energyCharge = units * energyRate;
    const demandCharge = contractDemandKva * demandChargePerKva * monthsPerCycle;
    const estimatedCycleBill = energyCharge + demandCharge;
    return {
      mode: 'industrial',
      units,
      contractDemandKva,
      monthsPerCycle,
      energyCharge,
      demandCharge,
      estimatedCycleBill,
      ...commonSolarEstimate({
        monthlyUnits: units / monthsPerCycle,
        annualEnergyCharge: energyCharge * cyclesPerYear,
        cycleBill: estimatedCycleBill,
        cyclesPerYear,
        energyRate,
        solarYield: input.solarYield,
        installedCostPerKw: input.installedCostPerKw,
        offsetPercent: input.offsetPercent,
      }),
    };
  }

  globalThis.CosmisolCalculator = Object.freeze({
    DOMESTIC_RATES,
    averageEnteredBills,
    calculateDomesticBill,
    estimateResidential,
    estimateCommercial,
    estimateIndustrial,
  });
}());

