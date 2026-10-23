import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
const clamp = value => Math.max(0, Math.min(1, value));

// A child of the existing scroll journey, with no extra ScrollTrigger or clock.
// Only transforms/opacity change; the final editorial layout stays in flow.
export function createAboutReveal(root, {reduced = false, sticky = true} = {}) {
 const arrival = root.querySelector('.about-arrival');
 const stage = arrival.querySelector('.about-stage');
 const portrait = arrival.querySelector('.portrait-media');
 const copy = [...arrival.querySelectorAll('[data-about-reveal]')];
 const curve = getComputedStyle(document.documentElement).getPropertyValue('--ease-in-out');
 const ease = CustomEase.create('', curve.match(/[\d.]+/g)?.join(',') || '.77,0,.175,1');
 arrival.dataset.animated = String(!reduced && sticky);
 let origin = {x:0,y:0}, previous = -1, lastProgress = 0;

 function measure() {
  const transform = portrait.style.transform;
  portrait.style.transform = 'none';
  const rect = portrait.getBoundingClientRect(), bounds = stage.getBoundingClientRect();
  origin = {
   x: bounds.left + bounds.width / 2 - (rect.left + rect.width / 2),
   y: bounds.top + (sticky ? bounds.height / 2 : Math.min(innerHeight * .3, bounds.height / 2)) - (rect.top + rect.height / 2)
  };
  portrait.style.transform = transform;
  previous = -1;
  paint(lastProgress);
 }

 function paint(progress) {
  lastProgress = progress;
  const p = reduced ? 1 : clamp(progress);
  if (p === previous) return;
  previous = p;
  const grow = ease(clamp(p / .32));
  const settle = ease(clamp((p - .32) / .38));
  const scale = .42 + .30 * grow + .28 * settle;
  portrait.style.transform = `translate3d(${origin.x * (1 - settle)}px,${origin.y * (1 - settle)}px,0) scale(${scale})`;
  portrait.style.opacity = '1';
  // Promotion is temporary; nothing keeps a compositor layer after settling.
  portrait.style.willChange = p > 0 && p < .71 ? 'transform' : 'auto';
  copy.forEach((element, index) => {
   const reveal = reduced ? 1 : clamp((p - .70 - index * .025) / .16);
   element.style.opacity = reveal;
   element.style.transform = `translate3d(0,${(1 - reveal) * 12}px,0)`;
   // Keep screen-reader content intact; hidden interactive items cannot be tabbed to.
   if (element.matches('a,button')) element.inert = reveal < .95;
  });
 }

 measure();
 return {measure,paint,dispose() {
  delete arrival.dataset.animated;
  [portrait,...copy].forEach(element => {
   ['transform','opacity','will-change'].forEach(property => element.style.removeProperty(property));
   element.inert = false;
  });
 }};
}
