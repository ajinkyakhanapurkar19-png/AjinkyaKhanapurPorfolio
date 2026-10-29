// One scroll sample drives the HTML stage and its WebGL film slot together.
// Linear transport preserves the physical connection to native scrolling;
// the primary journey already supplies scrub smoothing.
export function rollArrival(scroll, start, height, compact = false, reduced = false) {
 const distance = height * (compact ? .25 : .7);
 const progress = reduced ? 1 : Math.max(0, Math.min(1, (scroll - start) / distance));
 return {
  y: reduced ? 0 : (compact ? Math.min(72,height*.1) : height) * (1 - progress),
  opacity: Math.min(1, progress / .12),
  end: reduced ? start : start + distance,
 };
}
