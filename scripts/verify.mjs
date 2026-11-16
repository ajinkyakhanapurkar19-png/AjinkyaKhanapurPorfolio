import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {profile,projects} from '../app/src/content.js';
const source=await readFile('app/src/main.jsx','utf8');
const chapterSource=source+await readFile('app/src/work-gallery.jsx','utf8')+await readFile('app/src/project-stack.jsx','utf8');
const css=await readFile('app/src/portfolio.css','utf8');
const base=await readFile('app/src/seed.css','utf8');
const html=await readFile('index.html','utf8');
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length,'Project IDs must be unique');
for(const p of projects){assert.ok(p.title);await access(`assets/${p.image}`);if(p.url)assert.match(p.url,/^https:\/\//);}
assert.equal(projects.length,8);
assert.equal((await readFile(new URL(profile.resume))).subarray(0,5).toString(),'%PDF-','Resume must resolve to the supplied PDF');
assert.equal(profile.email,'ajinkyakhanapurkar19@gmail.com');
assert.match(source,/navigator.clipboard.writeText/);
assert.match(source,/showModal\(\)/);
assert.match(source,/previousFocus.current\?\.focus/);
assert.match(source,/mm.revert/);
assert.match(css,/prefers-reduced-motion:reduce/);
assert.match(css,/@media \(max-width:600px\)/);
assert.match(source,/onCancel/);
assert.equal((chapterSource.match(/<section /g)||[]).length,7);
assert.equal((chapterSource.match(/data-od-id="(?:camera|focus|screen|work|projects|about|contact)"/g)||[]).length,7);
assert.equal((chapterSource.match(/\sid="projects"/g)||[]).length,1,'Selected projects has one destination');
assert.ok(source.indexOf('<ProjectStack ')>source.indexOf('<WorkGallery '),'Project tiles are mounted after the moving gallery');
assert.ok(source.indexOf('<ProjectStack ')<source.indexOf('<section id="about"'),'Project tiles precede About');
// A hidden anchor alone previously passed verification after the tiles vanished.
// Render the real component and require four named, working case-study links.
const renderer=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:ProjectStack}=await renderer.ssrLoadModule('/src/project-stack.jsx');
 const tiles=renderToStaticMarkup(React.createElement(ProjectStack));
 assert.match(tiles,/<section id="projects"/);
 const links=[...tiles.matchAll(/<a[^>]*class="[^"]*project-card-link[^"]*"[^>]*href="([^"]+)"[^>]*aria-label="View ([^"]+) case study"/g)];
 assert.equal(links.length,4,'All four visible project tiles must open a case study');
 assert.equal(new Set(links.map(link=>link[1])).size,4,'Each tile opens its own case study');
 for(const [,href] of links)await access(href);
 for(const [,url] of tiles.matchAll(/(?:src|href)="(\/@fs\/[^"?]+)[^"]*"/g))await access(decodeURIComponent(url.slice('/@fs'.length)));
}finally{await renderer.close();}
assert.ok(!source.includes('scrollIntoView('));
assert.ok(!source.includes('[REPLACE]'));
assert.ok(!css.includes('transition:all'));
assert.match(html,/^<!doctype html>/i);
for(const [,src] of html.matchAll(/(?:src|href)="(\.\/bundles\/[^\"]+)"/g))await access(src.slice(2));
const withoutComments=(base+css).replace(/\/\*[\s\S]*?\*\//g,'');
assert.ok(!/#[0-9a-f]{3,8}\b/i.test(withoutComments),'UI colors must be tokenized');
console.log('PASS: 8 audited records, 7 labelled sections, 4 rendered project tiles and destinations, local images/bundles, dialog/focus/clipboard paths, responsive/reduced-motion styles.');
// Packaged CSS is inline; its font URLs must still resolve from index.html.
for(const [,url] of html.matchAll(/url\(['"]?(\.\/bundles\/[^)'"\s]+)['"]?\)/g))await access(url.slice(2));
const scene=await readFile('app/src/scene.jsx','utf8');
assert.match(scene,/sony-a7s-iii\.glb/);
assert.ok(!source.includes('className="film-track"'),'The scroll gallery must be removed');
assert.ok(!source.includes('pinTrigger'),'No obsolete project pin may remain');
assert.ok(source.includes('id="screen"'));
assert.ok(chapterSource.includes('id="work"'),'Work navigation must resolve to the roll chapter');
assert.match(source,/AJINKYA<\/span>\{' '\}<span>KHANAPURKAR/);
console.log('PASS: supplied GLB integration, hero name and packaged font URL.');
