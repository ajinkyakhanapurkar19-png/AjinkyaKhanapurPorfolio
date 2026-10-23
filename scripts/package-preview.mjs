import {readFile,writeFile,cp,mkdir,rm} from 'node:fs/promises';
import {resolve,posix} from 'node:path';
const html=await readFile('dist/index.html','utf8');
const styles=[...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
let output=html;
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
await rm('bundles',{recursive:true,force:true});
await mkdir('bundles',{recursive:true});
await cp('dist/bundles','bundles',{recursive:true});
await writeFile('index.html',output);
console.log('Packaged index.html with inline CSS, lazy local JS chunks, and local photography.');
