import {LCD, contactFraming} from './camera-path.js';

// Restore the original 1000px desktop boundary for mouse/trackpad windows.
// Touch tablets retain the compact composition up to 1200px. Keep the
// complementary queries in portfolio-mobile.css aligned with this policy.
export const DESKTOP_CAMERA_QUERY = '(min-width: 1200px), (min-width: 1000px) and (pointer: fine)';

const clamp = n => Math.max(0, Math.min(1, n));
const smooth = n => {const t = clamp(n); return t * t * (3 - 2 * t);};
const mix = (a, b, t) => a + (b - a) * t;
const tangent = Math.tan(Math.PI / 10); // The scene's 36° field of view.

// Phone/tablet choreography is framed by real document regions. A conservative
// envelope covers the supplied model at every turn; no device-specific pixels.
export function mobileCameraPose(stage, progress, rect, width, height, reduced = false) {
 const distance = 10;
 const viewHeight = 2 * distance * tangent;
 const fit = Math.min(rect.width / height * viewHeight / 5.4, rect.height / height * viewHeight / 3.8) * .93;
 const scale = fit / (1 + fit * 2.7 / distance);
 const pose = {eye:[0,0,distance],target:[0,0,0],position:[0,0,0],rotation:[.22,.62,-.04],scale};
 const frame = {offsetX:width / 2 - rect.x - rect.width / 2, offsetY:height / 2 - rect.y - rect.height / 2};
 if(stage === 'contact') {
  const contact = contactFraming(rect,width,height);
  return {...pose,rotation:[0,Math.PI * 1.5,0],scale:contact.scale,...contact};
 }
 if(stage === 'hero') {
  const p = reduced ? 0 : smooth(progress);
  pose.rotation = [mix(.22,.08,p),mix(.62,.18,p),mix(-.04,0,p)];
 } else if(stage === 'entry' && !reduced) {
  const turn = smooth(progress / .44);
  const align = smooth((progress - .44) / .16);
  const zoom = smooth((progress - .6) / .4);
  pose.rotation = [mix(.08,0,turn),mix(.18,Math.PI,turn),0];
  const screen = [-LCD.center[0]*scale,LCD.center[1]*scale,-LCD.center[2]*scale];
  const endDistance = Math.min(LCD.height,LCD.width / (width/height))*scale / (2*tangent) * .86;
  pose.eye = [screen[0]*align,screen[1]*align,mix(distance,screen[2]+endDistance,zoom)];
  pose.target = screen.map(value=>value*align);
 }
 return {...pose,...frame};
}

// Select only a visible slot. Hero and contact move with the document; entry
// owns one short sticky stage. The reading chapters never have a model behind them.
export function mobileCameraStage(scroll, height, {hero, entry, contact}, reduced = false) {
 const visible = rect => rect.y < height && rect.y + rect.height > 0;
 const inDocument = rect => ({...rect,y:rect.y-scroll});
 const entryRect = {...entry,y:Math.max(entry.y-scroll,Math.min(0,entry.end-scroll-height)),height};
 if(!reduced && scroll >= entry.y-height && scroll < entry.end) {
  return {stage:'entry',rect:entryRect,progress:clamp((scroll-entry.y)/Math.max(1,entry.end-entry.y-height))};
 }
 const contactRect = inDocument(contact);
 if(visible(contactRect)) return {stage:'contact',rect:contactRect,progress:1};
 const heroRect = inDocument(hero);
 if(visible(heroRect)) return {stage:'hero',rect:heroRect,progress:clamp(scroll/Math.max(1,hero.height))};
 return null;
}
