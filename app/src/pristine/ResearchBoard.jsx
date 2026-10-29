import React, {useState} from 'react';
import {researchReferences} from './research-references.js';

function ReferenceImage({reference}) {
 const [failed,setFailed] = useState(false);
 return <div className="pf-research-image">
  {failed ? <p className="pf-research-image-error">Screenshot unavailable. <a href={reference.source} target="_blank" rel="noopener noreferrer">View the source ↗</a></p> :
   <img src={reference.src} width={reference.width} height={reference.height} alt={reference.alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}
 </div>;
}

export default function ResearchBoard() {
 return <div className="pf-research-board" data-image-slot="PF_VISUAL_RESEARCH_BOARD" aria-labelledby="pf-research-board-title">
  <div className="pf-research-board-heading">
   <h3 id="pf-research-board-title">A study in presentation.</h3>
   <p>Five references. Photography, hierarchy and space.</p>
  </div>
  <div className="pf-research-grid">
   {researchReferences.map(reference=><figure key={reference.id} className={`pf-research-reference pf-research-${reference.id}`}>
    <div className="pf-research-brand"><span>{reference.name}</span><a href={reference.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${reference.name} website (opens in a new tab)`}>{new URL(reference.website).hostname.replace('www.','')} <span aria-hidden="true">↗</span></a></div>
    <ReferenceImage reference={reference}/>
    <figcaption>
     <h4>{reference.focus}</h4>
     <p>{reference.observation}</p>
     <p className="pf-research-takeaway"><span>For Pristine Forests</span>{reference.takeaway}</p>
     <a className="pf-research-source" href={reference.source} target="_blank" rel="noopener noreferrer" aria-label={`${reference.name}: ${reference.provenance} (opens in a new tab)`}>{reference.provenance} <span aria-hidden="true">↗</span></a>
    </figcaption>
   </figure>)}
  </div>
  <p className="pf-research-credit">Reference screenshots belong to their respective brands. This board combines archived and current captures for visual comparison; the observations describe presentation, not tested usability findings.</p>
 </div>;
}
