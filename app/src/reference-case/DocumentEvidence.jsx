import React, {useEffect, useRef} from 'react';

// Inert views of the actual project HTML, kept at their authored viewport size.
// The outer evidence slot retains the template's original geometry.
export default function DocumentEvidence({image}) {
 const stage = useRef(null);
 useEffect(() => {
  const node = stage.current;
  const observer = new ResizeObserver(([entry]) => {
   const {width, height} = entry.contentRect;
   node.style.setProperty('--document-scale', Math.min(width / image.viewportWidth, height / image.viewportHeight));
  });
  observer.observe(node);
  return () => observer.disconnect();
 }, [image.viewportWidth, image.viewportHeight]);
 return <div ref={stage} className="reference-document-stage">
  <iframe className="reference-document" src={image.src} title={image.label} width={image.viewportWidth} height={image.viewportHeight} loading="lazy" sandbox="allow-same-origin" referrerPolicy="no-referrer" tabIndex={-1} style={{width:image.viewportWidth,height:image.viewportHeight}} />
 </div>;
}
