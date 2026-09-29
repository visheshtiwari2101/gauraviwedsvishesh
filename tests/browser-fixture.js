// Simulates transport and media only on the isolated 4174 QA host.
(() => {
 const mode=new URLSearchParams(location.search).get('mode')||'success';
 let submissions=0,instances=0,plays=0,pauses=0,videoId="",seeks=0,fixturePlayer,payload={};
 const report=document.createElement('output');report.id='qa-report';report.setAttribute('aria-label','Local QA results');
 report.style.cssText='position:fixed;top:0;left:0;z-index:1000;max-width:100%;background:#fff;color:#222;padding:3px 7px;font:11px monospace;pointer-events:none';
 document.body.append(report);
 // Test-only telemetry: read via the DOM, never included in production files.
 let shifts=0,longTasks=0;
 if('PerformanceObserver' in window){
  for(const type of ['layout-shift','longtask'])try{
   new PerformanceObserver(list=>{
    for(const entry of list.getEntries()){
     if(type==='layout-shift'&&!entry.hadRecentInput)shifts+=entry.value;
     if(type==='longtask')longTasks++;
    }
    report.dataset.layoutShift=String(shifts);report.dataset.longTasks=String(longTasks);
   }).observe({type,buffered:true});
  }catch{}
 }
 const update=()=>report.textContent=JSON.stringify({mode,submissions,instances,plays,pauses,videoId,seeks,payload});update();
 const originalFetch=window.fetch.bind(window);
 window.fetch=async(input,options)=>{
  if(!String(input).includes('script.google.com/macros/'))return originalFetch(input,options);
  submissions++;payload=Object.fromEntries(options.body);update();
  await new Promise(resolve=>setTimeout(resolve,1500));
  if(mode==='error')throw new TypeError('Simulated offline transport');
  return new Response('{"ok":true}',{status:200,headers:{'Content-Type':'application/json'}});
 };
 window.YT={Player:class{
  constructor(id,options){instances++;fixturePlayer=this;videoId=options.videoId;this.events=options.events;queueMicrotask(()=>this.events.onReady({target:this}));update();}
  setVolume(){}
  playVideo(){plays++;if(mode==='blocked'&&plays===1)this.events.onAutoplayBlocked();else this.events.onStateChange({data:1});update();}
  unMute(){}
  seekTo(){seeks++;update();}
  pauseVideo(){pauses++;this.events.onStateChange({data:2});update();}
 }};
 const endButton=document.createElement('button');endButton.textContent='QA: finish track';endButton.style.cssText='position:fixed;top:40px;left:0;z-index:1000;font-size:11px';endButton.onclick=()=>fixturePlayer?.events.onStateChange({data:0});document.body.append(endButton);
 const append=document.head.append.bind(document.head);
 document.head.append=(...nodes)=>{
  for(const node of nodes)if(node.id==='youtube-api'){node.removeAttribute('src');node.type='text/plain';queueMicrotask(()=>window.onYouTubeIframeAPIReady());}
  return append(...nodes);
 };
 if(mode==='reduced'){
  const original=window.matchMedia.bind(window);
  window.matchMedia=query=>query.includes('prefers-reduced-motion')?{matches:true,media:query,addEventListener(){},removeEventListener(){}}:original(query);
  addEventListener('load',()=>{
   let css='';for(const sheet of document.styleSheets){try{for(const rule of sheet.cssRules){if(rule.conditionText?.includes('prefers-reduced-motion: reduce'))css+=[...rule.cssRules].map(item=>item.cssText).join('\n');}}catch{}}
   const style=document.createElement('style');style.textContent=css;document.head.append(style);
  });
 }
})();
