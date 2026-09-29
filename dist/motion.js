// Native scrolling, cached document geometry and one scheduled write pass.
// No per-scroll DOM queries, layout measurements, scroll interception or idle loop.
export function createInvitationMotion(root, reducedMotion, updateAtmosphere = () => {}) {
  const compact = matchMedia('(max-width: 700px)');
  const connection = navigator.connection;
  const economical = Boolean(connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
  const activeLayers = new Set(), activeReveals = new Set(), ambientVisible = new Set();
  const finished = new WeakSet();
  const entrances = new Set();
  const layerRecords = new Map(), revealRecords = new Map();
  let runningAmbient = new Set();
  let pageHeight = 1;
  let layers = [], reveals = [], ambient = [], frame = 0, needsMeasure = true, viewport = innerHeight, viewportWidth = innerWidth, timeline, timelineTop = 0, timelineHeight = 1, enabled = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  const documentTop = el => { let top = 0; for (let node = el; node; node = node.offsetParent) top += node.offsetTop; return top; };
  const layerObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const record = layerRecords.get(entry.target);
      if (!record) continue;
      if (entry.isIntersecting) activeLayers.add(record); else activeLayers.delete(record);
      record.el.classList.toggle('depth-active', entry.isIntersecting && !reducedMotion.matches && !economical);
    }
    schedule();
  }, { rootMargin: '120px 0px' });
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const record = revealRecords.get(entry.target);
      if (!record) continue;
      if (entry.isIntersecting) activeReveals.add(record); else activeReveals.delete(record);
    }
    schedule();
  }, { rootMargin: '0px 0px -5% 0px' });
  const ambientObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) ambientVisible.add(entry.target); else ambientVisible.delete(entry.target);
    }
    updateAmbient();
  }, { threshold: 0.05 });

  function updateAmbient() {
    const stopped=reducedMotion.matches||document.hidden;
    const plantBudget=stopped?0:economical?4:compact.matches?10:26;
    const visible=[...ambientVisible];
    const plants=visible.filter(el=>el.dataset.breezeSide);
    const sidePlants=side=>{
      const items=plants.filter(el=>el.dataset.breezeSide===side);
      const flowers=items.filter(el=>el.dataset.ambient==='flower'),leaves=items.filter(el=>el.dataset.ambient!=='flower');
      const result=[];for(let i=0;i<Math.max(flowers.length,leaves.length);i++){if(leaves[i])result.push(leaves[i]);if(flowers[i])result.push(flowers[i]);}return result;
    };
    const left=sidePlants('left'),right=sidePlants('right');
    const balanced=[];
    for(let i=0;i<Math.max(left.length,right.length);i++){if(left[i])balanced.push(left[i]);if(right[i])balanced.push(right[i]);}
    const other=visible.filter(el=>!el.dataset.breezeSide);
    const priority=el=>el.dataset.ambient==='cloud'?0:el.dataset.ambient==='flock'?1:String(el.dataset.ambient||'').startsWith('ceremony-')?2:3;
    const running=new Set([...balanced.slice(0,plantBudget),...other.sort((a,b)=>priority(a)-priority(b)).slice(0,stopped?0:economical?2:5)]);
    for(const el of runningAmbient)if(!running.has(el))el.classList.toggle('ambient-running',false);
    for(const el of running)if(!runningAmbient.has(el))el.classList.toggle('ambient-running',true);
    runningAmbient=running;
  }

  function measure() {
    viewport = innerHeight;
    pageHeight = root.offsetHeight || 1;
    for (const item of layers) { item.top = documentTop(item.scene); item.height = item.scene.offsetHeight; }
    if (timeline) { timelineTop = documentTop(timeline); timelineHeight = timeline.offsetHeight || 1; }
    needsMeasure = false;
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  function paint() {
    frame = 0;
    if (!enabled || document.hidden) return;
    // All geometry reads finish before any animation writes.
    if (needsMeasure) measure();
    const y = scrollY;
    updateAtmosphere(clamp(y / Math.max(1,pageHeight - viewport)));
    if (reducedMotion.matches) return;
    const multiplier = economical ? 0 : compact.matches ? 0.3 : 0.7;
    const maxTravel = compact.matches ? 12 : 34;
    for (const item of activeLayers) {
      const shift = Math.max(-maxTravel, Math.min(maxTravel, (y + viewport / 2 - item.top - item.height / 2) * item.speed * multiplier));
      const transform = `translate3d(${(shift * .18).toFixed(2)}px,${shift.toFixed(2)}px,0)`;
      if(item.transform!==transform){item.el.style.transform=transform;item.transform=transform;}
    }
    for (const item of activeReveals) {
      if (finished.has(item.el)) { activeReveals.delete(item); continue; }
      const distance = compact.matches ? 12 : 19;
      let x = 0, vertical = 0, scale = 1;
      if (item.kind === 'left') x = -distance;
      else if (item.kind === 'right') x = distance;
      else if (item.kind === 'scale') scale = .975;
      else if (item.kind !== 'fade') vertical = distance;
      // One native, finite entrance: it finishes even when scrolling stops.
      // No character splitting, replay or layout animation; translation stays intact.
      const from = {opacity:0,transform:`translate3d(${x}px,${vertical}px,0) scale(${scale})`};
      const to = {opacity:1,transform:'translate3d(0,0,0) scale(1)'};
      if (item.kind === 'mask' && !compact.matches) { from.clipPath='inset(0 0 100% 0)';to.clipPath='inset(0 0 0% 0)'; }
      finished.add(item.el); activeReveals.delete(item); revealObserver.unobserve(item.el);
      item.el.classList.add('reveal-complete');
      if (item.el.animate && !economical) {
        const animation=item.el.animate([from,to],{duration:item.kind==='scale'?850:680,delay:item.delay,easing:'cubic-bezier(.2,.65,.25,1)',fill:'backwards'});
        entrances.add(animation);
        animation.onfinish=()=>entrances.delete(animation);
      }
    }
    if (timeline) timeline.style.setProperty('--progress', reducedMotion.matches ? 1 : clamp((y + viewport * .75 - timelineTop) / timelineHeight));
  }

  function refresh() { needsMeasure = true; schedule(); }
  function start() {
    if (enabled) { refresh(); return; }
    enabled = true;
    root.classList.add('motion-ready');
    root.dataset.motionQuality = reducedMotion.matches ? 'none' : economical ? 'minimal' : compact.matches ? 'mobile' : 'full';
    layers = [...root.querySelectorAll('[data-depth]')].map(el => ({ el, scene: el.closest('.scene') || el, speed: Number(el.dataset.depth), top: 0, height: 0 }));
    reveals = [...root.querySelectorAll('[data-reveal]')].map(el => ({ el, kind: el.dataset.reveal, delay:Math.min(180,Number(el.dataset.revealDelay)||0) }));
    ambient = [...document.querySelectorAll('[data-ambient]')];
    timeline = root.querySelector('.timeline');
    for (const item of layers) {layerRecords.set(item.el,item);layerObserver.observe(item.el);}
    for (const item of reveals) {revealRecords.set(item.el,item);if (!finished.has(item.el)) revealObserver.observe(item.el);}
    for (const el of ambient) ambientObserver.observe(el);
    if (reducedMotion.matches) preferenceChanged();
    refresh(); updateAmbient();
  }
  function preferenceChanged() {
    root.dataset.motionQuality = reducedMotion.matches ? 'none' : economical ? 'minimal' : compact.matches ? 'mobile' : 'full';
    if (reducedMotion.matches) {
      for (const animation of entrances) animation.cancel();
      entrances.clear();
      for (const { el } of [...layers, ...reveals]) { el.style.removeProperty('transform'); el.style.removeProperty('opacity'); }
      for(const item of layers)item.transform=null;
      for (const item of reveals) { finished.add(item.el); item.el.classList.add('reveal-complete'); }
      revealObserver.disconnect(); activeReveals.clear();
      timeline?.style.setProperty('--progress', 1);
    }
    updateAmbient(); refresh();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    // Mobile browser bars and keyboards change height while scrolling. They do
    // not require remeasuring the complete invitation on every resize event.
    viewport = innerHeight;
    if (innerWidth !== viewportWidth) { viewportWidth = innerWidth; refresh(); }
    else schedule();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { updateAmbient(); if (!document.hidden) refresh(); });
  reducedMotion.addEventListener('change', preferenceChanged);
  compact.addEventListener('change', preferenceChanged);
  const resizeObserver = new ResizeObserver(refresh);
  resizeObserver.observe(root);
  document.fonts?.ready.then(refresh);
  return { start, refresh };
}
