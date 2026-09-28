import {readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const files=['index.html','style.css','journey.css','refinements.css','world.css','world.js','drift.js','assets/garden-elements.webp','assets/cloud-wisps.webp','assets/garden-accents.webp','app.js','motion.js','config.js','services.js','assets/ganesha.png','assets/monogram.png','assets/canopy.webp','assets/garden.webp','assets/ceremonies.webp','assets/grove.webp','assets/meadow.webp'];
for(const file of files)await stat(`dist/${file}`);
for(const file of ['app.js','world.js','drift.js','motion.js','config.js','services.js'])execFileSync(process.execPath,['--check',`dist/${file}`]);
const expected={'ganesha.png':'e82e2bd11a2e884583f8e5d1dd7d757fd68dbdd3839a7d68c3b189122dbacc6c','monogram.png':'3ce71935f7fee4b66a24d2ddd47d0a4140218c98b1e6e89142c6be6ea68ae2ec'};
for(const [name,hash] of Object.entries(expected)){if(createHash('sha256').update(await readFile(`dist/assets/${name}`)).digest('hex')!==hash)throw new Error(`Official asset changed: ${name}`);}
console.log('Production static build verified: scripts, assets and original artwork checksums pass. Output: dist/');
