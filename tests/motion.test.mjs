import test from 'node:test';
import assert from 'node:assert/strict';
import {createInvitationMotion} from '../dist/motion.js';

test('scroll work is batched without layout reads, ambient motion is bounded, and reduced motion clears effects', async () => {
 let layoutReads=0, nextFrame=0;
 const animations=[];
 const callbacks=new Map(),listeners={},observers=[];
 function element(top=0,height=100) {
  const classes=new Set();
  return {dataset:{},offsetParent:null,get offsetTop(){layoutReads++;return top;},get offsetHeight(){layoutReads++;return height;},
   animate(frames,options){const animation={frames,options,cancelled:false,cancel(){this.cancelled=true;}};animations.push(animation);return animation;},
   style:{setProperty(key,value){this[key]=value;},removeProperty(key){delete this[key];}},
   classList:{add(name){classes.add(name);},toggle(name,enabled){if(enabled)classes.add(name);else classes.delete(name);},contains(name){return classes.has(name);}}};
 }
 const compact={matches:true,addEventListener(){}},reduced={matches:false,addEventListener(name,fn){this.change=fn;}};
 const scene=element(200,1200),layer=element(),reveal=element(650),timeline=element(1500,1600),ambient=Array.from({length:60},()=>element());
 layer.dataset.depth='.06';layer.closest=()=>scene;reveal.dataset.reveal='left';
 ambient[0].dataset.ambient='cloud';ambient[1].dataset.ambient='flight';
 ambient[2].dataset.breezeSide='left';ambient[3].dataset.breezeSide='right';
 ambient.slice(5).forEach((el,i)=>{el.dataset.breezeSide=i%2?'left':'right';el.dataset.ambient=i%3?'leaf':'flower';});
 const root=element(0,4000);root.querySelectorAll=selector=>selector==='[data-depth]'?[layer]:[reveal];root.querySelector=()=>timeline;
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{hardwareConcurrency:8,deviceMemory:8}});
 Object.assign(globalThis,{innerHeight:800,innerWidth:390,scrollY:0,matchMedia:()=>compact,
  window:{addEventListener(name,fn){listeners[name]=fn;}},
  document:{hidden:false,querySelectorAll:()=>ambient,addEventListener(){},fonts:{ready:Promise.resolve()}},
  requestAnimationFrame:fn=>{callbacks.set(++nextFrame,fn);return nextFrame;},
  IntersectionObserver:class{constructor(callback){this.callback=callback;observers.push(this);}observe(){}unobserve(){}disconnect(){}},
  ResizeObserver:class{observe(){}}
 });
 const flush=()=>{const pending=[...callbacks.values()];callbacks.clear();for(const callback of pending)callback();};
 let atmosphereProgress=0;
 const motion=createInvitationMotion(root,reduced,value=>atmosphereProgress=value);motion.start();
 observers[0].callback([{target:layer,isIntersecting:true}]);observers[1].callback([{target:reveal,isIntersecting:true}]);observers[2].callback(ambient.map(target=>({target,isIntersecting:true})));
 await Promise.resolve();flush();
 assert.equal(ambient.filter(el=>el.classList.contains('ambient-running')).length,17);
 assert.ok(ambient.slice(0,4).every(el=>el.classList.contains('ambient-running')),'cloud, flight and both garden sides share the motion budget');
 assert.equal(animations.length,1,'visible text receives one finite entrance');
 assert.equal(animations[0].frames.at(-1).opacity,1);
 assert.equal(animations[0].options.fill,'backwards','completed text has no persistent animation style');
 observers[1].callback([{target:reveal,isIntersecting:true}]);flush();
 assert.equal(animations.length,1,'scrolling back does not replay a completed reveal');
 layoutReads=0;globalThis.scrollY=300;
 for(let i=0;i<25;i++)listeners.scroll();
 assert.equal(callbacks.size,1,'many scroll events share a single frame');flush();
 assert.equal(layoutReads,0,'ordinary scrolling never reads layout');
 assert.equal(atmosphereProgress,300/3200,'sky follows cached document progress');
 assert.match(layer.style.transform,/translate3d/);
 globalThis.innerHeight=740;listeners.resize();flush();assert.equal(layoutReads,0,'mobile browser bar resizing does not remeasure the page');
 reduced.matches=true;reduced.change();flush();
 assert.equal(ambient.filter(el=>el.classList.contains('ambient-running')).length,0);
 assert.equal(animations[0].cancelled,true,'reduced motion cancels in-flight entrances');
 assert.equal(layer.style.transform,undefined);assert.equal(reveal.style.opacity,undefined);
 assert.equal(root.dataset.motionQuality,'none');assert.equal(timeline.style['--progress'],1);
 globalThis.scrollY=3260;listeners.scroll();flush();
 assert.equal(atmosphereProgress,1,'reduced motion still reaches the sunset without animation');
});
