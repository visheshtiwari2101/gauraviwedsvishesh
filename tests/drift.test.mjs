import test from 'node:test';
import assert from 'node:assert/strict';
import {mountFallingBotanicals} from '../dist/drift.js';

test('falling botanicals reuse fifteen nodes and pause for reduced motion and hidden tabs',()=>{
 const nodes=[],listeners={};
 const media={matches:false,addEventListener(type,fn){this.change=fn;}};
 globalThis.matchMedia=()=>media;
 globalThis.document={hidden:false,body:{append(el){nodes.push(el);}},addEventListener(type,fn){listeners[type]=fn;},createElement(){return {dataset:{},events:{},style:{setProperty(k,v){this[k]=v;}},setAttribute(){},addEventListener(k,v){this.events[k]=v;}};}};
 mountFallingBotanicals();assert.equal(nodes.length,15);
 for(let i=0;i<100;i++)for(const node of nodes){node.events.animationiteration({target:node});assert.ok(parseFloat(node.style['--start-x'])>=8);assert.ok(parseFloat(node.style['--start-x'])<=90);}
 assert.equal(nodes.length,15,'iterations reuse nodes instead of spawning particles');
 document.hidden=true;listeners.visibilitychange();assert.ok(nodes.every(n=>n.style.animationPlayState==='paused'));
 document.hidden=false;media.matches=true;media.change();assert.ok(nodes.every(n=>n.style.animationPlayState==='paused'));
 media.matches=false;media.change();assert.ok(nodes.every(n=>n.style.animationPlayState==='running'));
});
