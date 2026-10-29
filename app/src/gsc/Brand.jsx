import React from 'react';
const base='./assets/gsc/source-views/';
const parts=['mrsrquai-frag-left','mrsrquai-frag-bottom','mrsrquai-g-body','mrsrquay-pixel'];
export default function Brand({light=false,markOnly=false,className=''}){
 const suffix=light?'-white.webp':'.webp';
 return <span className={`gs-brand ${markOnly?'gs-brand--mark':''} ${className}`} role="img" aria-label={markOnly?'Growth Supercharge symbol':'Growth Supercharge'}>
  <span className="gs-brand-symbol">{parts.map(p=><img key={p} src={base+p+suffix} alt="" decoding="async"/>)}</span>
  {!markOnly&&<><img className="gs-brand-growth" src={base+'mrsrquai-growth'+suffix} alt=""/><img className="gs-brand-super" src={base+'mrsrquay-supercharged'+suffix} alt=""/></>}
 </span>;
}
