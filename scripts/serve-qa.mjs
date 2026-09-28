// Isolated local browser fixtures. This server and tests are not shipped in dist/.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  let file=resolve(root,'.'+decodeURIComponent(url.pathname));
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  if(url.pathname==='/qa-fixture.js')file=resolve('tests/browser-fixture.js');
  if(url.pathname==='/')file=resolve(root,'index.html');
  let body=await readFile(file);
  if(url.pathname==='/')body=body.toString().replace('<script type="module" src="app.js"></script>','<script src="qa-fixture.js"></script><script type="module" src="app.js"></script>');
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);
 }catch{res.writeHead(404).end('Not found');}
}).listen(4174,'127.0.0.1',()=>console.log('Local QA: http://127.0.0.1:4174'));
