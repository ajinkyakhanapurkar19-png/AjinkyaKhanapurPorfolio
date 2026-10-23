import React from 'react';
import {rollPhotos} from './roll-photos.js';

export const selectedWork = [
 'Pristine Forests website redesign',
 'GSC website system',
 '3D Artist Studio',
 'Office tools websites'
];

export default function ProjectStack({onReveal, onContinue}) {
 return <section id="projects" className="section project-stack-section" data-od-id="projects" data-screen-label="05 Selected projects" aria-labelledby="project-stack-title">
  <div className="project-stack-stage">
   <header className="project-stack-heading">
    <p className="meta">05 / SELECTED PROJECTS</p>
    <h2 id="project-stack-title">A closer look at the work.</h2>
   </header>
   <div className="project-stack-deck">
    {selectedWork.map((title,i)=><figure className={`project-layer project-layer-${i+1}`} key={title}>
     {/* Existing photography is film artwork, not a screenshot of these projects. */}
     <div className="project-film-plane" aria-hidden="true">
      <img src={rollPhotos[0].src} alt="" width="633" height="1024" loading="lazy" decoding="async"/>
      <span className="project-film-tint"/>
      <span className="project-film-edge">AK / 35MM <span>{String(i+1).padStart(2,'0')}</span></span>
     </div>
     <figcaption className="project-caption">
      <span className="project-caption-line" aria-hidden="true"/>
      <span className="project-caption-index" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>
      <h3>{title}</h3>
     </figcaption>
    </figure>)}
   </div>
   <div className="project-stack-footer">
    <button className="project-reveal-button" onClick={onReveal}>Reveal all projects</button>
    <div className="project-reveal-progress" aria-hidden="true"><span className="project-reveal-count">01 / 04</span><div>{selectedWork.map(title=><i key={title} className="project-reveal-dot"/>)}</div></div>
    <a href="#about" onClick={onContinue}>Behind the lens <span aria-hidden="true">↓</span></a>
   </div>
  </div>
 </section>;
}
