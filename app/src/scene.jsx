import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import { samplePose, resolvePose, contactFraming } from './camera-path.js';
import FilmRoll from './film-roll.jsx';
import {mobileCameraPose,DESKTOP_CAMERA_QUERY} from './mobile-camera.js';

// The supplied GLB is centered, +Y up, with its lens pointing along +Z.
// Normalize by its longest dimension so the existing journey uses scene units.
const MODEL_URL=new URL('../../assets/sony-a7s-iii.glb',import.meta.url).href;
function CameraModel({journey,onReady}){
 const {scene}=useGLTF(MODEL_URL);
 const {invalidate}=useThree();
 const model=useMemo(()=>{
  const object=scene.clone(true);
  object.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(object);
  const center=bounds.getCenter(new THREE.Vector3());
  const size=bounds.getSize(new THREE.Vector3());
  const normalization=new THREE.Matrix4().makeScale(4.4/Math.max(size.x,size.y,size.z),4.4/Math.max(size.x,size.y,size.z),4.4/Math.max(size.x,size.y,size.z));
  normalization.multiply(new THREE.Matrix4().makeTranslation(-center.x,-center.y,-center.z));
  const reveal={value:0},screenEntry={value:0};
  const materials=new Map(),edges=[];
  object.traverse(node=>{
   if(!node.isMesh)return;
   const sourceMaterials=Array.isArray(node.material)?node.material:[node.material];
   // The shadow pass treats glass as opaque; do not black out the optical cavity.
   node.castShadow=!sourceMaterials.some(material=>material.transmission>0);node.receiveShadow=true;
   const outline=new THREE.EdgesGeometry(node.geometry,28);
   outline.applyMatrix4(node.matrixWorld).applyMatrix4(normalization);
   edges.push(outline);
   const ownMaterial=source=>{
    // GLTFLoader splits primitives by material. Check the LCD's ancestor name
    // so its cover glass can settle to an empty display without changing EVF/lens.
    let lcdNode=node,isLCD=false;
    while(lcdNode){if(/Rear__02.*LCD/i.test(lcdNode.name))isLCD=true;lcdNode=lcdNode.parent;}
    const isScreen=isLCD&&/LCD.*EVF/.test(source.name);
    const key=isScreen?'rear-screen':source;
    if(materials.has(key))return materials.get(key);
    const material=source.clone();
    // Keep the GLB's optical material intact: transmission 1, IOR 1.48,
    // roughness .025 and its subtle green tint. Disabling transmission turns
    // that tint into an opaque, diffusely lit green disc. Opacity is not glass.
    if(material.transmission>0){material.opacity=1;material.transparent=false;}
    material.polygonOffset=true;material.polygonOffsetFactor=1;material.polygonOffsetUnits=1;
    material.onBeforeCompile=shader=>{
     shader.uniforms.uCameraReveal=reveal;
     shader.uniforms.uScreenEntry=screenEntry;
     shader.fragmentShader='uniform float uCameraReveal;\nuniform float uScreenEntry;\n'+shader.fragmentShader;
     shader.fragmentShader=shader.fragmentShader.replace('#include <colorspace_fragment>','#include <colorspace_fragment>\n gl_FragColor.rgb = mix(vec3(0.07451), gl_FragColor.rgb, uCameraReveal);'+(isScreen?'\n gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.07451), uScreenEntry);':''));
    };
    material.customProgramCacheKey=()=>isScreen?'sony-rear-screen-entry-v1':'sony-outline-to-studio-v1';
    materials.set(key,material);return material;
   };
   node.material=Array.isArray(node.material)?node.material.map(ownMaterial):ownMaterial(node.material);
  });
  const geometry=mergeGeometries(edges,false);edges.forEach(g=>g.dispose());
  const lines=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xc4c4c4,transparent:true,opacity:.62,depthWrite:false}));
  lines.renderOrder=2;
  const normalized=new THREE.Group();normalized.matrix.copy(normalization);normalized.matrixAutoUpdate=false;normalized.add(object);
  const group=new THREE.Group();group.add(normalized,lines);
  return {group,reveal,screenEntry,lines,dispose(){geometry.dispose();lines.material.dispose();materials.forEach(m=>m.dispose());}};
 },[scene]);
 useEffect(()=>{
  // Ready follows GLB parsing and GPU preparation, never just Canvas creation.
  let second;const first=requestAnimationFrame(()=>{invalidate();second=requestAnimationFrame(onReady);});
  return()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);model.dispose();};
 },[model]);
 useFrame(()=>{
  const state=journey.current;
  const reveal=state.mobile?(state.mobileFrame?.stage==='hero'&&!state.reduced?THREE.MathUtils.smoothstep(state.heroProgress||0,0,.35):1):state.reduced?(state.screenActive?1:0):THREE.MathUtils.smoothstep(state.heroProgress||0,.08,.75);
  model.screenEntry.value=state.reduced?0:THREE.MathUtils.smoothstep(state.screenProgress||0,.5,.96);
  model.reveal.value=reveal;
  model.lines.material.opacity=.62*(1-reveal);
  model.lines.visible=reveal<.995;
 });
 return <primitive object={model.group} dispose={null}/>;
}
function Rig({journey,onReady,onFailure}){
 const group=useRef(),pointerGroup=useRef(),shadow=useRef();
 const {camera,invalidate,gl,setFrameloop,setDpr,size}=useThree();
 const pointer=useRef({x:0,y:0,currentX:0,currentY:0});const target=useMemo(()=>new THREE.Vector3(),[]);
 useEffect(()=>{
  const media=matchMedia(DESKTOP_CAMERA_QUERY);
  const update=()=>setDpr(Math.min(devicePixelRatio,media.matches?1.5:1.25));
  update();media.addEventListener('change',update);
  return()=>media.removeEventListener('change',update);
 },[setDpr]);
 useEffect(()=>{
  journey.current.invalidate=invalidate;invalidate();
  const onMove=e=>{if(journey.current.reduced||journey.current.mobile||journey.current.rollActive||journey.current.visible===false||journey.current.contactBlend>0)return;pointer.current.x=(e.clientX/innerWidth-.5)*.045;pointer.current.y=(e.clientY/innerHeight-.5)*.028;invalidate();};
  const onOut=e=>{if(e.relatedTarget===null){pointer.current.x=pointer.current.y=0;invalidate();}};
  const onVisibility=()=>{setFrameloop(document.hidden?'never':'demand');if(!document.hidden)invalidate();};
  const onLost=e=>{e.preventDefault();onFailure();};
  const media=matchMedia('(hover: hover) and (pointer: fine)');
  if(media.matches)window.addEventListener('pointermove',onMove,{passive:true});window.addEventListener('pointerout',onOut);
  document.addEventListener('visibilitychange',onVisibility);gl.domElement.addEventListener('webglcontextlost',onLost);
  return()=>{journey.current.invalidate=()=>{};window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerout',onOut);document.removeEventListener('visibilitychange',onVisibility);gl.domElement.removeEventListener('webglcontextlost',onLost);};
 },[]);
 useFrame(()=>{
  const state=journey.current;
  group.current.visible=!state.rollActive&&state.visible!==false;
  if(camera.view?.enabled)camera.clearViewOffset();
  if(state.rollActive){
   camera.position.set(0,0,10);camera.lookAt(0,0,0);shadow.current.visible=false;
   return;
  }
  const mobileFrame=state.mobileFrame;
  if(state.mobile){
   shadow.current.visible=false;
   if(!mobileFrame){group.current.visible=false;return;}
   const pose=mobileCameraPose(mobileFrame.stage,mobileFrame.progress,mobileFrame.rect,size.width,size.height,state.reduced);
   camera.position.fromArray(pose.eye);camera.lookAt(target.fromArray(pose.target));
   camera.setViewOffset(size.width,size.height,pose.offsetX,pose.offsetY,size.width,size.height);
   group.current.position.fromArray(pose.position);group.current.rotation.set(...pose.rotation);group.current.scale.setScalar(pose.scale);
   pointerGroup.current.rotation.set(0,0,0);
   return;
  }
  const frame=state.contactFrame?contactFraming(state.contactFrame,size.width,size.height):null;
  const pose=state.reduced&&state.screenActive?resolvePose('rear',state.mobile,size.width/size.height):samplePose(state.waypoints,state.progress,state.mobile,size.width/size.height,state.mobile&&size.width>600,state.reduced,frame?.scale);
  camera.position.fromArray(pose.eye);
  target.fromArray(pose.target);camera.lookAt(target);
  if(frame&&state.contactBlend>0)camera.setViewOffset(size.width,size.height,frame.offsetX*state.contactBlend,frame.offsetY*state.contactBlend,size.width,size.height);
  group.current.position.fromArray(pose.position);
  group.current.rotation.set(...pose.rotation);
  group.current.scale.setScalar(pose.scale);
  const p=pointer.current;p.currentX=THREE.MathUtils.lerp(p.currentX,p.x,.14);p.currentY=THREE.MathUtils.lerp(p.currentY,p.y,.14);
  // Eliminate pointer drift before aligning with the screen. It must stay
  // exactly centred all the way through entry, including reverse scrolling.
  const pointerWeight=state.reduced||state.mobile?0:1-THREE.MathUtils.smoothstep(state.screenProgress||0,0,.32);
  pointerGroup.current.rotation.y=p.currentX*pointerWeight;pointerGroup.current.rotation.x=p.currentY*pointerWeight;
  if(pointerWeight>0&&Math.abs(p.currentX-p.x)+Math.abs(p.currentY-p.y)>.0001)invalidate();
  shadow.current.visible=false;
 });
 return <>
  <ambientLight intensity={.28}/><hemisphereLight args={[0xf7f7ef,0x272b2d,1.05]}/>
  <directionalLight position={[-3,6,6]} intensity={3.8} color={0xfff4df} castShadow shadow-mapSize={[512,512]} shadow-bias={-.0005} shadow-normalBias={.05} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6}/>
  <directionalLight position={[5,2,-3]} intensity={4.5} color={0xd9e9ee}/>
  <rectAreaLight position={[-3,2,5]} width={6} height={1} intensity={5} color={0xf9f9f2}/>
  <Environment resolution={256} frames={1}>
   <Lightformer form="rect" intensity={5} position={[0,4,2]} rotation={[Math.PI/2,0,0]} scale={[8,2,1]}/>
   <Lightformer form="rect" intensity={3} position={[-5,0,2]} rotation={[0,Math.PI/2,0]} scale={[5,7,1]}/>
   <Lightformer form="rect" intensity={4} position={[5,2,-2]} rotation={[0,-Math.PI/2,0]} scale={[3,6,1]}/>
   {/* Front softboxes give the lens something to reflect in the head-on pose.
       Captured once into the environment; no live reflection camera or overlay. */}
   <Lightformer form="rect" intensity={3} position={[-3,2.5,8]} target={[0,0,0]} scale={[2,5,1]}/>
   <Lightformer form="rect" intensity={1.5} position={[3,-1,7]} target={[0,0,0]} scale={[.7,3.5,1]}/>
  </Environment>
  <group ref={group}><group ref={pointerGroup}><Suspense fallback={null}><CameraModel journey={journey} onReady={onReady}/></Suspense></group></group>
  <FilmRoll journey={journey}/>
  <mesh ref={shadow} position={[2,-1.95,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[7,6]}/><shadowMaterial transparent opacity={.22}/></mesh>
 </>;
}
export default function Scene({journey,onReady,onFailure}){
 return <Canvas frameloop="demand" dpr={[1,1.5]} shadows camera={{fov:36,position:[0,.75,9.4],near:.1,far:45}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;gl.outputColorSpace=THREE.SRGBColorSpace;gl.setClearColor(0x000000,0);}} fallback={null}>
  <Rig journey={journey} onReady={onReady} onFailure={onFailure}/>
 </Canvas>;
}
