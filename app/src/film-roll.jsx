import React, {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {createFilmGeometry} from './film-geometry.js';
import {rollPhotos} from './roll-photos.js';

function createFilmTexture() {
 const canvas=document.createElement('canvas');canvas.width=512*rollPhotos.length;canvas.height=320;
 const ctx=canvas.getContext('2d');
 const texture=new THREE.CanvasTexture(canvas);
 texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=THREE.RepeatWrapping;
 texture.anisotropy=2;
 function draw(images=[]) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Photographic amber is material color, scoped to the film object.
  ctx.fillStyle='#bf721e';ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let frame=0;frame<rollPhotos.length;frame++) {
   const x=frame*512;
   ctx.fillStyle='#171717';ctx.fillRect(x+9,43,494,234);
   const img=images[frame];
   if(img) {
    // Preserve the full portrait/landscape composition inside the film frame.
    // Atlas proportions match the ribbon UV scale so photos are not stretched.
    const ratio=Math.min(494/img.naturalWidth,234/img.naturalHeight);
    const width=img.naturalWidth*ratio,height=img.naturalHeight*ratio;
    ctx.drawImage(img,x+9+(494-width)/2,43+(234-height)/2,width,height);
    // Tone the photograph and side mattes to the strip's #bf721e amber.
    // Run once when images load, keeping all recoloring out of the render loop.
    const photo=ctx.getImageData(x+9,43,494,234),pixels=photo.data;
    for(let p=0;p<pixels.length;p+=4) {
     const light=(pixels[p]*.2126+pixels[p+1]*.7152+pixels[p+2]*.0722)/255;
     pixels[p]=Math.round(light*191);
     pixels[p+1]=Math.round(light*114);
     pixels[p+2]=Math.round(light*30);
    }
    ctx.putImageData(photo,x+9,43);
   }
   ctx.strokeStyle='#e6a54b';ctx.lineWidth=2;ctx.strokeRect(x+9,43,494,234);
   ctx.fillStyle='#edb461';ctx.font='12px monospace';
   ctx.fillText('AK / 35MM',x+20,39);
   ctx.fillText(`${rollPhotos[frame].label}  ▷`,x+441,289);
   for(let hole=0;hole<8;hole++)for(const y of [8,289]) {
    ctx.save();ctx.globalCompositeOperation='destination-out';ctx.beginPath();
    ctx.roundRect(x+hole*64+14,y,35,23,4);ctx.fill();ctx.restore();
   }
  }
  texture.needsUpdate=true;
 }
 draw();return {texture,draw};
}

export default function FilmRoll({journey}) {
 const mesh=useRef();
 const {size,gl,invalidate}=useThree();
 const resources=useMemo(()=>{
  const {texture,draw}=createFilmTexture();
  const geometry=createFilmGeometry();
  const clip={value:new THREE.Vector4(0,0,1,1)},buffer={value:new THREE.Vector2(1,1)};
  const material=new THREE.MeshStandardMaterial({map:texture,side:THREE.DoubleSide,roughness:.38,metalness:.24,transparent:true,alphaTest:.025,depthWrite:true,envMapIntensity:.6});
  material.forceSinglePass=true;
  material.onBeforeCompile=shader=>{
   shader.uniforms.uFilmClip=clip;shader.uniforms.uFilmBuffer=buffer;
   shader.fragmentShader='uniform vec4 uFilmClip;\nuniform vec2 uFilmBuffer;\n'+shader.fragmentShader;
   shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>',`#include <clipping_planes_fragment>
    vec2 filmScreen = gl_FragCoord.xy / uFilmBuffer;
    if (filmScreen.x < uFilmClip.x || filmScreen.y < uFilmClip.y || filmScreen.x > uFilmClip.z || filmScreen.y > uFilmClip.w) discard;`);
  };
  material.customProgramCacheKey=()=> 'portfolio-film-clip-v1';
  return {geometry,material,texture,draw,clip,buffer};
 },[]);
 useEffect(()=>{
  let alive=true;
  const images=rollPhotos.map(({src})=>{const img=new Image();img.decoding='async';img.src=src;return img;});
  Promise.all(images.map(img=>img.decode().then(()=>img).catch(()=>null))).then(loaded=>{
   // Keep a missing image's numbered frame empty without shifting later photos.
   if(alive){resources.draw(loaded);invalidate();}
  });
  return()=>{alive=false;resources.geometry.dispose();resources.material.dispose();resources.texture.dispose();};
 },[resources,invalidate]);
 useFrame(()=>{
  const state=journey.current,rect=state.filmRect;
  mesh.current.visible=Boolean(state.rollActive&&rect&&rect.y<size.height&&rect.y+rect.height>0);
  if(!mesh.current.visible)return;
  const worldHeight=2*Math.tan(THREE.MathUtils.degToRad(18))*10;
  const unit=worldHeight/size.height;
  const scale=rect.width*unit/2.5;
  const progress=state.reduced?0:state.rollProgress||0;
  mesh.current.position.set((rect.x+rect.width/2-size.width/2)*unit,(size.height/2-rect.y-rect.height/2)*unit+(progress-.5)*scale*.7,0);
  mesh.current.rotation.set(.035,-.5+progress*.8,-.035);
  mesh.current.scale.setScalar(scale);
  resources.material.opacity=state.rollReveal??1;
  resources.clip.value.set(rect.x/size.width,1-(rect.y+rect.height)/size.height,(rect.x+rect.width)/size.width,1-rect.y/size.height);
  gl.getDrawingBufferSize(resources.buffer.value);
 });
 return <mesh ref={mesh} geometry={resources.geometry} material={resources.material} visible={false} dispose={null}/>;
}
