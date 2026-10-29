import React from 'react';
import './project-navigation.css';

const nextProjects = {
 pristine: {href:'./gsc-case-study.html', name:'Growth Supercharge'},
 gsc: {href:'./artist-studio-case-study.html', name:'Artist Studio'},
 'artist-studio': {href:'./pristine-forests-case-study.html', name:'Pristine Forests'},
};

function Arrow({back = false}) {
 return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
  <path d={back ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'}/>
 </svg>;
}

export function PortfolioBackLink() {
 return <a className="case-project-back" data-portfolio-home href="./index.html"><Arrow back/>Back to portfolio</a>;
}

export function NextProject({current}) {
 const next = nextProjects[current];
 return <nav className="case-project-next" aria-label="Next project">
  <a className="case-project-next-link" data-next-project href={next.href}>
   <div className="case-project-next-copy"><small>Next project</small><strong>{next.name}</strong></div>
   <Arrow/>
  </a>
 </nav>;
}

export function LiveWebsiteLink({href, name, target}) {
 return <a className="case-project-live" data-live-website href={href} target={target} rel="noopener noreferrer" aria-label={`Visit ${name} live website (opens in a new tab)`} onClick={e=>e.stopPropagation()}>
  Visit live website <span aria-hidden="true">↗</span>
 </a>;
}
