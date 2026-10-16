const $=id=>document.getElementById(id);const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
function solar(){const billInput=$('bill'),inputs=['tariff','yield','cost','offset'].map($),bill=+billInput.value;if(!billInput.checkValidity()||inputs.some(input=>!input.checkValidity()||+input.value<=0)){billInput.reportValidity();return}const [tariff,yieldValue,costPerKw,offsetPercent]=inputs.map(input=>+input.value),target=offsetPercent/100,annualEnergy=bill*6/tariff,size=Math.ceil((annualEnergy*target)/(yieldValue*365)*2)/2,annualGeneration=size*yieldValue*365,annualSavings=Math.min(bill*6*target,annualGeneration*tariff),residual=Math.max(0,bill-annualSavings/6),installedCost=size*costPerKw,payback=annualSavings>0?installedCost/annualSavings:0;$('annual-savings').textContent=money(annualSavings);$('lifetime-savings').textContent=money(annualSavings*25);$('size').textContent=size.toFixed(1)+' kW';$('payback').textContent=payback.toFixed(1)+' yrs';$('return').textContent=(annualSavings/installedCost*100).toFixed(1)+'% p.a.';$('regular-value').textContent=money(bill);$('solar-value').textContent=money(residual);$('regular-bar').style.height='100%';$('solar-bar').style.height=Math.max(4,residual/bill*100)+'%';$('comparison-description').setAttribute('aria-label',`Bimonthly electricity bill: current ${money(bill)}, estimated energy charges with solar ${money(residual)}`)}
function emi(){const p=+$('principal').value,r=+$('interest').value/1200,n=+$('tenure').value*12;if(!$('principal').checkValidity()||!$('interest').checkValidity()||p<=0||$('interest').value===''){$('emi').textContent='—';$('total-interest').textContent='—';return}const m=r===0?p/n:p*r/(1-Math.pow(1+r,-n));$('emi').textContent=money(m);$('total-interest').textContent=money(m*n-p)}
$('solar-form').addEventListener('submit',e=>{e.preventDefault();solar()});['tariff','yield','cost','offset'].forEach(id=>$(id).addEventListener('change',solar));['principal','interest','tenure'].forEach(id=>$(id).addEventListener('input',emi));solar();emi();
const tabs=[$('solar-tab'),$('emi-tab')];function setTab(i){tabs.forEach((t,k)=>{t.setAttribute('aria-selected',String(i===k));t.tabIndex=i===k?0:-1;$(t.getAttribute('aria-controls')).hidden=i!==k})}tabs.forEach((t,i)=>{t.onclick=()=>setTab(i);t.onkeydown=e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?1:1-i;setTab(next);tabs[next].focus()}}});
const menu=document.querySelector('.menu');menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('navigation').classList.toggle('open',open)};document.querySelectorAll('nav a').forEach(a=>a.onclick=()=>{menu.setAttribute('aria-expanded','false');$('navigation').classList.remove('open')});document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{$('service').value=a.dataset.service}));
const servicesDropdown=document.querySelector('.nav-dropdown');
document.addEventListener('click',event=>{if(!servicesDropdown.contains(event.target))servicesDropdown.open=false});
servicesDropdown.addEventListener('keydown',event=>{if(event.key==='Escape'){servicesDropdown.open=false;servicesDropdown.querySelector('summary').focus()}});
servicesDropdown.querySelector('a').addEventListener('click',()=>{servicesDropdown.open=false});
const hero=document.querySelector('.hero'),siteHeader=document.querySelector('.header');
document.body.classList.add('hero-nav-ready');
let navTick=false;
function updateHeroNav(){siteHeader.classList.toggle('header-revealed',hero.getBoundingClientRect().bottom<=0);navTick=false}
window.addEventListener('scroll',()=>{if(!navTick){navTick=true;requestAnimationFrame(updateHeroNav)}},{passive:true});
window.addEventListener('load',updateHeroNav);
requestAnimationFrame(updateHeroNav);
$('visit-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const message=`Free site visit request\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nLocation: ${data.get('city')}\nSolar solution: ${data.get('service')}\nNotes: ${data.get('message')||'None'}`;const url='https://wa.me/917339617710?text='+encodeURIComponent(message);window.open(url,'_blank','noopener,noreferrer');$('form-result').hidden=false;$('form-result').textContent='Send your prepared message in WhatsApp to request your free site visit. Your appointment is confirmed only when our team responds. ';const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open WhatsApp again ↗';$('form-result').append(link)});$('year').textContent=new Date().getFullYear();
// Keep one solar service open at a time while preserving native keyboard/touch controls.
const solutionItems=[...document.querySelectorAll('.solution-item')];
solutionItems.forEach(item=>item.addEventListener('toggle',()=>{if(item.open)solutionItems.forEach(other=>{if(other!==item)other.open=false})}));
// Reveal each timeline step as it approaches the middle of the viewport.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
 const timeline=document.querySelector('.timeline');
 const steps=[...timeline.querySelectorAll('li')];
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}});
 },{rootMargin:'0px 0px -45% 0px',threshold:0.1});
 timeline.classList.add('timeline-reveal');
 steps.forEach(step=>observer.observe(step));
}
