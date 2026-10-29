import React from 'react';
import pristineLogo from '../../assets/brand/pristine-forests.png';
import gscLeft from '../../assets/gsc/source-views/mrsrquai-frag-left-white.webp';
import gscBottom from '../../assets/gsc/source-views/mrsrquai-frag-bottom-white.webp';
import gscBody from '../../assets/gsc/source-views/mrsrquai-g-body-white.webp';
import gscPixel from '../../assets/gsc/source-views/mrsrquay-pixel.webp';
import gscGrowth from '../../assets/gsc/source-views/mrsrquai-growth-white.webp';
import gscSupercharged from '../../assets/gsc/source-views/mrsrquay-supercharged.webp';
import artistHero from '../../assets/artist-studio/exhibition/as_hero_render.webp';

const projectCards = [
 {id:'pristine', title:'Pristine Forests website redesign', href:'./pristine-forests-case-study.html', brand:true},
 {id:'gsc', title:'GSC website system', href:'./gsc-case-study.html', brand:true},
 {id:'artist', title:'3D Artist Studio', href:'./artist-studio-case-study.html', image:artistHero, width:2000, height:1432, alt:'Artist Studio curved gallery wall and paintings'},
 {id:'office', title:'Office OS Website', status:'In development'}
];
export const selectedWork = projectCards.map(project => project.title);

function BrandCover({brand}) {
 return <div className={`project-brand-cover project-brand-cover--${brand}`}>
  {brand==='pristine' ?
   <svg className="project-pristine-logo" viewBox="1053 358 1352 1510" role="img" aria-label="Pristine Forests" focusable="false">
    {/* The viewBox removes only the transparent export margins. */}
    <image href={pristineLogo} width="3508" height="2481"/>
   </svg> :
   <div className="project-gsc-logo" role="img" aria-label="Growth Supercharged">
    <div className="project-gsc-symbol" aria-hidden="true">{[gscLeft,gscBottom,gscBody,gscPixel].map(src=><img src={src} key={src} width="975" height="974" alt="" decoding="async"/>)}</div>
    <div className="project-gsc-wordmark" aria-hidden="true"><img src={gscGrowth} className="project-gsc-growth" width="1216" height="251" alt=""/><img src={gscSupercharged} width="1532" height="233" alt=""/></div>
   </div>}
 </div>;
}

export default function ProjectStack({onReveal, onContinue}) {
 return <section id="projects" className="section project-stack-section" data-od-id="projects" data-screen-label="05 Selected projects" aria-labelledby="project-stack-title">
  <div className="project-stack-stage">
   <header className="project-stack-heading">
    <p className="meta">05 / SELECTED PROJECTS</p>
    <h2 id="project-stack-title">A closer look at the work.</h2>
   </header>
   <div className="project-stack-deck">
    {projectCards.map((project,i)=>{
     const Card = project.href ? 'a' : 'div';
     return <Card className={`project-layer project-layer-${i+1}${project.href ? ' project-card-link' : ''}`} key={project.id}
      href={project.href} aria-label={project.href ? `View ${project.title} case study` : undefined}>
     <figure className="project-card-content">
     <div className={`project-film-plane project-cover-${project.id}`}>
      {project.brand ? <BrandCover brand={project.id}/> : project.image ? <div className="project-cover-window"><img src={project.image} alt={project.alt} width={project.width} height={project.height} loading="lazy" decoding="async"/></div>
       : <div className="project-development"><span>Office OS</span><small>Website</small><span className="project-development-status">{project.status}</span></div>}
      <span className="project-film-edge" aria-hidden="true">{project.href ? 'VIEW CASE STUDY ↗' : 'IN DEVELOPMENT'} <span>{String(i+1).padStart(2,'0')}</span></span>
     </div>
     <figcaption className="project-caption">
      <span className="project-caption-line" aria-hidden="true"/>
      <span className="project-caption-index" aria-hidden="true">{String(i+1).padStart(2,'0')}</span>
      <h3>{project.title}</h3>
     </figcaption>
     </figure>
    </Card>;})}
   </div>
   <div className="project-stack-footer">
    <button className="project-reveal-button" onClick={onReveal}>Reveal all projects</button>
    <div className="project-reveal-progress" aria-hidden="true"><span className="project-reveal-count">01 / 04</span><div>{selectedWork.map(title=><i key={title} className="project-reveal-dot"/>)}</div></div>
    <a href="#about" onClick={onContinue}>Behind the lens <span aria-hidden="true">↓</span></a>
   </div>
  </div>
 </section>;
}
