const menu=document.querySelector('#mirror-menu'),toggle=document.querySelector('#menu-toggle');
function closeMenu(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}
toggle.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))});
document.querySelector('#menu-close').addEventListener('click',closeMenu);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)closeMenu()});
document.querySelectorAll('img[data-scale]').forEach(img=>{const value=+img.dataset.scale;if(value)img.style.width=value+'%'});
const galleries=Array.from(document.querySelectorAll('.image-gallery'));
galleries.forEach(g=>{
 let config={};try{config=JSON.parse(decodeURIComponent(g.dataset.gallery))}catch{}
 const options=config.data||{},mode=config.path||'slideshow';
 const children=Array.from(g.children);const cards=children.map(child=>{const card=document.createElement('div');card.className='gallery-item';child.replaceWith(card);card.append(child);return card});
 g.classList.add('initialized','copy-gallery');g.dataset.mode=mode;
 const image=card=>card.querySelector('img');
 const ratio=card=>{const img=image(card);return (+img?.getAttribute('width')||1)/(+img?.getAttribute('height')||1)};
 function caption(card){const img=image(card);if(options.captions&&img?.dataset.caption){const el=document.createElement('div');el.className='gallery-caption';el.textContent=img.dataset.caption;card.append(el)}}
 if(mode==='montessori'){
  g.classList.add('copy-collage');g.style.paddingBottom=(+options.height||100)+'%';
  cards.forEach((card,i)=>{const meta=options.meta_data?.[i]||{width:45,x:(i%2)*50,y:Math.floor(i/2)*50};card.style.width=meta.width+'%';card.style.left=(+meta.x||0)+'%';card.style.top='0';card.style.transform=`translateY(0)`;card.style.marginTop=(+meta.y||0)+'%';card.style.zIndex=meta.z||i+1;card.style.padding=(+options.image_padding||0)/2+'rem';caption(card)});
 }else if(mode==='freeform'){
  g.classList.add('copy-freeform');cards.forEach((card,i)=>{card.style.width=(options.meta_data?.[i]?.width||100/cards.length)+'%';card.style.padding=(+options.image_padding||0)/2+'rem';caption(card)});
 }else if(mode==='justify'||mode==='grid'||mode==='columns'){
  g.classList.add('copy-justify');cards.forEach(caption);
  function layout(){
   const width=g.clientWidth;if(!width)return;const unit=parseFloat(getComputedStyle(document.documentElement).fontSize)||10;
   const gap=(+options.image_padding||0)*unit,target=(+options.row_height||25)*unit;
   let rows=[],row=[],sum=0;for(const card of cards){row.push(card);sum+=ratio(card);if((+options.variation_mode===2&&row.length===3)||(+options.variation_mode!==2&&sum*target+gap*(row.length-1)>=width)){rows.push(row);row=[];sum=0}}if(row.length)rows.push(row);
   g.replaceChildren();rows.forEach((items,i)=>{const el=document.createElement('div');el.className='gallery-row';el.style.gap=gap+'px';el.style.marginBottom=gap+'px';const sum=items.reduce((n,c)=>n+ratio(c),0);const h=(width-gap*(items.length-1))/sum;items.forEach(card=>{card.style.width=ratio(card)*h+'px';el.append(card)});g.append(el)});
  }
  new ResizeObserver(layout).observe(g);layout();
 }else{
  g.classList.add('copy-slideshow');let index=0;
  const captionEl=document.createElement('div');captionEl.className='gallery-caption';g.after(captionEl);
  const heightRatio=Math.min(...cards.map(c=>1/ratio(c)));
  function show(n){index=(n+cards.length)%cards.length;cards.forEach((card,i)=>{card.classList.toggle('current',i===index);card.setAttribute('aria-hidden',String(i!==index));card.style.aspectRatio=String(1/heightRatio)});const img=image(cards[index]);if(img&&!img.src)img.src=img.dataset.src;captionEl.textContent=options.captions?(img?.dataset.caption||img?.alt||''):''}
  for(const [text,dir,cls] of [['‹',-1,'prev'],['›',1,'next']]){const b=document.createElement('button');b.type='button';b.textContent=text;b.className='gallery-control '+cls;b.setAttribute('aria-label',dir<0?'Previous image':'Next image');b.addEventListener('click',()=>show(index+dir));g.append(b)}
  g.tabIndex=0;g.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1))}});
  let startX=0;g.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});g.addEventListener('touchend',e=>{let d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>40)show(index+(d<0?1:-1))},{passive:true});
  show(0);if(options.autoplay)setInterval(()=>{if(g.getBoundingClientRect().bottom>0&&g.getBoundingClientRect().top<innerHeight&&!g.matches(':hover')&&!g.contains(document.activeElement))show(index+1)},1000*(+options.autoplaySpeed||2.5));
 }
});
const zoom=document.querySelector('#zoom');document.querySelectorAll('.content img').forEach(img=>{if(!img.closest('a'))img.addEventListener('click',()=>{zoom.querySelector('img').src=img.src;zoom.querySelector('img').alt=img.alt||'Artwork';zoom.showModal()})});zoom.querySelector('button').addEventListener('click',()=>zoom.close());zoom.addEventListener('click',e=>{if(e.target===zoom)zoom.close()});
