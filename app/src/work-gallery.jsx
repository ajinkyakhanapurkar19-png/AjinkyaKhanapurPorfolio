import React, {useLayoutEffect, useRef, useState} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {galleryFrames} from './work-gallery-data.js';

const practices=['Website design','UI & UX design','Interaction design','Service design','Design systems','3D generation & AI'];
const galleryPixelsPerSecond=40;
const clamp=n=>Math.max(0,Math.min(1,n));
function GalleryMedia({media}) {
 const [failed,setFailed]=useState(false);
 return <div className={`wg-media wg-${media.kind}${media.long?' wg-long-screen':''}`} style={media.kind==='photograph'?{'--wg-photo-ratio':media.width/media.height}:undefined}>
  {media.kind==='browser'&&<div className="wg-browser-bar" aria-hidden="true"><i/><i/><i/></div>}
  {media.kind==='tablet'&&<span className="wg-tablet-camera" aria-hidden="true"/>}
  <div className="wg-media-window">
   {failed?<span className="wg-missing" role="img" aria-label={`${media.alt}; image unavailable`}>Image unavailable</span>:
    <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" draggable="false" onError={()=>setFailed(true)}/>}
  </div>
 </div>;
}

export default function WorkGallery({onContinue}) {
 const section=useRef(null),shell=useRef(null),wall=useRef(null),track=useRef(null),group=useRef(null);
 const trigger=useRef(null),loop=useRef(null),syncPlayback=useRef(()=>{});
 const paused=useRef(false),focused=useRef(false),reduced=useRef(false);
 const [isPaused,setPaused]=useState(false),[isReduced,setReduced]=useState(false);

 useLayoutEffect(()=>{
  const mm=gsap.matchMedia();
  mm.add({all:'(min-width:0px)',reduce:'(prefers-reduced-motion:reduce)',short:'(max-height:600px), (min-width:761px) and (max-height:680px)'},ctx=>{
   const still=ctx.conditions.reduce||ctx.conditions.short;
   section.current.dataset.static=String(still);
   if(still){gsap.set(shell.current,{clearProps:'transform,opacity'});return;}
   const intro=section.current.querySelector('.wg-intro');
   const lines=[...intro.children],left=section.current.querySelector('.wg-information'),right=wall.current;
   // Keep the established camera arrival; scrolling no longer changes the copy or images.
   trigger.current=ScrollTrigger.create({
    trigger:section.current,start:'top top',end:'bottom bottom',invalidateOnRefresh:true,
    onUpdate:self=>{
     const entrance=clamp(self.progress/.13),e=1-Math.pow(1-entrance,3);
     const exit=clamp((self.progress-.94)/.06);
     gsap.set(shell.current,{opacity:clamp(entrance*3),z:-150*(1-e)-exit*24,rotationX:3*(1-e),y:22*(1-e)});
     gsap.set(left,{x:-32*(1-e)});gsap.set(right,{x:32*(1-e)});
     lines.forEach((line,i)=>{const reveal=clamp((entrance-.05-i*.08)/.55);gsap.set(line,{opacity:reveal,y:12*(1-reveal)});});
    },
    onRefresh:self=>self.vars.onUpdate(self)
   });
   trigger.current.vars.onUpdate(trigger.current);
   return()=>{trigger.current?.kill();trigger.current=null;gsap.set([shell.current,left,right,...lines],{clearProps:'transform,opacity'});};
  },section);
  return()=>mm.revert();
 },[]);

 useLayoutEffect(()=>{
  const motion=matchMedia('(prefers-reduced-motion:reduce)');
  let visible=false;
  // A compositor transform runs independently of scrolling and React renders.
  // Two identical groups make the final-to-first frame transition seamless.
  const measure=()=>{
   if(reduced.current){loop.current?.cancel();loop.current=null;return;}
   const distance=group.current.getBoundingClientRect().width;
   if(!distance)return;
   const duration=distance/galleryPixelsPerSecond*1000;
   if(loop.current){
    const prior=Number(loop.current.effect.getTiming().duration);
    const phase=(Number(loop.current.currentTime)||0)/prior;
    loop.current.effect.updateTiming({duration});loop.current.currentTime=phase*duration;
   }else{
    loop.current=track.current.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(-50%,0,0)'}],{duration,iterations:Infinity,easing:'linear'});
    loop.current.pause();
   }
   syncPlayback.current();
  };
  syncPlayback.current=()=>{
   if(!loop.current)return;
   if(!visible||document.hidden||paused.current||focused.current||reduced.current)loop.current.pause();
   else loop.current.play();
  };
  const preference=()=>{
   reduced.current=motion.matches;setReduced(motion.matches);
   section.current.dataset.reduced=String(motion.matches);
   wall.current.scrollLeft=0;measure();
  };
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;syncPlayback.current();},{threshold:.01});
  const resize=new ResizeObserver(measure);
  preference();observer.observe(wall.current);resize.observe(group.current);
  motion.addEventListener('change',preference);document.addEventListener('visibilitychange',syncPlayback.current);
  return()=>{observer.disconnect();resize.disconnect();motion.removeEventListener('change',preference);document.removeEventListener('visibilitychange',syncPlayback.current);loop.current?.cancel();loop.current=null;syncPlayback.current=()=>{};};
 },[]);

 useLayoutEffect(()=>{
  const restoreHash=()=>{
   if(!['#work','#projects'].includes(location.hash))return;
   const t=trigger.current;
   const top=t?t.start+(t.end-t.start)*.13:section.current.getBoundingClientRect().top+window.scrollY;
   window.scrollTo({top,behavior:'instant'});ScrollTrigger.update();
  };
  const pending=requestAnimationFrame(restoreHash);
  window.addEventListener('hashchange',restoreHash);
  return()=>{cancelAnimationFrame(pending);window.removeEventListener('hashchange',restoreHash);};
 },[]);

 function togglePlayback(){paused.current=!paused.current;setPaused(paused.current);syncPlayback.current();}
 function step(direction){
  if(reduced.current){wall.current.scrollBy({left:direction*wall.current.clientWidth*.86,behavior:'instant'});return;}
  const animation=loop.current;if(!animation)return;
  paused.current=true;setPaused(true);animation.pause();
  const distance=group.current.getBoundingClientRect().width,duration=Number(animation.effect.getTiming().duration);
  const position=((Number(animation.currentTime)||0)%duration)/duration*distance;
  const positions=[...group.current.children].map(frame=>frame.offsetLeft);
  const next=direction>0?(positions.find(x=>x>position+2)??distance):([...positions].reverse().find(x=>x<position-2)??positions.at(-1)-distance);
  animation.currentTime=((next+distance)%distance)/distance*duration;
 }
 function focusFrame(event){
  focused.current=true;syncPlayback.current();
  if(reduced.current||!loop.current)return;
  const frame=event.target.closest('.wg-frame');if(!frame)return;
  const duration=Number(loop.current.effect.getTiming().duration);
  loop.current.currentTime=frame.offsetLeft/group.current.getBoundingClientRect().width*duration;
  wall.current.scrollLeft=0;
 }

 return <section id="work" ref={section} className="section work-gallery" data-od-id="work" data-screen-label="04 The roll" aria-labelledby="roll-title">
  <span id="projects" className="wg-project-anchor" aria-hidden="true"/>
  <div className="wg-stage"><div className="wg-shell" ref={shell}>
   <div className="wg-information">
    <div className="wg-topline"><span>04 / THE ROLL</span></div>
    <div className="wg-story"><div className="wg-intro wg-copy is-active">
     <h2 id="roll-title">My work,<br/>in focus.</h2>
     <p className="wg-description">I design websites, interfaces and experiences — connecting how something looks with how it works.</p>
     <p className="wg-practice-label">ACROSS MY PRACTICE</p>
     <ul className="wg-practices">{practices.map(item=><li key={item}>{item}</li>)}</ul>
    </div></div>
    <div className="wg-navigation">
     <div className="wg-image-nav">
      <button className="wg-playback" type="button" onClick={togglePlayback} hidden={isReduced} aria-controls="roll-images" aria-label={isPaused?'Resume moving gallery':'Pause moving gallery'}><span aria-hidden="true">{isPaused?'▷':'Ⅱ'}</span>{isPaused?'Resume':'Pause'}</button>
      <div className="wg-arrows"><button type="button" onClick={()=>step(-1)} aria-label="Previous image">←</button><button type="button" onClick={()=>step(1)} aria-label="Next image">→</button></div>
     </div>
     <div className="wg-bottomline"><a href="#about" onClick={onContinue}>Behind the lens <span aria-hidden="true">↓</span></a></div>
    </div>
   </div>
   <div id="roll-images" className="wg-wall" ref={wall} role="region" aria-roledescription="carousel" aria-label="Photography and selected project images" tabIndex="0"
    onKeyDown={event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();step(event.key==='ArrowRight'?1:-1);}}}
    onFocusCapture={focusFrame} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget)){focused.current=false;syncPlayback.current();}}}>
    <div className="wg-track" ref={track}>{[0,1].map(copy=><div className="wg-group" key={copy} ref={copy===0?group:undefined} aria-hidden={copy===1?true:undefined}>
     {galleryFrames.map(shot=>{
      const Frame=shot.href?'a':'figure';
      return <Frame className={`wg-frame wg-frame--${shot.layout}`} key={shot.id} href={shot.href} tabIndex={shot.href&&copy===1?-1:undefined} aria-label={shot.href?`View ${shot.title} case study`:undefined}>
       {shot.media.map(media=><GalleryMedia key={media.src} media={media}/>)}</Frame>;
     })}
    </div>)}</div>
   </div>
  </div></div>
 </section>;
}
