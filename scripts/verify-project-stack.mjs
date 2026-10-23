import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sampleProjectStack} from '../app/src/project-stack-motion.js';

const sizes=[[360,800],[390,844],[430,932],[600,900],[768,1024],[820,1180],[1024,768],[1366,768],[1440,900],[1920,1080]];
for(const [w,h] of sizes){
 const compact=w<700;
 const cardWidth=compact?Math.min(w*.34,200):Math.min(280,Math.max(138,w*.18));
 const cardHeight=compact?Math.min(208,Math.max(134,w*.37)):Math.min(378,Math.max(190,w*.243));
 const size={width:w*.9,height:h-(compact?210:180),cardWidth,cardHeight,compact};
 const start=sampleProjectStack(0,size),finish=sampleProjectStack(1,size);
 assert.equal(start.cards.filter(card=>card.opacity>0).length,1,`${w}: begins with just one visible frame`);
 assert.equal(start.labels,0);
 assert.equal(finish.labels,1);
 assert.equal(finish.count,4);
 for(const card of finish.cards){
  assert.equal(card.opacity,1);
  assert.ok(card.x>=-.01&&card.x+cardWidth<=size.width+.01,`${w}: final frame fits horizontally`);
  assert.ok(card.y>=0&&card.y+cardHeight+(compact?95:135)<=size.height,`${w}: frame and caption fit vertically`);
 }
 for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
  const a=finish.cards[i],b=finish.cards[j];
  assert.ok(Math.abs(a.x-b.x)>=cardWidth||Math.abs(a.y-b.y)>=cardHeight+85,`${w}: final cards don't overlap`);
 }
 for(const [progress,expected] of [[.04,1],[.30,2],[.53,3],[.78,4]]){
  assert.equal(sampleProjectStack(progress,size).count,expected,`${w}: sequential card reveal`);
 }
 let previous=start;
 const snapshots=[];
 for(let i=0;i<=100;i++){
  const state=sampleProjectStack(i/100,size);snapshots.push(state);
  assert.ok(state.labels>=previous.labels,'Caption reveal is monotonic');
  if(state.labels>0)assert.equal(state.count,4,'Names appear only after all four frames are spread');
  state.cards.forEach((card,n)=>{
   assert.ok(Number.isFinite(card.x)&&Number.isFinite(card.y));
   assert.ok(card.opacity>=0&&card.opacity<=1);
   assert.ok(Math.abs(card.x-previous.cards[n].x)<w*.08,'No horizontal position discontinuity');
  });
  previous=state;
 }
 for(let i=100;i>=0;i--)assert.deepEqual(sampleProjectStack(i/100,size),snapshots[i],'Reverse scrolling follows the identical path');
}
const main=await readFile('app/src/main.jsx','utf8');
assert.equal((main.match(/gsap\.timeline\(/g)||[]).length,1,'One primary scroll timeline');
assert.match(main,/projectReveal\.dispose\(\)/);
assert.match(main,/layout\.projects-layout\.work-layout\.stageHeight/,'Roll duration must stop at the new chapter');
assert.ok(main.indexOf('<ProjectStack ')>main.indexOf('id="work"')&&main.indexOf('<ProjectStack ')<main.indexOf('id="about"'));
console.log('PASS: 10 viewport sizes; single-frame start; ordered four-frame spread; labels last; final bounds; deterministic reverse scroll; shared timeline and cleanup.');
