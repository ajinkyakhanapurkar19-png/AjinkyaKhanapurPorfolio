import {readFile,writeFile,cp,mkdir,rm,readdir} from 'node:fs/promises';
import {resolve,posix} from 'node:path';
import {createServer} from 'vite';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {createHash} from 'node:crypto';
// A scoped export leaves the existing preview pages and their bundles intact.
const selectedPage=process.argv.find(arg=>arg.startsWith('--page='))?.slice(7);
// Keep the story readable before JavaScript loads and in the file preview.
const renderer=await createServer({server:{middlewareMode:true},appType:'custom'});
const prerendered=new Map();
const templateEntries={
 'case-study.html':'/src/case-study.jsx',
 'content-hub-case-study.html':'/src/templates/content-hub/Page.jsx',
 'vr-case-study.html':'/src/templates/vr/Page.jsx',
 'shotgun-case-study.html':'/src/templates/shotgun-original/Page.jsx',
 'pristine-forests-case-study.html':'/src/pristine/Page.jsx',
 'gsc-case-study.html':'/src/gsc/Page.jsx',
 'artist-studio-case-study.html':'/src/artist-studio/Page.jsx'
};
try{
 for(const [page,entry] of Object.entries(templateEntries)){
  if(selectedPage && page!==selectedPage)continue;
  const {default:Page}=await renderer.ssrLoadModule(entry);
  prerendered.set(page,renderToString(React.createElement(Page)));
 }
}finally{await renderer.close();}
// SSR imports use Vite's development /@fs URLs. Resolve them to the actual
// emitted asset by content, including assets that Vite deduplicates.
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const emittedImages=new Map();
for(const name of await readdir('dist/bundles')){
 if(/\.(?:png|jpe?g|webp|gif|svg|avif)$/i.test(name))
  emittedImages.set(digest(await readFile(`dist/bundles/${name}`)),`./bundles/${name}`);
}
for(const [page,markup] of prerendered){
let resolved=markup;
for(const url of new Set(markup.match(/\/@fs\/[^"'()<>&]+/g)||[])){
 const original=decodeURIComponent(url.slice('/@fs'.length).split('?')[0]);
 const output=emittedImages.get(digest(await readFile(original)));
 if(!output)throw new Error(`SSR image was not emitted: ${original}`);
 resolved=resolved.replaceAll(url,output);
}
prerendered.set(page,resolved);
}
const pages=(await readdir('dist')).filter(name=>name.endsWith('.html') && (!selectedPage || name===selectedPage));
if(!pages.length)throw new Error(`No built HTML matched: ${selectedPage}`);
for(const page of pages){
const html=await readFile(`dist/${page}`,'utf8');
const styles=[...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
let output=html;
if(prerendered.has(page))output=output.replace('<div id="root"></div>',`<div id="root">${prerendered.get(page)}</div>`).replace(/<noscript>[\s\S]*?<\/noscript>/,'');
// The design preview inlines local <script src> tags. Inlining an ESM entry
// changes import.meta.url to the document URL and breaks its lazy imports and
// asset URLs. Import the entry by its absolute URL at runtime so it remains an
// external module, retaining the bundles/ base in preview and ordinary hosting.
output=output.replace(/<script\b[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,(_tag,url)=>{
 return `<script type="module" data-portfolio-entry=${JSON.stringify(url)}>\nimport(new URL(${JSON.stringify(url)}, document.baseURI).href);\n</script>`;
});
for(const [tag,url] of styles){
 const css=await readFile(resolve('dist',url),'utf8');
 // Inlining CSS moves its URL base from /bundles/ to the document root.
 const inline=css.replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(match,quote,asset)=>{
  if(/^(?:data:|https?:|\/|#)/.test(asset))return match;
  return `url(${quote}./${posix.join(posix.dirname(url),asset)}${quote})`;
 });
 output=output.replace(tag,`<style>${inline}</style>`);
}
await writeFile(page,output);
}
if(!selectedPage)await rm('bundles',{recursive:true,force:true});
await mkdir('bundles',{recursive:true});
await cp('dist/bundles','bundles',{recursive:true});
// Path-based screenshot slots remain editable without adding JS imports.
await cp('public/assets/pristine-forests','assets/pristine-forests',{recursive:true});
await cp('public/assets/gsc','assets/gsc',{recursive:true});
await cp('public/assets/artist-studio','assets/artist-studio',{recursive:true});
console.log(`Packaged ${pages.join(', ')} with inline CSS and local JS/asset bundles.`);
