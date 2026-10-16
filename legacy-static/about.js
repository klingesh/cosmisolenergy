const menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.getElementById('navigation').classList.toggle('open',open)});document.getElementById('year').textContent=new Date().getFullYear();
const servicesDropdown=document.querySelector('.nav-dropdown');
document.addEventListener('click',event=>{if(!servicesDropdown.contains(event.target))servicesDropdown.open=false});
servicesDropdown.addEventListener('keydown',event=>{if(event.key==='Escape'){servicesDropdown.open=false;servicesDropdown.querySelector('summary').focus()}});
servicesDropdown.querySelector('a').addEventListener('click',()=>{servicesDropdown.open=false});
document.querySelectorAll('#navigation a').forEach(link=>link.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');document.getElementById('navigation').classList.remove('open')}));
menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.setAttribute('aria-expanded','false');document.getElementById('navigation').classList.remove('open')}});
