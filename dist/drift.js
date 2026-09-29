// Fifteen reusable fragments: three times the previous density, without timers.
// CSS handles the motion, with no timers, scroll handlers or per-frame JS.
export function mountFallingBotanicals() {
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const fragments=[];
  const kinds=['leaf','bougainvillea','mogra','bougainvillea','fragment','marigold'];
  for(let i=0;i<15;i++) {
    const el=document.createElement('div');
    el.className=`falling-botanical falling-depth-${i%3}`;
    el.setAttribute('aria-hidden','true');
    el.innerHTML='<span></span>';
    el.style.setProperty('--fall-time',`${[25,21,18,23,20][i%5]}s`);
    el.style.setProperty('--fall-delay',`${-(i+.5)*1.53}s`);
    const renew=()=>{
      el.dataset.kind=kinds[Math.floor(Math.random()*kinds.length)];
      el.style.setProperty('--start-x',`${8+Math.random()*82}vw`);
      el.style.setProperty('--swing',`${(Math.random()>.5?1:-1)*(15+Math.random()*30)}px`);
      el.style.setProperty('--turn',`${70+Math.random()*140}deg`);
      el.style.setProperty('--fragment-size',`${[5,7,9][i%3]+Math.random()*3}px`);
    };
    renew();el.addEventListener('animationiteration',event=>{if(event.target===el)renew();});
    document.body.append(el);fragments.push(el);
  }
  const sync=()=>fragments.forEach(el=>el.style.animationPlayState=document.hidden||media.matches?'paused':'running');
  document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);sync();
}
