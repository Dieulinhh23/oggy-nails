const services = [
 ['Classic Manicure','Manicures',25,30,'Shape, cuticle care, hand massage and your choice of polish.'],
 ['Gel Manicure','Manicures',40,45,'Long-wear colour with a beautifully glossy finish.'],
 ['Deluxe Spa Manicure','Manicures',45,50,'A scrub, hydrating mask, hot towel and hand massage.'],
 ['Dip Powder Manicure','Manicures',50,60,'Lightweight colour with a smooth, chip-resistant finish.'],
 ['Builder Gel Overlay','Manicures',55,60,'A strengthening overlay for your natural nails.'],
 ['Polish Change','Manicures',15,15,'File, shape and a fresh coat of your favourite polish.'],
 ['Spa Pedicure','Pedicures',45,60,'A restorative soak, detailed care, massage and polish.'],
 ['Gel Pedicure','Pedicures',55,60,'Spa care finished with long-wear gel colour.'],
 ['Acrylic Full Set','Extensions',65,75,'Fresh extensions in your favourite shape and length.'],
 ['Acrylic Fill','Extensions',45,50,'Refresh and rebalance your existing acrylics.'],
 ['Gel-X Extensions','Extensions',75,90,'Lightweight, full-cover soft-gel tips for added length.'],
 ['Mani + Pedi Combo','Packages',65,90,'Classic manicure and spa pedicure in one happy visit.'],
 ["Kids’ Mani & Pedi",'Packages',30,40,'Gentle nail care and playful polish for ages 12 and under.'],
 ['Nail Art Add-On','Extras',15,30,'Fine lines, chrome or a custom design with personality.'],
 ['Gel or Dip Removal','Extras',12,20,'Careful soak-off removal and nourishing nail oil.'],
 ['Paraffin Wax Treatment','Extras',15,15,'A warm dip to leave hands or feet feeling soft.']
];
const menu=document.querySelector('#menu'), filters=document.querySelector('#filters'), dialog=document.querySelector('#booking'), select=document.querySelector('#service');
function render(category='All services') {
 menu.replaceChildren();
 services.forEach(([name,group,price,time,detail],id)=>{
  if(category!=='All services' && group!==category)return;
  const article=document.createElement('article');article.className='service';
  const copy=document.createElement('div');const title=document.createElement('h3');title.textContent=name;const p=document.createElement('p');p.textContent=detail;const small=document.createElement('small');small.textContent=`${time} MIN · ${group.toUpperCase()}`;copy.append(title,p,small);
  const cost=document.createElement('div');cost.className='service-price';const amount=document.createElement('span');amount.textContent=`$${price}`;const button=document.createElement('button');button.textContent='↗';button.setAttribute('aria-label',`Plan ${name}`);button.addEventListener('click',()=>openBooking(id));cost.append(amount,button);article.append(copy,cost);menu.append(article);
 });
}
['All services','Manicures','Pedicures','Extensions','Packages','Extras'].forEach((name,id)=>{const button=document.createElement('button');button.textContent=name;button.setAttribute('aria-pressed',String(id===0));button.addEventListener('click',()=>{filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render(name)});filters.append(button)});
services.forEach(([name,,price,time],id)=>{const option=document.createElement('option');option.value=id;option.textContent=`${name} · $${price} · ${time} min`;select.append(option)});
function summary(){const s=services[Number(select.value)];document.querySelector('#service-summary').textContent=`${s[3]} minutes · $${s[2]} estimated total`;}
function openBooking(id){if(Number.isInteger(id))select.value=id;summary();document.querySelector('#result').textContent='';dialog.showModal();}
document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>openBooking()));document.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});select.addEventListener('change',summary);
const date=document.querySelector('#date');const now=new Date();const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;date.min=today;
try{const saved=JSON.parse(localStorage.getItem('oggy-nail-plan'));if(saved&&Number.isInteger(saved.service)&&services[saved.service]){select.value=saved.service;if(saved.date>=today)date.value=saved.date;const t=document.querySelector('#time');if([...t.options].some(o=>o.value===saved.time))t.value=saved.time;document.querySelector('#notes').value=typeof saved.notes==='string'?saved.notes.slice(0,400):'';}}catch{}
document.querySelector('#booking-form').addEventListener('submit',e=>{e.preventDefault();const time=document.querySelector('#time').value;const [clock,period]=time.split(' ');let [hours,minutes]=clock.split(':').map(Number);hours=hours%12+(period==='PM'?12:0);const chosen=new Date(`${date.value}T${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:00`);if(chosen<=new Date()){document.querySelector('#result').textContent='Please choose a future date and time.';return;}const plan={service:Number(select.value),date:date.value,time,notes:document.querySelector('#notes').value};try{localStorage.setItem('oggy-nail-plan',JSON.stringify(plan));document.querySelector('#result').textContent='♡ Your plan is saved on this device. No appointment has been booked. You can come back and change it anytime.';}catch{document.querySelector('#result').textContent='Your browser could not save this plan. Please keep a copy of your preferences.';}});
document.querySelector('#year').textContent=new Date().getFullYear();render();summary();
