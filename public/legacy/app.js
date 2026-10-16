const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const Calculator = globalThis.CosmisolCalculator;

let connectionMode = 'residential';
let hasCalculated = false;

function connectionInputs(mode) {
  const residential = $('residential-inputs');
  const commercial = $('commercial-inputs');
  const industrial = $('industrial-inputs');
  const residentialTab = $('residential-mode');
  const commercialTab = $('commercial-mode');
  const industrialTab = $('industrial-mode');
  const isResidential = mode === 'residential';
  const isCommercial = mode === 'commercial';
  residential.hidden = !isResidential;
  commercial.hidden = !isCommercial;
  industrial.hidden = mode !== 'industrial';
  residentialTab.setAttribute('aria-selected', String(isResidential));
  commercialTab.setAttribute('aria-selected', String(isCommercial));
  industrialTab.setAttribute('aria-selected', String(mode === 'industrial'));
  connectionMode = mode;
  $('calculator-status').textContent = isResidential
    ? 'Enter at least one bi-monthly unit reading.'
    : mode === 'commercial' ? 'Enter consumed units and connected load.' : 'Enter consumed units and contract demand.';
}

function readAssumptions() {
  return {
    solarYield: Number($('yield').value),
    installedCostPerKw: Number($('cost').value),
    offsetPercent: Number($('offset').value),
  };
}

function renderSolarEstimate(result) {
  const currentBill = result.mode === 'residential' ? result.estimatedBimonthlyBill : result.estimatedCycleBill;
  const residual = result.residualCycleBill;
  $('annual-savings').textContent = money(result.annualSavings);
  $('lifetime-savings').textContent = money(result.lifetimeSavings);
  $('size').textContent = result.recommendedSizeKw.toFixed(1) + ' kW';
  $('payback').textContent = result.paybackYears ? result.paybackYears.toFixed(1) + ' yrs' : '—';
  $('return').textContent = result.returnPercent ? result.returnPercent.toFixed(1) + '% p.a.' : '—';
  $('regular-value').textContent = money(currentBill);
  $('solar-value').textContent = money(residual);
  $('regular-bar').style.height = '100%';
  $('solar-bar').style.height = currentBill > 0 ? Math.max(4, residual / currentBill * 100) + '%' : '4%';
  $('comparison-title').textContent = result.mode === 'residential' ? 'Bi-monthly bill comparison' : `${result.monthsPerCycle === 1 ? 'Monthly' : 'Bi-monthly'} bill comparison`;
  $('comparison-description').setAttribute('aria-label', `Electricity bill estimate: current ${money(currentBill)}, estimated after solar ${money(residual)}`);
  const summary = $('calculation-summary');
  summary.hidden = false;
  if (result.mode === 'residential') {
    const count = [...document.querySelectorAll('.residential-bill')].filter(input => input.value !== '').length;
    summary.textContent = `Average from ${count} bi-monthly bill${count === 1 ? '' : 's'}: ${Math.round(result.averageBimonthlyUnits).toLocaleString('en-IN')} units · Estimated electricity charge: ${money(result.estimatedBimonthlyBill)} per two months.`;
  } else if (result.mode === 'commercial') {
    summary.textContent = `${result.monthsPerCycle === 1 ? 'Monthly' : 'Bi-monthly'} estimate: ${money(result.estimatedCycleBill)} including ${money(result.fixedCharge)} in fixed charges.`;
  } else {
    summary.textContent = `${result.monthsPerCycle === 1 ? 'Monthly' : 'Bi-monthly'} industrial estimate: ${money(result.estimatedCycleBill)} including ${money(result.demandCharge)} in demand charges.`;
  }
}

function calculateSolar() {
  try {
    let result;
    if (connectionMode === 'residential') {
      const bills = [...document.querySelectorAll('.residential-bill')].map(input => input.value);
      result = Calculator.estimateResidential({ bills, ...readAssumptions() });
    } else if (connectionMode === 'commercial') {
      const unitsInput = $('commercial-units');
      if (!unitsInput.checkValidity() || Number(unitsInput.value) <= 0) {
        unitsInput.focus();
        throw new Error('Enter commercial consumption units greater than zero.');
      }
      result = Calculator.estimateCommercial({
        units: Number(unitsInput.value),
        connectedLoadKw: Number($('commercial-load').value),
        billingCycle: $('commercial-cycle').value,
        energyRate: Number($('commercial-rate').value),
        fixedChargePerKw: Number($('commercial-fixed').value),
        ...readAssumptions(),
      });
    } else {
      const unitsInput = $('industrial-units');
      if (!unitsInput.checkValidity() || Number(unitsInput.value) <= 0) {
        unitsInput.focus();
        throw new Error('Enter industrial consumption units greater than zero.');
      }
      result = Calculator.estimateIndustrial({
        units: Number(unitsInput.value),
        contractDemandKva: Number($('industrial-demand').value),
        billingCycle: $('industrial-cycle').value,
        energyRate: Number($('industrial-rate').value),
        demandChargePerKva: Number($('industrial-demand-rate').value),
        ...readAssumptions(),
      });
    }
    renderSolarEstimate(result);
    hasCalculated = true;
    $('calculator-status').textContent = 'Estimate calculated. Adjust any value to compare another scenario.';
  } catch (error) {
    $('calculator-status').textContent = error instanceof Error ? error.message : 'Check the values entered.';
  }
}

$('solar-form').addEventListener('submit', event => {
  event.preventDefault();
  calculateSolar();
});
$('residential-mode').addEventListener('click', () => connectionInputs('residential'));
$('commercial-mode').addEventListener('click', () => connectionInputs('commercial'));
$('industrial-mode').addEventListener('click', () => connectionInputs('industrial'));
['yield', 'cost', 'offset', 'commercial-cycle', 'commercial-load', 'commercial-rate', 'commercial-fixed', 'industrial-cycle', 'industrial-demand', 'industrial-rate', 'industrial-demand-rate'].forEach(id => {
  $(id).addEventListener('change', () => { if (hasCalculated) calculateSolar(); });
});

function emi() {
  const principal = Number($('principal').value);
  const monthlyRate = Number($('interest').value) / 1200;
  const months = Number($('tenure').value) * 12;
  if (!$('principal').checkValidity() || !$('interest').checkValidity() || principal <= 0 || $('interest').value === '') {
    $('emi').textContent = '—';
    $('total-interest').textContent = '—';
    return;
  }
  const payment = monthlyRate === 0 ? principal / months : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  $('emi').textContent = money(payment);
  $('total-interest').textContent = money(payment * months - principal);
}
['principal', 'interest', 'tenure'].forEach(id => $(id).addEventListener('input', emi));
emi();
connectionInputs('residential');

const tabs = [$('solar-tab'), $('emi-tab')];
function setTab(index) {
  tabs.forEach((tab, tabIndex) => {
    tab.setAttribute('aria-selected', String(index === tabIndex));
    tab.tabIndex = index === tabIndex ? 0 : -1;
    $(tab.getAttribute('aria-controls')).hidden = index !== tabIndex;
  });
}
tabs.forEach((tab, index) => {
  tab.onclick = () => setTab(index);
  tab.onkeydown = event => {
    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
      setTab(next);
      tabs[next].focus();
    }
  };
});

const menu = document.querySelector('.menu');
menu.onclick = () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  $('navigation').classList.toggle('open', open);
};
document.querySelectorAll('nav a').forEach(link => link.onclick = () => {
  menu.setAttribute('aria-expanded', 'false');
  $('navigation').classList.remove('open');
});
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  $('service').value = link.dataset.service;
}));

const servicesDropdown = document.querySelector('.nav-dropdown');
document.addEventListener('click', event => {
  if (!servicesDropdown.contains(event.target)) servicesDropdown.open = false;
});
servicesDropdown.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    servicesDropdown.open = false;
    servicesDropdown.querySelector('summary').focus();
  }
});
servicesDropdown.querySelector('a').addEventListener('click', () => { servicesDropdown.open = false; });

const hero = document.querySelector('.hero');
const siteHeader = document.querySelector('.header');
document.body.classList.add('hero-nav-ready');
let navTick = false;
function updateHeroNav() {
  siteHeader.classList.toggle('header-revealed', hero.getBoundingClientRect().bottom <= 0);
  navTick = false;
}
window.addEventListener('scroll', () => {
  if (!navTick) {
    navTick = true;
    requestAnimationFrame(updateHeroNav);
  }
}, { passive: true });
window.addEventListener('load', updateHeroNav);
requestAnimationFrame(updateHeroNav);

$('visit-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Free site visit request\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nLocation: ${data.get('city')}\nSolar solution: ${data.get('service')}\nNotes: ${data.get('message') || 'None'}`;
  const url = 'https://wa.me/917339617710?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener,noreferrer');
  $('form-result').hidden = false;
  $('form-result').textContent = 'Send your prepared message in WhatsApp to request your free site visit. Your appointment is confirmed only when our team responds. ';
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Open WhatsApp again ↗';
  $('form-result').append(link);
});
$('year').textContent = new Date().getFullYear();

const solutionItems = [...document.querySelectorAll('.solution-item')];
solutionItems.forEach(item => item.addEventListener('toggle', () => {
  if (item.open) solutionItems.forEach(other => { if (other !== item) other.open = false; });
}));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const timeline = document.querySelector('.timeline');
  const steps = [...timeline.querySelectorAll('li')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -45% 0px', threshold: 0.1 });
  timeline.classList.add('timeline-reveal');
  steps.forEach(step => observer.observe(step));
}

