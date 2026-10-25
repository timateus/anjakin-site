const menu=document.querySelector('#mirror-menu'),toggle=document.querySelector('#menu-toggle');
function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}
toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))});
document.querySelector('#menu-close').addEventListener('click',closeMenu);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)closeMenu()});
document.querySelectorAll('img[data-scale]').forEach(img=>{const value=+img.dataset.scale;if(value)img.style.width=value+'%'});
document.querySelectorAll('.image-gallery').forEach(g=>{
 g.classList.add('initialized'); const slides=Array.from(g.children);slides.forEach(s=>s.classList.add('slide'));if(!slides.length)return;
 let options={};try{options=JSON.parse(decodeURIComponent(g.dataset.gallery)).data||{}}catch{}
 let index=0;const caption=document.createElement('div');caption.className='gallery-caption';g.after(caption);
 function show(n){index=(n+slides.length)%slides.length;slides.forEach((s,i)=>{s.classList.toggle('current',i===index);s.setAttribute('aria-hidden',String(i!==index))});const img=slides[index].matches('img')?slides[index]:slides[index].querySelector('img');caption.textContent=options.captions?(img?.dataset.caption||img?.alt||''):''}
 for(const [text,dir,cls]of[['‹',-1,'prev'],['›',1,'next']]){const b=document.createElement('button');b.type='button';b.textContent=text;b.className='gallery-control '+cls;b.setAttribute('aria-label',dir<0?'Previous image':'Next image');b.addEventListener('click',()=>show(index+dir));g.append(b)}
 g.tabIndex=0;g.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1))}});
 let startX=0;g.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});g.addEventListener('touchend',e=>{let d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>40)show(index+(d<0?1:-1))},{passive:true});
 show(0);if(options.autoplay)setInterval(()=>{if(!g.matches(':hover')&&!g.contains(document.activeElement))show(index+1)},1000*(+options.autoplaySpeed||2.5));
});
const zoom=document.querySelector('#zoom');document.querySelectorAll('.content img').forEach(img=>{if(!img.closest('a'))img.addEventListener('click',()=>{zoom.querySelector('img').src=img.src;zoom.querySelector('img').alt=img.alt||'Artwork';zoom.showModal()})});zoom.querySelector('button').addEventListener('click',()=>zoom.close());zoom.addEventListener('click',e=>{if(e.target===zoom)zoom.close()});
