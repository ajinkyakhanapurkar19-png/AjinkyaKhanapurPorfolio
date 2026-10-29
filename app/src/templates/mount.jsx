import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
export function mount(Page){
 const root=document.getElementById('root');
 root.querySelectorAll('img[src]').forEach(img=>{
  const src=img.getAttribute('src');if(!src.startsWith('data:'))img.setAttribute('src',new URL(src,document.baseURI).href);
 });
 // Inline image/mask layers have the same production URL base as image src.
 root.querySelectorAll('[style]').forEach(node=>{
  for(const property of ['maskImage','backgroundImage']){
   const value=node.style[property];
   if(value?.includes('./bundles/'))node.style[property]=value.replace(/\.\/bundles\/[^"')]+/g,path=>new URL(path,document.baseURI).href);
  }
 });
 if(root.hasChildNodes())hydrateRoot(root,<Page/>);else createRoot(root).render(<Page/>);
}
