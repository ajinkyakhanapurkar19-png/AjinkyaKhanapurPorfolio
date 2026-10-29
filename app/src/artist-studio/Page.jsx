import React, {useEffect,useRef,useState} from 'react';
import {ReferenceCase, Chapter, Evidence} from '../reference-case/ReferenceCase.jsx';
import {project, chapters, images as sourceImages} from './content.js';
import presentation from './presentation-assets.json';
import GalleryVideo from './GalleryVideo.jsx';
import './exhibition.css';
import {PortfolioBackLink, NextProject} from '../reference-case/ProjectNavigation.jsx';
import '../reference-case/case-mobile.css';
import './mobile.css';

// Smaller delivery copies of the existing project evidence; originals are retained.
const images = Object.fromEntries(Object.entries({...sourceImages, ...presentation}).map(([key, value]) =>
 [key, {...sourceImages[key], ...value, experienceUrl:undefined}]));
const works = ['AS_PAINTING_SEPIA', 'AS_PAINTING_MONO', 'AS_PAINTING_BLUE'];
const journey = [
 {label:'Enter the space', image:'AS_GALLERY_ENTRANCE_CAPTURE', title:'A sense of arrival.', copy:'Curved story walls and a central bench establish a place to begin. Glimpses of the paintings invite visitors to explore what lies around the next wall.'},
 {label:'Explore the gallery', image:'AS_ARTWORK_COMPOSITION', title:'Encounter the work.', copy:'Paintings share the walls in curated groups. Collection labels and focused light help visitors understand the exhibition without losing the sense of being inside it.'},
 {label:'Look closer', image:'AS_ARTWORK_COMPOSITION', title:'From the room to the painting.', copy:'The gallery includes a Wall Zoom control and focused artwork views. Moving closer gives the work more of the frame while preserving its place in the exhibition.'},
 {label:'Meet the artist', image:'AS_ARTIST_PROFILE_CAPTURE', title:'Find the person behind the work.', copy:'Pankaj Saroj’s portrait, biography and selected paintings bring his creative identity into the same journey as the gallery.'},
 {label:'Explore collections', image:'AS_COLLECTION_CAPTURE', title:'Keep looking.', copy:'The connected catalogue offers a direct way to browse individual works. Artwork titles, medium and dimensions add practical detail to the spatial encounter.'}
];
function LiveLink({children='Visit live experience', className=''}) {
 return <a className={`ex-live-link ${className}`} href={project.liveUrl} target="artist-studio-live" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}>{children}<span aria-hidden="true">↗</span></a>;
}
function JumpLink({id, children, className=''}) {
 return <a className={className} href={`#${id}`} onClick={e=>{
  const target=document.getElementById(id); if(!target)return; e.preventDefault();
  window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-(matchMedia('(max-width:999px)').matches?88:32), behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  target.focus({preventScroll:true}); history.replaceState(null,'',`#${id}`);
 }}>{children}</a>;
}
function Kicker({number,children}) {return <p className="ex-kicker"><span>{number}</span>{children}</p>;}
function Picture({name, caption, className='', hero=false}) {
 return <figure className={`ex-figure ${className}`}>
  <Evidence name={name} images={images} cover={hero} enlarge={false}/>
  {caption&&<figcaption>{caption}</figcaption>}
 </figure>;
}
function StoryHeader({number,label,title,children}) {
 return <header className="ex-story-header"><Kicker number={number}>{label}</Kicker><div><h2>{title}</h2>{children&&<div className="ex-intro">{children}</div>}</div></header>;
}
function Journey() {
 const [active,setActive]=useState(0);
 const current=journey[active];
 const tabs=useRef();
 useEffect(()=>{const rail=tabs.current,tab=rail.children[active];if(rail.scrollWidth>rail.clientWidth)rail.scrollTo({left:tab.offsetLeft-(rail.clientWidth-tab.offsetWidth)/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[active]);
 const select=(event,index)=>{setActive(index);event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[index]?.focus();};
 return <div className="ex-journey">
  <div className="ex-journey-tabs" ref={tabs} role="tablist" aria-label="Explore the visitor journey">
   {journey.map((step,i)=><button key={step.label} type="button" role="tab" id={`journey-tab-${i}`} aria-controls="journey-panel" aria-selected={active===i} tabIndex={active===i?0:-1}
    onClick={()=>setActive(i)} onKeyDown={e=>{let index;if(e.key==='ArrowRight')index=(i+1)%journey.length;if(e.key==='ArrowLeft')index=(i+journey.length-1)%journey.length;if(e.key==='Home')index=0;if(e.key==='End')index=journey.length-1;if(index!==undefined){e.preventDefault();select(e,index);}}}>
    <span>{String(i+1).padStart(2,'0')}</span>{step.label}
   </button>)}
  </div>
  <div className="ex-journey-panel" id="journey-panel" role="tabpanel" aria-labelledby={`journey-tab-${active}`} tabIndex={0}>
   <Picture name={current.image} className="ex-screen"/>
   <div className="ex-journey-copy"><span className="ex-counter">{String(active+1).padStart(2,'0')} / 05</span><h3>{current.title}</h3><p>{current.copy}</p></div>
  </div>
 </div>;
}
export default function Page() {
 return <div className="as-exhibition"><ReferenceCase slug="exhibition" title={project.title} width={1440} chapters={chapters}>
  <Chapter id="overview" label="More than a portfolio" className="ex-cover" source="artist-studio">
   <div className="ex-cover-backdrop" style={{backgroundImage:`url(${images.AS_PAINTING_MONO.src})`}}/>
   <div className="ex-cover-paper">
    <nav className="ex-cover-nav" aria-label="Project navigation"><PortfolioBackLink/><JumpLink id="concept">The story ↓</JumpLink></nav>
    <header className="ex-cover-title"><p className="ex-kicker">Pristine Forests <span>—</span> Immersive artist portfolio</p><h2>Artist Studio<span className="ex-title-period">.</span></h2><p>A portfolio you can step inside.</p></header>
    <div className="ex-cover-gallery">
     <div className="ex-cover-art ex-cover-art-left"><img src={images.AS_PAINTING_SEPIA.src} width={images.AS_PAINTING_SEPIA.width} height={images.AS_PAINTING_SEPIA.height} alt="Sepia Village by Pankaj Saroj"/><span>Art, in context.</span></div>
     <Picture name="AS_HERO_RENDER" hero className="ex-cover-main"/>
     <div className="ex-cover-art ex-cover-art-right"><img src={images.AS_PAINTING_BLUE.src} width={images.AS_PAINTING_BLUE.width} height={images.AS_PAINTING_BLUE.height} alt="Blue Tree Landscape by Pankaj Saroj"/><span>A world to discover.</span></div>
    </div>
    <div className="ex-cover-bottom"><span>Spatial storytelling · Interaction design</span><span>Artwork by Pankaj Saroj</span></div>
   </div>
  </Chapter>

  <Chapter id="concept" label="Making it personal" className="ex-section ex-container" source="artist-studio">
   <StoryHeader number="01" label="The opportunity" title={<>What if exploring a portfolio<br className="ex-desktop-break"/> felt like visiting a studio?</>}>
    <p>Artist Studio brings an artist, their work and the space around them into one immersive digital portfolio for Pristine Forests.</p>
   </StoryHeader>
   <div className="ex-editorial-pair"><h3>More than a collection of images.</h3><div><p>A conventional portfolio can make finished artwork easy to browse. But it can leave less room for the artist’s identity and the atmosphere around their practice.</p><p>This project explores another possibility: arrive somewhere, spend time with the work, and gradually discover the person behind it. That is a design opportunity, rather than a claim about every artist’s website.</p></div></div>
  </Chapter>

  <Chapter id="environment" label="The studio as portfolio" className="ex-section ex-concept" source="artist-studio">
   <div className="ex-container"><StoryHeader number="02" label="The concept" title="The studio becomes the portfolio."><p>Presence, discovery, connection and curation give the experience direction. The environment supports the art; it never needs to compete with it.</p></StoryHeader>
    <div className="ex-principles">{[
     ['Presence','A place to arrive.','Depth, scale and perspective make the visitor feel situated in a creative space.'],
     ['Discovery','A reason to explore.','Paintings are encountered along the route, with closer views for a longer look.'],
     ['Connection','A person behind it.','The artist’s profile gives the work a personal context.'],
     ['Curation','Room for attention.','Artwork groupings, light and spacing guide the eye through the exhibition.']
    ].map(([label,title,copy],i)=><article key={label}><span className="ex-kicker">0{i+1} / {label}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
   </div>
  </Chapter>

  <Chapter id="production" label="Space around the art" className="ex-section ex-container" source="artist-studio">
   <StoryHeader number="03" label="The work comes first" title="Give each painting room to breathe."><p>Viewing distance, light and space shape how the portfolio is encountered. Off-white walls offer a quiet setting; curved sightlines carry attention from one work to the next.</p></StoryHeader>
   <div className="ex-art-hang">{works.map((name,i)=><figure key={name} className={`ex-art-piece ex-art-piece-${i}`}><Evidence name={name} images={images} enlarge={false}/><figcaption><span>{images[name].label}</span><small>{images[name].category} · Pankaj Saroj</small></figcaption></figure>)}</div>
   <div className="ex-gallery-diptych"><Picture name="AS_ARTWORK_COMPOSITION" caption="The work in its setting — collection labels, light and spacing create a shared rhythm."/><Picture name="AS_CONCEPT_BOARD" caption="Open sightlines connect the paintings, the artist display and the visitor’s route."/></div>
  </Chapter>

  <Chapter id="exploration" label="The visitor’s journey" className="ex-section ex-journey-section" source="artist-studio">
   <div className="ex-container"><StoryHeader number="04" label="The visitor’s journey" title="From entering the space to knowing the artist."><p>Five connected moments bring the person, the paintings and the collections into one story. Explore each view below.</p></StoryHeader><Journey/></div>
  </Chapter>

  <Chapter id="atmosphere" label="The feeling of being there" className="ex-section ex-atmosphere" source="artist-studio">
   <div className="ex-container"><StoryHeader number="05" label="The feeling of being there" title="Light. Distance. Attention."><p>Light gives the work a focal point. Perspective gives it a place. Moving between wide views and closer compositions lets visitors understand the room, then return their attention to a painting.</p></StoryHeader>
    <GalleryVideo/>
    <div className="ex-image-notes"><p><span>01 / Light</span>Focused illumination keeps the paintings at the centre of attention.</p><p><span>02 / Depth</span>Curved walls and darker floors establish the room around the artwork.</p><p><span>03 / Movement</span>Wide and close views connect orientation with inspection.</p></div>
   </div>
  </Chapter>

  <Chapter id="learnings" label="Bringing it to the browser" className="ex-section ex-container" source="artist-studio">
   <StoryHeader number="06" label="Behind the experience" title="Making a place work on the web."><p>The technical work serves the portfolio: preserve a believable space around the art, then give visitors a clear way to move through it.</p></StoryHeader>
   <div className="ex-production-layout"><Picture name="AS_CONCEPT_BOARD"/><div className="ex-log-list">{[
    ['01','Scene to browser','The workflow brings a Blender environment into Three.js through GLB. The gallery foundation is an adapted model; artwork placement, the artist display and navigation shape it into this portfolio.'],
    ['02','A coherent atmosphere','Exported textures, material adjustments, exposure and soft shadows support the browser scene. Their purpose is to keep the room and artwork visually connected across viewpoints.'],
    ['03','Movement with a purpose','The source connects a guided wall route, wall zoom, focused artwork and artist views, with orbit and pan available after the guided journey.'],
    ['04','The practical constraint','The local model is approximately 66 MB. Pixel ratio is capped, but loading and mobile performance still need measurement. No visitor testing or performance outcomes are claimed.']
   ].map(([n,title,copy])=><article className="ex-log-row" key={n}><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div>
  </Chapter>

  <Chapter id="final-experience" label="The experience today" className="ex-section ex-final" source="artist-studio">
   <div className="ex-container"><StoryHeader number="07" label="The experience today" title="Inside Artist Studio."><p>A space to enter. A person to discover. A body of work to spend time with. These are captures of the existing experience.</p></StoryHeader>
    <div className="ex-final-grid">{[
     ['AS_GALLERY_ENTRANCE_CAPTURE','01','A place to enter.','The entrance sets the scene for a portfolio explored through space.'],
     ['AS_ARTIST_PROFILE_CAPTURE','02','The person behind the paintings.','Pankaj Saroj’s profile connects his portrait, biography and selected work.'],
     ['AS_ARTWORK_COMPOSITION','03','Art encountered in context.','Paintings belong to curated groups along the gallery walls.'],
     ['AS_COLLECTION_CAPTURE','04','Another way to keep looking.','The catalogue brings individual works, medium and dimensions into focus.']
    ].map(([image,n,title,copy])=><article key={n}><Picture name={image}/><div className="ex-final-caption"><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div></div></article>)}</div>
   </div>
  </Chapter>

  <Chapter id="reflection" label="A portfolio becomes a place" className="ex-section ex-container" source="artist-studio">
   <StoryHeader number="08" label="Reflection" title="A portfolio becomes a place."><p>The strongest idea is the connection between the person, the work and the setting. A spatial interface can give an artist’s portfolio atmosphere, while clear navigation keeps that atmosphere usable.</p></StoryHeader>
   <div className="ex-editorial-pair"><h3>Where the experience can go next.</h3><div><p>More personal artist environments, richer stories around individual works and simpler ways to maintain the portfolio are opportunities for future development.</p><p>Testing orientation, artwork discovery and loading on real devices would help decide what to improve first. The experience is deployed; research and performance outcomes have not been documented.</p></div></div>
   <section className="ex-visit" data-od-id="live-experience" aria-labelledby="ex-visit-title"><div className="ex-visit-copy"><p className="ex-kicker">Experience the studio</p><h2 id="ex-visit-title">The next step<br/>is inside.</h2><p>Explore the gallery, meet the artist and discover the collections.</p><LiveLink/><small>pristineforests.com · Opens in a new tab</small></div><Picture name="AS_GALLERY_ENTRANCE_CAPTURE" hero/></section>
  </Chapter>

  <footer className="ex-footer ex-container"><div><strong>Artist Studio</strong><span>Pristine Forests · Case study by Ajinkya Khanapurkar</span></div><JumpLink id="overview">Back to top ↑</JumpLink><small>Artwork: Pankaj Saroj. Gallery foundation: <a href="https://sketchfab.com/denis_cliofas" target="_blank" rel="noreferrer">Art Gallery by denis_cliofas</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</small></footer>
  <NextProject current="artist-studio"/>
 </ReferenceCase></div>;
}
