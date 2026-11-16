import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {galleryFrames} from '../app/src/work-gallery-data.js';

let images=0;
for(const frame of galleryFrames){
 if(frame.href)await access(frame.href);
 for(const media of frame.media){
  assert.ok(media.alt);
  await access(media.src.startsWith('file:')?new URL(media.src):media.src);
  if(!media.src.startsWith('file:'))await access(`public/${media.src}`);
  images++;
 }
}
const component=await readFile('app/src/work-gallery.jsx','utf8');
const css=await readFile('app/src/work-gallery.css','utf8');
assert.ok(!/scrollIntoView|preventDefault\(\).*wheel|transition:\s*all/.test(component+css));
assert.match(component,/prefers-reduced-motion/);assert.match(component,/\.kill\(\)/);assert.match(component,/observer.disconnect\(\)/);
assert.match(component,/ArrowRight/);assert.match(component,/visibilitychange/);
assert.ok(!/setProject|galleryChapter|wg-project-count|wg-details/.test(component),'Project-specific content must not replace the original introduction');
console.log(`PASS: ${galleryFrames.length} gallery compositions, ${images} source images, working local destinations, reduced-motion and keyboard controls, animation cleanup.`);
