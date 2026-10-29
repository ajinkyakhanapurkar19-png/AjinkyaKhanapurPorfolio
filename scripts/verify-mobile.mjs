import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';

// Read real font advances without adding dependencies just for verification.
const font=fs.readFileSync('assets/fonts/six-caps.ttf');
const tables={};
for(let i=0;i<font.readUInt16BE(4);i++){
 const at=12+i*16;tables[font.toString('ascii',at,at+4)]=font.readUInt32BE(at+8);
}
const units=font.readUInt16BE(tables.head+18),metricCount=font.readUInt16BE(tables.hhea+34);
let cmap;
for(let i=0;i<font.readUInt16BE(tables.cmap+2);i++){
 const offset=tables.cmap+font.readUInt32BE(tables.cmap+4+i*8+4);
 if(font.readUInt16BE(offset)===4)cmap=offset;
}
assert.ok(cmap,'Six Caps must expose its Unicode BMP character map');
const count=font.readUInt16BE(cmap+6)/2;
function advance(character){
 const code=character.charCodeAt(0);
 for(let i=0;i<count;i++){
  const end=font.readUInt16BE(cmap+14+i*2),start=font.readUInt16BE(cmap+16+count*2+i*2);
  if(code<start||code>end)continue;
  const delta=font.readInt16BE(cmap+16+count*4+i*2),rangeAt=cmap+16+count*6+i*2,range=font.readUInt16BE(rangeAt);
  let glyph=range?font.readUInt16BE(rangeAt+range+(code-start)*2):code;
  if(glyph||!range)glyph=(glyph+delta)&65535;
  return font.readUInt16BE(tables.hmtx+Math.min(glyph,metricCount-1)*4)/units;
 }
 throw new Error(`Missing hero glyph: ${character}`);
}
for(const width of [320,360,390,430,600,768,820,1024,1180]){
 const gutter=Math.min(40,Math.max(20,width*.05)),size=Math.min(180,Math.max(88,width*.25));
 for(const [title,multiplier] of [['AJINKYA',1.35],['KHANAPURKAR',1]]){
  const textWidth=[...title].reduce((sum,char)=>sum+advance(char),0)*size*multiplier+(title.length-1)*.004*size*multiplier;
  assert.ok(textWidth<=width-2*gutter,`${width}: ${title} must fit its actual glyph advances (${textWidth.toFixed(1)}px)`);
 }
}
console.log('PASS: actual hero-font metrics fit at 9 phone/tablet widths.');

const pages=['index.html','pristine-forests-case-study.html','gsc-case-study.html','artist-studio-case-study.html'];
for(const page of pages){
 const html=fs.readFileSync(page,'utf8');
 assert.match(html,/<meta name="viewport"[^>]*viewport-fit=cover/);
 assert.ok(!/maximum-scale=1|user-scalable=no/.test(html));
 const refs=[...html.matchAll(/(?:src|href|poster)="([^"<>]+)"/g),...html.matchAll(/url\(["']?(\.[^\s)'"<>]+)["']?\)/g)].map(match=>match[1]);
 const checked=new Set();
 for(const ref of refs){
  if(!ref.startsWith('./'))continue;
  const target=decodeURIComponent(ref.split(/[?#]/)[0]);
  assert.ok(fs.existsSync(path.resolve(target)),`${page}: missing ${target}`);
  checked.add(target);
 }
 if(page!=='index.html'){
  assert.match(html,/data-portfolio-home="true" href="\.\/index.html"/,'Portfolio back link must resolve');
  assert.match(html,/data-next-project="true" href="\.\/(?:gsc|artist-studio|pristine-forests)-case-study.html"/,'Next case study must resolve');
 }
 console.log(`PASS ${page}: safe viewport, zoom enabled, ${checked.size} local media/bundle/link paths resolve.`);
}
