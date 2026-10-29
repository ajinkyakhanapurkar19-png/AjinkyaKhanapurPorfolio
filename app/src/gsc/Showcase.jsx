import React from 'react';
import {Screen} from './WebsiteMockup.jsx';

export function Monitor({name='home-desktop',className=''}){
 return <div className={`gs-monitor ${className}`}>
  <div className="gs-monitor-display"><span className="gs-monitor-camera" aria-hidden="true"/><Screen name={name}/><span className="gs-monitor-chin" aria-hidden="true"/></div>
  <div className="gs-monitor-neck" aria-hidden="true"/><div className="gs-monitor-foot" aria-hidden="true"/>
 </div>;
}

export function Laptop({name='home-desktop'}){
 return <div className="gs-laptop"><div className="gs-laptop-lid"><Screen name={name}/></div><div className="gs-laptop-deck" aria-hidden="true"><span/></div></div>;
}

export function StudioScene({name='home-desktop',scene='front',label,onInspect}){
 return <figure className={`gs-studio gs-studio--${scene}`}>
  <div className="gs-studio-world" aria-hidden="true"><div className="gs-studio-wall"/><div className="gs-studio-desk"/><div className="gs-studio-object"/></div>
  {scene==='laptop'?<Laptop name={name}/>:<Monitor name={name}/>}
  <figcaption><span>{label}</span><button type="button" onClick={e=>onInspect(name,e.currentTarget)} aria-label={`Inspect ${label}`}>Inspect <span aria-hidden="true">↗</span></button></figcaption>
 </figure>;
}
