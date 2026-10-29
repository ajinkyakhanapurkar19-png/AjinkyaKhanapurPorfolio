// One scroll source owns the whole journey; this module only samples its pose.
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function sampleProjectStack(progress, {width, height, cardWidth, cardHeight, compact = false}) {
 const p = clamp(progress);
 const spread = [1, ...[0, 1, 2].map(i => smooth((p - .08 - i * .23) / .22))];
 const labels = smooth((p - .82) / .13);
 const gap = compact ? Math.max(12, width * .09) : (width - cardWidth * 4) / 3;
 const stride = cardWidth + gap;
 const opened = spread.slice(1).reduce((sum, value) => sum + value, 0);
 const left = compact ? (width - cardWidth * 2 - gap) / 2 : (width - cardWidth - stride * opened) / 2;
 const rowStride = compact ? cardHeight + 86 : 0;
 const top = compact ? Math.max(30, (height - rowStride - cardHeight - 70) / 2) : Math.max(42, (height - cardHeight - 120) / 2);
 return {
  labels,
  count: spread.filter(value => value > .95).length,
  cards: spread.map((reveal, i) => {
   const x = compact
    ? (width - cardWidth) / 2 + (left + (i % 2) * stride - (width - cardWidth) / 2) * smooth(p / .3)
    : left + stride * spread.slice(1, i + 1).reduce((sum, value) => sum + value, 0);
   const y = top + (compact && i > 1 ? rowStride * reveal : 0);
   return {x, y, opacity: i === 0 ? 1 : clamp(reveal * 4), reveal};
  })
 };
}

export function createProjectReveal(root, {staticLayout = false} = {}) {
 const section = root.querySelector('#projects');
 const deck = section.querySelector('.project-stack-deck');
 const cards = [...deck.querySelectorAll('.project-layer')];
 const labels = [...section.querySelectorAll('.project-caption')];
 const lines = [...section.querySelectorAll('.project-caption-line')];
 const counter = section.querySelector('.project-reveal-count');
 const revealButton = section.querySelector('.project-reveal-button');
 const dots = [...section.querySelectorAll('.project-reveal-dot')];
 let size, previous = -1;
 section.dataset.animated = String(!staticLayout);
 function measure() {
  size = {width:deck.clientWidth, height:deck.clientHeight, cardWidth:cards[0].offsetWidth,
   cardHeight:cards[0].querySelector('.project-film-plane').offsetHeight, compact:innerWidth<700};
  previous = -1;
 }
 function paint(progress) {
  const p = staticLayout ? 1 : clamp(progress);
  if (Math.abs(previous - p) < .00001) return;
  previous = p;
  const state = sampleProjectStack(p, size);
  if (!staticLayout) {
   cards.forEach((card,i) => {
    const pose = state.cards[i];
    card.style.transform = `translate3d(${pose.x.toFixed(2)}px,${pose.y.toFixed(2)}px,0)`;
    card.style.opacity = pose.opacity;
    // Hidden stack layers must not intercept clicks or keyboard navigation.
    card.inert = pose.opacity < .95;
   });
   labels.forEach(label => {label.style.opacity=state.labels;label.style.transform=`translateY(${(1-state.labels)*8}px)`;});
   lines.forEach(line => {line.style.transform=`scaleY(${state.labels})`;});
  }
  counter.textContent = `${String(state.count).padStart(2,'0')} / 04`;
  dots.forEach((dot,i)=>{dot.dataset.active=String(i<state.count);});
  revealButton.textContent = state.labels > .98 ? 'Replay the reveal' : 'Reveal all projects';
  revealButton.dataset.complete = String(state.labels > .98);
 }
 measure();
 return {measure,paint,dispose(){
  delete section.dataset.animated;
  cards.forEach(card => {card.inert = false;});
  [...cards,...labels,...lines].forEach(el=>{el.style.removeProperty('transform');el.style.removeProperty('opacity');});
 }};
}
