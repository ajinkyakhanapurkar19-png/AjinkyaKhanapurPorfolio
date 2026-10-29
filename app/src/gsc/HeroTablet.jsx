import React, {useEffect, useRef, useState} from 'react';

const recording = './assets/gsc/media/gsc-website-walkthrough-trimmed.mp4';
const poster = './assets/gsc/media/gsc-website-poster.jpg';

export default function HeroTablet({onInspect}) {
 const video = useRef(null);
 const frame = useRef(null);
 const wanted = useRef(false);
 const inView = useRef(false);
 const [enhanced, setEnhanced] = useState(false);
 const [playing, setPlaying] = useState(false);
 const [failed, setFailed] = useState(false);

 useEffect(() => {
  const media = video.current;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let mounted = true;
  setEnhanced(true);
  wanted.current = !preference.matches;
  const sync = () => {
   if (!wanted.current || !inView.current || document.hidden) {media.pause(); return;}
   media.play().then(() => {
    if (!mounted || !wanted.current || !inView.current || document.hidden) media.pause();
   }).catch(() => { /* Keep the poster and manual Play control if autoplay is blocked. */ });
  };
  const observer = new IntersectionObserver(([entry]) => {
   inView.current = entry.isIntersecting && entry.intersectionRatio >= .2;
   sync();
  }, {threshold: [0, .2]});
  observer.observe(frame.current);
  const changePreference = () => {wanted.current = !preference.matches; sync();};
  preference.addEventListener('change', changePreference);
  document.addEventListener('visibilitychange', sync);
  return () => {
   mounted = false;
   observer.disconnect();
   preference.removeEventListener('change', changePreference);
   document.removeEventListener('visibilitychange', sync);
   media.pause();
  };
 }, []);

 const play = () => {
  wanted.current = true;
  video.current.play().catch(() => setPlaying(false));
 };
 const toggle = () => {
  if (failed) {setFailed(false); video.current.load(); play(); return;}
  if (video.current.paused) play();
  else {wanted.current = false; video.current.pause();}
 };

 return <figure className="gs-hero-tablet">
  <div className="gs-ipad-stage">
   <div className="gs-ipad" ref={frame}>
    <span className="gs-ipad-power" aria-hidden="true"/>
    <span className="gs-ipad-volume" aria-hidden="true"/>
    <span className="gs-ipad-camera" aria-hidden="true"/>
    <div className="gs-ipad-screen">
     <img className="gs-ipad-poster" src={poster} alt="" aria-hidden="true" width="1600" height="876"/>
     <video id="gsc-hero-recording" ref={video} src={recording} poster={poster}
      className={failed ? 'gs-video-unavailable' : ''}
      width="1600" height="876" muted loop playsInline preload="none" controls={!enhanced}
      aria-label="GSC website walkthrough: homepage introduction, services and growth framework."
      onPlaying={() => {setPlaying(true); setFailed(false);}}
      onPause={() => setPlaying(false)} onError={() => {setFailed(true); setPlaying(false);}}>
      <a href={recording}>Watch the GSC website walkthrough</a>
     </video>
    </div>
   </div>
  </div>
  <figcaption className="gs-ipad-caption">
   <div className="gs-ipad-description"><span className="gs-eyebrow">THE WEBSITE IN MOTION</span><p>A scroll through Growth Supercharge.</p></div>
   <div className="gs-ipad-actions">
     <button type="button" onClick={toggle} disabled={!enhanced} aria-controls="gsc-hero-recording" aria-label={failed ? 'Retry video' : playing ? 'Pause website walkthrough' : 'Play website walkthrough'}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">{playing ? <path d="M3 2h3v10H3zm5 0h3v10H8z"/> : <path d="M3 1.5 12 7l-9 5.5z"/>}</svg>
      {failed ? 'Retry' : playing ? 'Pause' : 'Play'}
     </button>
     <button type="button" onClick={() => {video.current.currentTime = 0; play();}} aria-controls="gsc-hero-recording" disabled={!enhanced || failed}>Replay <span aria-hidden="true">↺</span></button>
    <button type="button" className="gs-ipad-inspect" onClick={e => {wanted.current = false; video.current.pause(); onInspect('home-desktop', e.currentTarget);}}>View homepage <span aria-hidden="true">↗</span></button>
   </div>
   {failed && <p className="gs-ipad-error" role="status">The recording couldn’t load. Retry, or view the homepage above.</p>}
  </figcaption>
 </figure>;
}
