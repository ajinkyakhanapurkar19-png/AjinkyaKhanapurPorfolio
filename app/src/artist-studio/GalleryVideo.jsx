import React, {useEffect, useRef} from 'react';

const recording = './assets/artist-studio/media/artist-studio-walkthrough-oct29.mp4';
const poster = './assets/artist-studio/media/artist-studio-walkthrough-oct29-poster.webp';

export default function GalleryVideo() {
 const video = useRef(null);

 useEffect(() => {
  const media = video.current;
  // Playback is visitor-initiated, including when reduced motion is preferred.
  // Pause when away from the chapter; never restart a deliberately paused clip.
  const observer = typeof IntersectionObserver === 'undefined' ? null :
   new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) media.pause();
   });
  observer?.observe(media);
  const pauseWhenHidden = () => {if (document.hidden) media.pause();};
  document.addEventListener('visibilitychange', pauseWhenHidden);
  return () => {
   observer?.disconnect();
   document.removeEventListener('visibilitychange', pauseWhenHidden);
   media.pause();
  };
 }, []);

 return <figure className="ex-gallery-film">
  <video ref={video} src={recording} poster={poster} width="1600" height="880"
   controls playsInline preload="none" aria-label="Artist Studio gallery walkthrough"
   aria-describedby="gallery-film-caption">
   <a href={recording}>Watch the Artist Studio gallery walkthrough</a>
  </video>
  <figcaption id="gallery-film-caption">
   <span>A walk through Artist Studio — from the gallery to the artist and their work.</span>
   <a href={recording} target="_blank" rel="noopener noreferrer">Open video <span aria-hidden="true">↗</span></a>
  </figcaption>
 </figure>;
}
