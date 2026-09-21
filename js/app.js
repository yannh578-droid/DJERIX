const menuBtn=document.getElementById('menuBtn');
const mobileMenu=document.getElementById('mobileMenu');
if(menuBtn&&mobileMenu){menuBtn.addEventListener('click',()=>mobileMenu.classList.toggle('open'));mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')))}

const langSwitch=document.getElementById('langSwitch');
const translations={fr:{},en:{}};
if(langSwitch){langSwitch.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{langSwitch.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.documentElement.lang=btn.dataset.lang;localStorage.setItem('djerix-language',btn.dataset.lang);}));}

const searchBtn=document.getElementById('searchBtn');
const searchOverlay=document.getElementById('searchOverlay');
const closeSearch=document.getElementById('closeSearch');
const searchInput=document.getElementById('searchInput');
const searchResults=document.getElementById('searchResults');
const services=[
 ['Assistant d’études','pages/service.html?mode=study'],['Présentations','pages/service.html?mode=presentation'],['Analyse de documents','pages/service.html?mode=document'],['Création visuelle','pages/service.html?mode=image'],['Création web','pages/service.html?mode=website'],['Laboratoire d’idées','pages/service.html?mode=ideas'],['Planificateur intelligent','pages/service.html?mode=planner'],['Recherche assistée','pages/service.html?mode=research'],['Productivité','pages/service.html?mode=productivity'],['Carrière','pages/service.html?mode=career'],['Traduction avancée','pages/service.html?mode=translation'],['Business','pages/service.html?mode=business']
];
function openSearch(){if(!searchOverlay)return;searchOverlay.classList.add('open');searchOverlay.setAttribute('aria-hidden','false');setTimeout(()=>searchInput?.focus(),50)}
function closeSearchPanel(){searchOverlay?.classList.remove('open');searchOverlay?.setAttribute('aria-hidden','true')}
searchBtn?.addEventListener('click',openSearch);closeSearch?.addEventListener('click',closeSearchPanel);searchOverlay?.addEventListener('click',e=>{if(e.target===searchOverlay)closeSearchPanel()});
searchInput?.addEventListener('input',()=>{const q=searchInput.value.trim().toLowerCase();const list=services.filter(s=>s[0].toLowerCase().includes(q));searchResults.innerHTML=(q?list:services.slice(0,5)).map(s=>`<a class="search-result" href="${s[1]}"><b>${s[0]}</b><span>Ouvrir ce service →</span></a>`).join('')||'<div class="search-result">Aucun service trouvé.</div>'});

const themeBtn=document.getElementById('themeBtn');
themeBtn?.addEventListener('click',()=>{document.body.classList.toggle('soft-focus');themeBtn.textContent=document.body.classList.contains('soft-focus')?'◐':'☼'});

const robot=document.getElementById('robot3d');
if(robot){robot.addEventListener('mousemove',e=>{const r=robot.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;robot.style.transform=`translateY(-8px) rotateY(${x*10}deg) rotateX(${y*-6}deg) scale(1.02)`});robot.addEventListener('mouseleave',()=>robot.style.transform='');}

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id&&id.length>1){const el=document.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});}}}));
