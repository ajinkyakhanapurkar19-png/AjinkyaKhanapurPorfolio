import React, {useEffect, useRef, useState} from 'react';

const recording = './assets/pristine-forests/media/pristine-forests-ui-showreel.mp4';
const poster = './assets/pristine-forests/media/pristine-forests-ui-showreel-poster.jpg';

export default function Showreel() {
 const video = useRef(null);
 const [failed, setFailed] = useState(false);
 useEffect(() => {
  const media = video.current;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let disposed = false;
  // Autoplay in view; keep native controls and the current playback position.
  const syncPlayback = () => {
   if (disposed || !inView || document.hidden || reducedMotion.matches) {
    media.pause();
    return;
   }
   // Browsers may still decline autoplay; the native Play control stays usable.
   media.play().then(() => {
    if (disposed || !inView || document.hidden || reducedMotion.matches) media.pause();
   }).catch(() => {});
  };
  media.muted = true;
  const observer = typeof IntersectionObserver === 'undefined' ? null :
   new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncPlayback();
   });
  observer?.observe(media);
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', syncPlayback);
  return () => {
   disposed = true;
   observer?.disconnect();
   document.removeEventListener('visibilitychange', syncPlayback);
   reducedMotion.removeEventListener('change', syncPlayback);
   media.pause();
  };
 }, []);
 return <figure className="pf-visual pf-showreel">
  <div className="pf-showreel-stage">
  <video ref={video} src={recording} poster={poster} width="1080" height="1350"
   controls muted playsInline preload="none" aria-label="Pristine Forests UI showreel"
   aria-describedby="pf-showreel-caption" onError={() => setFailed(true)}>
   <a href={recording}>Watch the Pristine Forests UI showreel</a>
  </video>
  </div>
  {failed && <p role="status">The video could not load. Use the link below to open it directly.</p>}
  <figcaption id="pf-showreel-caption"><span>Pristine Forests · the website design in motion.</span>
   <a href={recording} target="_blank" rel="noopener noreferrer">Open video <span aria-hidden="true">↗</span></a>
  </figcaption>
 </figure>;
}
