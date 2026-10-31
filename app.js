const BASE_MENU = [
 {id:'fries',name:'Truffle fries',category:'food',price:10,description:'Crisp fries, parmesan, herbs and truffle seasoning.',tag:'For sharing'},
 {id:'cauliflower',name:'Crispy cauliflower',category:'food',price:12,description:'Golden bites with a bright lemon and herb dip.'},
 {id:'flatbread',name:'Halloumi flatbread',category:'food',price:16,description:'Grilled halloumi, roasted peppers and fresh herbs.'},
 {id:'burger',name:'The lounge burger',category:'food',price:19,description:'A classic beef burger with cheddar, pickles and house sauce.'},
 {id:'sliders',name:'Chicken sliders',category:'food',price:17,description:'Three little buns, crisp chicken, slaw and a little heat.'},
 {id:'board',name:'The sharing board',category:'food',price:25,description:'An illustrative selection of cheeses, olives and warm bread.',tag:'For the table'},
 {id:'spritz',name:'Sunset spritz',category:'cocktails',price:15,description:'Orange aperitif, sparkling wine and soda over ice.',tag:'Bright & easy'},
 {id:'oldfashioned',name:'Old fashioned',category:'cocktails',price:16,description:'Whisky, bitters, a touch of sweetness and orange.'},
 {id:'espresso',name:'Espresso martini',category:'cocktails',price:16,description:'Vodka, coffee liqueur and freshly brewed espresso.'},
 {id:'mojito',name:'Classic mojito',category:'cocktails',price:15,description:'White rum, lime, mint and soda.'},
 {id:'lager',name:'House lager',category:'beer',price:8,description:'A crisp, refreshing lager. Brand and serving size to be confirmed.'},
 {id:'ipa',name:'Craft IPA',category:'beer',price:9,description:'An illustrative local craft selection. Brewery to be confirmed.'},
 {id:'red',name:'House red',category:'beer',price:11,description:'A glass of red for an easy evening. Wine and serving size to be confirmed.'},
 {id:'white',name:'House white',category:'beer',price:11,description:'A refreshing white by the glass. Wine and serving size to be confirmed.'},
 {id:'garden',name:'Garden fizz',category:'zero',price:9,description:'Cucumber, mint, lime and soda.',tag:'Alcohol-free'},
 {id:'citrus',name:'Citrus cooler',category:'zero',price:9,description:'Orange, lemon and a splash of sparkling water.',tag:'Alcohol-free'},
 {id:'icedtea',name:'Peach iced tea',category:'zero',price:6,description:'Chilled tea with peach and lemon.'},
 {id:'coffee',name:'Coffee & conversation',category:'zero',price:5,description:'A freshly brewed coffee and a reason to pause.'}
];
const CATEGORY_NAMES={all:'The full menu',food:'Food & sharing',cocktails:'Cocktails',beer:'Beer & wine',zero:'Alcohol-free'};
const MENU_KEY='lava-menu-draft-v1', PICKS_KEY='lava-menu-picks-v1';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'$'+Number(n).toFixed(Number(n)%1?2:0);
function readStore(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
function writeStore(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{toast('This browser could not save the preview changes.');return false}}
let overrides=readStore(MENU_KEY,{}),picks=new Set(readStore(PICKS_KEY,[]));
function menuData(){return BASE_MENU.map(item=>({...item,available:true,...overrides[item.id],id:item.id,category:item.category}))}
function refreshFeatured(){const data=menuData();$$('[data-featured]').forEach(a=>{const i=data.find(x=>x.id===a.dataset.featured);if(!i)return;$('h3',a).textContent=i.name;a.lastElementChild.textContent=i.available?money(i.price):'Unavailable';})}
refreshFeatured();
let toastTimer;
function toast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}
const navButton=$('.nav-toggle'), nav=$('#site-nav');
navButton?.addEventListener('click',()=>{const open=nav.classList.toggle('open');navButton.setAttribute('aria-expanded',String(open));navButton.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');navButton.setAttribute('aria-expanded','false');navButton.setAttribute('aria-label','Open navigation');navButton.focus()}});
document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!e.target.closest('.site-header')){nav.classList.remove('open');navButton.setAttribute('aria-expanded','false');navButton.setAttribute('aria-label','Open navigation')}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-close]');if(b)document.getElementById(b.dataset.close)?.close()});
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
const heart='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 5.5c-2-2-5.2-1.7-8 1.4C9.2 3.8 6 3.5 4 5.5c-3.1 3.2-.9 6.7 8 13.5 8.9-6.8 11.1-10.3 8-13.5Z" stroke="currentColor" stroke-width="1.3"/></svg>';
let category='all',query='';
function updatePickCount(){const el=$('#picks-count');if(el)el.textContent=picks.size}
function renderMenu(){
 const box=$('#menu-items');if(!box)return;
 const list=menuData().filter(i=>(category==='all'||i.category===category)&&((i.name+' '+i.description).toLowerCase().includes(query)));
 box.innerHTML=list.map(i=>`<article class="menu-item ${i.available?'':'unavailable'}"><button class="item-open" data-item="${i.id}" aria-label="View ${esc(i.name)} details"><h3>${esc(i.name)}</h3></button><p>${esc(i.description)}</p><span class="item-price">${money(i.price)}${i.tag?`<span class="item-tag">${esc(i.tag)}</span>`:''}</span>${i.available?'':'<p class="availability-note">Unavailable in this preview</p>'}<button class="pick-button" data-pick="${i.id}" aria-label="${picks.has(i.id)?'Remove':'Save'} ${esc(i.name)}" aria-pressed="${picks.has(i.id)}" ${i.available?'':'disabled'}>${heart}</button></article>`).join('');
 $('#menu-heading').textContent=CATEGORY_NAMES[category];$('#menu-results-count').textContent=`${list.length} ${list.length===1?"ITEM":"ITEMS"} · SAMPLE PRICES · CAD`;$('#menu-empty').hidden=list.length>0;updatePickCount();
 $$('.menu-filters button').forEach(b=>{const on=b.dataset.category===category;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
}
function togglePick(id){const item=menuData().find(i=>i.id===id);if(!item)return;if(picks.has(id)){picks.delete(id);toast('Removed from your picks.')}else{picks.add(id);toast('Saved to your picks.')}writeStore(PICKS_KEY,[...picks]);const selected=picks.has(id);const menuButton=$(`.pick-button[data-pick="${id}"]`);if(menuButton){menuButton.setAttribute('aria-pressed',String(selected));menuButton.setAttribute('aria-label',`${selected?'Remove':'Save'} ${item.name}`)}renderPicks();updatePickCount();const b=$('#detail-save');if(b&&b.dataset.pick===id){b.textContent=selected?'Remove from my picks':'Save to my picks';b.setAttribute('aria-pressed',String(selected))}}
function openItem(id){const i=menuData().find(i=>i.id===id);if(!i)return;$('#item-detail').innerHTML=`<p class="eyebrow">${CATEGORY_NAMES[i.category]} · SAMPLE ITEM</p><h2>${esc(i.name)}</h2><p>${esc(i.description)}</p><div class="modal-price">${money(i.price)} <small class="sample-note">CAD · Sample price</small></div><p class="sample-note">Final ingredients and dietary information will be confirmed by the owner.</p><button id="detail-save" class="button button-dark" data-pick="${i.id}" aria-pressed="${picks.has(i.id)}" ${i.available?'':'disabled'}>${i.available?(picks.has(i.id)?'Remove from my picks':'Save to my picks'):'Unavailable in this preview'}</button>`;$('#item-dialog').showModal()}
function renderPicks(){const box=$('#picks-items');if(!box)return;const items=menuData().filter(i=>picks.has(i.id));box.innerHTML=items.length?items.map(i=>`<div class="picks-row"><div><h3>${esc(i.name)}</h3><p>${money(i.price)}${i.available?'':' · Unavailable in preview'}</p></div><button class="picks-remove" data-remove="${i.id}" aria-label="Remove ${esc(i.name)} from picks">Remove</button></div>`).join(''):'<p class="empty-state">Nothing saved yet. Tap a heart on the menu to start your shortlist.</p>';$('#picks-total').innerHTML=items.length?`<div class="picks-estimate"><span>Sample subtotal</span><strong>${money(items.reduce((n,i)=>n+Number(i.price),0))} CAD</strong></div><p class="sample-note">One of each saved item. Illustrative prices, before any tax or tip. This is not a bill.</p>`:'';updatePickCount()}
function refreshSavedState(){overrides=readStore(MENU_KEY,{});picks=new Set(readStore(PICKS_KEY,[]));renderMenu();renderPicks();refreshFeatured()}
window.addEventListener('pageshow',refreshSavedState);
window.addEventListener('storage',refreshSavedState);
if(document.body.dataset.page==='menu'){
 const p=new URLSearchParams(location.search);const c=p.get('category');if(CATEGORY_NAMES[c])category=c;
 if(p.get('table')&&/^\d{1,3}$/.test(p.get('table'))){const t=$('#table-label');t.hidden=false;t.textContent='TABLE '+p.get('table').padStart(2,'0');document.body.classList.add('table-menu')}
 const syncCategory=()=>{const url=new URL(location.href);if(category==='all')url.searchParams.delete('category');else url.searchParams.set('category',category);history.replaceState(null,'',url)};
 renderMenu();$('.menu-filters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;renderMenu();syncCategory()}});
 $('#menu-search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();renderMenu()});
 $('#reset-filters')?.addEventListener('click',()=>{category='all';query='';$('#menu-search').value='';renderMenu();syncCategory();$('#menu-search').focus()});
 $('#open-picks').addEventListener('click',()=>{renderPicks();$('#picks-dialog').showModal()});
 document.addEventListener('click',e=>{const item=e.target.closest('[data-item]'),pick=e.target.closest('[data-pick]'),remove=e.target.closest('[data-remove]');if(item)openItem(item.dataset.item);if(pick&&!pick.disabled)togglePick(pick.dataset.pick);if(remove){picks.delete(remove.dataset.remove);writeStore(PICKS_KEY,[...picks]);renderMenu();renderPicks();($('#picks-items [data-remove]')||$('#picks-dialog .dialog-close')).focus()}});
}
if(document.body.dataset.page==='home'){
 const scenes={
  lounge:{file:'loveseats.webp',alt:'Proposed loveseat seating with portable dividers',caption:'Conversation corner · Interior concept'},
  games:{file:'games-music.webp',alt:'Concept showing one flexible area set up for board games and live music',caption:'Games & music · Flexible room concept'},
  window:{file:'window-tables.webp',alt:'Proposed high tables and laptop seating by the front window',caption:'The window seats · Interior concept'}
 };
 $('.space-switches')?.addEventListener('click',e=>{const button=e.target.closest('[data-space]');if(!button)return;const scene=scenes[button.dataset.space];if(!scene)return;const img=$('.space-scene-image');img.src=new URL(scene.file,img.src).href;img.alt=scene.alt;img.style.objectFit=button.dataset.space==='games'?'contain':'cover';$('#space-caption').textContent=scene.caption;$$('[data-space]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})});
}
if(document.body.dataset.page==='shisha'){
 const profiles={
  lemon:{name:'Lemon & mint',symbol:'LM',color:'#b9e6a4',description:'Sharp citrus peel meets a clean, cooling mint aroma.',tags:['Citrus','Cooling','Herbal']},
  apple:{name:'Apple & anise',symbol:'AA',color:'#f1b38d',description:'Orchard-fruit sweetness with the distinctive, liquorice-like aroma of anise.',tags:['Orchard fruit','Sweet spice','Anise']},
  grape:{name:'Grape & mint',symbol:'GM',color:'#c5b6ec',description:'Rounded dark-fruit notes contrast with a crisp, cooling mint aroma.',tags:['Dark fruit','Cooling','Rounded']},
  berry:{name:'Mixed berries',symbol:'MB',color:'#efa6c0',description:'Tart red-fruit notes, a jammy aroma and a softer sweetness.',tags:['Tart fruit','Jammy','Sweet']}
 };
 $('.flavour-select')?.addEventListener('click',e=>{const button=e.target.closest('[data-flavour]');if(!button)return;const profile=profiles[button.dataset.flavour];if(!profile)return;$('[data-flavour-view]').style.setProperty('--flavour',profile.color);$('#flavour-symbol').textContent=profile.symbol;$('#flavour-name').textContent=profile.name;$('#flavour-description').textContent=profile.description;$('#flavour-tags').replaceChildren(...profile.tags.map(tag=>{const span=document.createElement('span');span.textContent=tag;return span}));$$('[data-flavour]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});$('#flavour-announcement').textContent=profile.name+'. '+profile.description});
}
if(document.body.dataset.page==='events'){
 function filterEvents(type){$$('[data-event]').forEach(e=>e.hidden=type!=='all'&&e.dataset.event!==type);$$('[data-event-type]').forEach(b=>{const on=b.dataset.eventType===type;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))})}
 const initial=new URLSearchParams(location.search).get('type');if(['music','games','private'].includes(initial))filterEvents(initial);
 $('.event-filters').addEventListener('click',e=>{const b=e.target.closest('[data-event-type]');if(b)filterEvents(b.dataset.eventType)});
}
if(document.body.dataset.page==='visit'){
 const form=$('#visit-form'),params=new URLSearchParams(location.search);for(const n of ['area','reason','guests'])if(params.has(n)&&[...form.elements[n].options].some(o=>o.value===params.get(n)))form.elements[n].value=params.get(n);
 const now=new Date();form.elements.date.min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const f=new FormData(form);const selectLabel=name=>form.elements[name].selectedOptions[0].textContent;$('#booking-summary').textContent=`${f.get('name')}, here is how your enquiry would look:\n\n${selectLabel('guests')} · ${f.get('date')} at ${f.get('time')}\nPreferred area: ${selectLabel('area')}\nOccasion: ${selectLabel('reason')}\nReply address: ${f.get('email')}${f.get('notes')?'\n\n'+f.get('notes'):''}`;form.hidden=true;const result=$('#booking-result');result.hidden=false;result.focus()});
 $('#edit-enquiry').addEventListener('click',()=>{$('#booking-result').hidden=true;form.hidden=false;form.elements.name.focus()});
}
if(document.body.dataset.page==='studio'){
 function renderStudio(){
 $('#studio-items').innerHTML=menuData().map(i=>`<div class="studio-row"><label>ITEM NAME<input type="text" value="${esc(i.name)}" data-edit-name="${i.id}" aria-label="Item name for ${esc(i.name)}" maxlength="65" required></label><label>PRICE · CAD<input type="number" min="0" max="200" step="0.5" value="${i.price}" data-edit-price="${i.id}" aria-label="Price for ${esc(i.name)}"></label><label class="stock-label"><input type="checkbox" data-edit-stock="${i.id}" ${i.available?'checked':''} aria-label="${esc(i.name)} available">Available</label></div>`).join('');
 }
 renderStudio();const saveMenuEdit=e=>{const el=e.target;let id,value,key;if(el.dataset.editName){id=el.dataset.editName;value=el.value.trim();key='name';if(!value){if(e.type==='change'){el.value=menuData().find(i=>i.id===id).name;toast('Please keep an item name.')}return}}else if(el.dataset.editPrice){id=el.dataset.editPrice;value=Number(el.value);key='price';if(el.value===''||!Number.isFinite(value)||value<0||value>200){if(e.type==='change'){toast('Use a sample price from $0 to $200.');el.value=menuData().find(i=>i.id===id).price}return}}else if(el.dataset.editStock){id=el.dataset.editStock;value=el.checked;key='available'}else return;if(overrides[id]?.[key]===value)return;overrides[id]={...overrides[id],[key]:value};if(writeStore(MENU_KEY,overrides)){$('#studio-save-status').textContent='Saved in this browser. Open the menu to see your change.';toast('Preview updated. Open the menu to see it.')}};$('#studio-items').addEventListener('input',saveMenuEdit);$('#studio-items').addEventListener('change',saveMenuEdit);
 $('#reset-menu').addEventListener('click',()=>{overrides={};writeStore(MENU_KEY,overrides);renderStudio();$('#studio-save-status').textContent='Original sample menu restored.';toast('Sample menu restored.')});
}
