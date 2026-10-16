'use client';
import { FormEvent, useState } from 'react';
import { calculateSolar, type SolarEstimate } from '@/lib/calculators/solar';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export function SolarCalculator(){
  const [bill,setBill]=useState('4600'); const [result,setResult]=useState<SolarEstimate>(()=>calculateSolar(4600)); const [error,setError]=useState('');
  function submit(e:FormEvent){e.preventDefault();try{setResult(calculateSolar(Number(bill)));setError('')}catch(err){setError(err instanceof Error?err.message:'Enter a valid amount')}}
  return <section id="calculator" className="section section--warm"><div className="wrap"><p className="eyebrow">Solar calculator</p><h2>See what solar could do for you.</h2><form className="calc-form" onSubmit={submit}><label>Monthly electricity bill<input aria-label="Monthly electricity bill" inputMode="numeric" value={bill} onChange={e=>setBill(e.target.value)} /></label><button className="button" type="submit">Calculate savings</button></form>{error&&<p role="alert">{error}</p>}
    <div className="calc-results" aria-live="polite"><article><small>Recommended solar</small><strong>{result.recommendedKw.toFixed(1)} kW</strong></article><article><small>Annual savings</small><strong>{money.format(result.annualSavings)}</strong></article><article><small>Lifetime savings</small><strong>{money.format(result.lifetimeSavings)}</strong></article><article><small>Solar electricity bill</small><strong>{money.format(result.solarBill)}</strong></article></div><p className="fineprint">Illustrative, undiscounted estimate over 25 years. Final performance and proposal depend on site assessment and applicable charges.</p>
  </div></section>
}
