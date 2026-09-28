// Three reusable fragments; randomness changes only at the end of each fall.
// CSS handles the motion, with no timers, scroll handlers or per-frame JS.
export function mountFallingBotanicals() {
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const fragments=[];
  const kinds=['leaf','bougainvillea','mogra','bougainvillea','fragment','marigold'];
  for(let i=0;i<3;i++) {
    const el=document.createElement('div');
    el.className=`falling-botanical falling-depth-${i}`;
    el.setAttribute('aria-hidden','true');
    el.innerHTML='<span></span>';
    el.style.setProperty('--fall-time',`${[29,23,19][i]}s`);
    el.style.setProperty('--fall-delay',`${[-16,-5,-11][i]}s`);
    const renew=()=>{
      el.dataset.kind=kinds[Math.floor(Math.random()*kinds.length)];
      el.style.setProperty('--start-x',`${8+Math.random()*82}vw`);
      el.style.setProperty('--swing',`${(Math.random()>.5?1:-1)*(15+Math.random()*30)}px`);
      el.style.setProperty('--turn',`${70+Math.random()*140}deg`);
      el.style.setProperty('--fragment-size',`${[5,7,9][i]+Math.random()*3}px`);
    };
    renew();el.addEventListener('animationiteration',event=>{if(event.target===el)renew();});
    document.body.append(el);fragments.push(el);
  }
  const sync=()=>fragments.forEach(el=>el.style.animationPlayState=document.hidden||media.matches?'paused':'running');
  document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);sync();
}
