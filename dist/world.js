import {mountFallingBotanicals} from './drift.js';
// A shared landscape spans the invitation, independently of its sections.
export function mountGarden(root) {
  mountFallingBotanicals();
  const atmosphere = document.createElement('div');
  atmosphere.className = 'atmosphere';
  atmosphere.setAttribute('aria-hidden', 'true');
  atmosphere.innerHTML = '<div class="sky-afternoon"></div><div class="sky-sunset"></div><div class="sky-clouds" data-ambient="cloud"></div>';
  document.body.prepend(atmosphere);
  const world = document.createElement('div');
  world.className = 'botanical-world';
  world.setAttribute('aria-hidden', 'true');
  // Unequal sequences and intervals avoid mirrored borders. Only selected
  // branches move; a single shared sprite sheet supplies six small components.
  let markup = '';
  const compact = matchMedia('(max-width: 700px)').matches;
  for (const side of ['left','right']) {
    const seed = side === 'left' ? 0 : 7;
    for (const [depth, count] of [['distant',compact?24:49],['middle',compact?48:83],['foreground',compact?16:23]]) {
      markup += `<div class="garden-rail ${side} ${depth}">`;
      for (let i=0;i<count;i++) {
        const n=i+seed;
        const tile = depth==='foreground' ? (i%2 ? 0:3) : n%13===8 ? 5 : n%9===5 ? 4 : [0,1,2,3,1,0,2][n%7];
        const top = (i+.1+(n%3)*.16)*100/count;
        const size = 145+(n*37)%80;
        const angle = -26+(n*13)%54;
        const animate = depth!=='distant' || i%3===0;
        const parallax = !compact || (depth!=='distant' && i%3===0);
        markup += `<div class="garden-piece" ${parallax?`data-depth="${depth==='foreground'?'.19':depth==='distant'?'.025':'.085'}"`:''} style="top:${top.toFixed(2)}%;--size:${size}px;--angle:${angle}deg;--flip:${n%3===0?-1:1};--inset:${n%4*9}px;--breeze:${7+n%9}s;--delay:-${n%17}s;--bend:${9+n%4*1.3}deg"><div class="garden-sway" data-breeze-side="${side}" ${animate?`data-ambient="${tile===5?'bird':tile===1?'vine':tile===2?'grass':'leaf'}"`:''}><div class="garden-sprite tile-${tile}"></div></div></div>`;
      }
      markup += '</div>';
    }
  }
  world.innerHTML=markup;
  for(const side of ['left','right']) {
    const rail=world.querySelector(`.${side}.middle`);
    const flowers=compact?64:96;
    for(let i=0;i<flowers;i++) {
      const type=i%6<4?'bougainvillea':i%6===4?'tile-1':'tile-4';
      rail.insertAdjacentHTML('beforeend',`<div class="garden-piece flower-piece" ${!compact||i%8===0?'data-depth=".11"':''} style="top:${(i+.3+(side==='right'?.4:0))*100/flowers}%;--size:${51+i%4*7}px;--angle:${-18+i%5*9}deg;--flip:${side==='left'?1:-1};--breeze:${6+(i+(side==='right'?2:0))%7}s;--delay:-${(i+(side==='right'?4:0))%13}s;--bend:${9+i%3*1.6}deg"><div class="garden-sway" data-breeze-side="${side}" data-ambient="flower"><div class="garden-sprite ${type}"></div></div></div>`);
    }
  }
  // Two sparse, staggered flocks occupy distant sky throughout the journey.
  for(let group=0;group<2;group++) {
    atmosphere.insertAdjacentHTML('beforeend',`<div class="sky-flock ${group?'reverse':''}" data-ambient="flock" style="top:${group?33:16}%;--flight-period:${group?60:52}s" aria-hidden="true">${Array.from({length:group?3:4},(_,i)=>`<span class="flock-bird" style="--flight-delay:${group*24+i*.7+2}s;--bird-size:${18+i*3}px;--bird-y:${i%2*16-i*5}px;--arc:${18+i*9}px;--flight-period:${(group?60:52)+i*.8}s;--flap-period:${2.8+i*.35}s;--flap-delay:-${i*.6}s"><span></span></span>`).join('')}</div>`);
  }
  root.querySelector('.journey').prepend(world);
  const toran=document.createElement('div');
  toran.className='opening-toran';toran.setAttribute('aria-hidden','true');
  toran.innerHTML=Array.from({length:11},(_,i)=>`<div class="toran-piece toran-${i}" style="--angle:${i%2?-35:35}deg;--flip:${i%2?-1:1};--breeze:${14+i}s;--delay:-${i}s"><div class="garden-sway" ${i%4===0?'data-opening-breeze':''}><div class="garden-sprite tile-${i%4===1?4:i%3===0?1:0}"></div></div></div>`).join('');
  document.querySelector('.opening').prepend(toran);
  const heroToran=toran.cloneNode(true);
  heroToran.classList.add('hero-toran');
  heroToran.querySelectorAll('[data-opening-breeze]').forEach(el=>{el.removeAttribute('data-opening-breeze');el.dataset.ambient='vine';});
  heroToran.querySelectorAll('.toran-piece').forEach((el,i)=>el.dataset.depth=String(i%2?.035:.08));
  root.querySelector('.hero').prepend(heroToran);
  world.querySelectorAll('.middle .garden-sprite').forEach((el,i)=>{if(i%11===3)el.classList.add('bougainvillea');});
  const afternoon=atmosphere.querySelector('.sky-afternoon'), sunset=atmosphere.querySelector('.sky-sunset');
  let lastLight=-1;
  return progress => {
    afternoon.style.opacity=String(Math.min(1,progress*2.1));
    sunset.style.opacity=String(Math.max(0,(progress-.43)/.57));
    const light=Math.round(progress*20)/20;
    if(!compact && light!==lastLight){world.style.setProperty('--evening',String(light*.14));lastLight=light;}
  };
}
