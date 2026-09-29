// Small code-native connecting vines; existing watercolor sprites remain the focal foliage.
import {readFile,writeFile} from 'node:fs/promises';
let drawing='<path d="M28 0 C8 40 48 80 28 120 S8 200 28 240 S48 320 28 360 S8 440 28 480" fill="none" stroke="#7e8964" stroke-width="1.1"/>';
for(let i=0;i<24;i++){
 const y=i*20+8,x=28+Math.sin(y/38)*9,side=i%2?-1:1;
 drawing+=`<g transform="translate(${x} ${y}) scale(${side} 1)"><path d="M0 0 Q10 -5 17 -13 Q18 -1 0 0" fill="${i%3?'#85936d':'#a1aa83'}" opacity=".75"/><path d="M0 0 L14 -10" stroke="#6e7d59" stroke-width=".5"/>`;
 if(i%3===0)for(let j=0;j<3;j++)drawing+=`<path d="M${8+j*3} ${2-j*2} q-6 -8 1 -9 q7 1 3 8Z" fill="${i%9===0?'#d0aa63':i%9===3?'#bb8b81':'#f1ecd8'}" stroke="#a69473" stroke-width=".25" opacity=".85"/>`;
 drawing+='</g>';
}
const sheet=(await readFile(new URL('../dist/assets/garden-elements.webp',import.meta.url))).toString('base64');
const definitions=`<defs><image id="plants" width="1536" height="1024" href="data:image/webp;base64,${sheet}"/></defs>`;
// Overlap the boundary copies too, so a repeated strip never has a seam.
for(let i=-1;i<17;i++){
 const index=((i%16)+16)%16;
 const tile=[0,1,3,4,0,2][index%6],x=(tile%3)*512,y=Math.floor(tile/3)*512;
 drawing+=`<svg x="${i%2?1:7}" y="${i*30-6}" width="48" height="60" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet" opacity=".78"><use href="#plants" x="${-x}" y="${-y}"/></svg>`;
}
await writeFile(new URL('../dist/assets/connecting-vines.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="480" viewBox="0 0 56 480">${definitions}${drawing}</svg>`);
