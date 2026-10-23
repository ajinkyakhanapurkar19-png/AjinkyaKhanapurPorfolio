// Regression: the design host inlines local script tags into a srcdoc document.
// Execute the packaged bootstrap in that environment and walk its module URLs.
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {Script} from 'node:vm';

const html=await readFile('index.html','utf8');
const bootstrap=html.match(/<script type="module" data-portfolio-entry="([^"]+)">([\s\S]*?)<\/script>/);
assert.ok(bootstrap,'Preview needs an external-module bootstrap');
assert.ok(!/<script\b[^>]*\bsrc=/.test(html),'Host must not inline the ESM entry');

for(const baseURI of [
 'od://app/api/projects/portfolio/raw/',
 'https://portfolio.example/',
 'https://portfolio.example/nested/index.html',
]){
 let entry;
 const script=new Script(bootstrap[2],{importModuleDynamically:specifier=>{
  entry=specifier;
  return import('node:assert/strict');
 }});
 await script.runInNewContext({URL,document:{baseURI}});
 assert.equal(entry,new URL(bootstrap[1],baseURI).href);
 const visited=new Set();let scenes=0,models=0;
 async function visit(url){
  if(visited.has(url))return;visited.add(url);
  const path=`bundles/${new URL(url).pathname.split('/').at(-1)}`;
  await access(path);
  if(path.endsWith('.glb')){models++;return;}
  if(!path.endsWith('.js'))return;
  if(/\/scene-/.test(path))scenes++;
  const source=await readFile(path,'utf8');
  const references=[
   ...source.matchAll(/\b(?:from\s*|import\s*\(\s*)["'`]([^"'`]+)["'`]/g),
   ...source.matchAll(/new URL\(\s*["'`]([^"'`]+)["'`]\s*,\s*import\.meta\.url/g),
  ];
  for(const [,reference] of references){
   if(!/^(?:\.\/|[^/:]+\.(?:js|glb|jpg|png|ttf)$)/.test(reference))continue;
   const resolved=new URL(reference,url);
   assert.ok(resolved.pathname.includes('/bundles/'),'Lazy chunks and assets must retain their module directory');
   await visit(resolved.href);
  }
 }
 await visit(entry);
 assert.equal(scenes,1,'Lazy camera scene must be reachable');
 assert.equal(models,1,'Supplied camera model must be reachable');
 console.log(`PASS: ${baseURI} → ${visited.size} reachable modules/assets, including scene and GLB`);
}
