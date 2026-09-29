import {readFile,writeFile} from 'node:fs/promises';
const base=await readFile('dist/assets/connecting-vines.svg','utf8');
let extra='';for(let i=-1;i<17;i++){const tile=[1,4,0,3][((i%4)+4)%4];extra+=`<svg x="${i%2?0:20}" y="${i*30}" width="36" height="36" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet" opacity=".8"><use href="#plants" x="${-(tile%3)*512}" y="${-Math.floor(tile/3)*512}"/></svg>`;}
const accents=(await readFile('dist/assets/garden-accents.webp')).toString('base64');
extra+=`<defs><image id="flowers" width="1024" height="512" href="data:image/webp;base64,${accents}"/></defs>`;
for(let i=0;i<8;i++)extra+=`<svg x="${i%2?0:25}" y="${i*60+4}" width="30" height="30" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet" opacity=".85"><use href="#flowers"/></svg>`;
await writeFile('dist/assets/connecting-vines-mobile.svg',base.replace(/<\/svg>$/,extra+'</svg>'));
