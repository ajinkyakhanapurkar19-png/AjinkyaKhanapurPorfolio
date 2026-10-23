import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as T from 'three';
import { LCD, WAYPOINTS, MOBILE_POSES, resolvePose, samplePose, contactFraming } from '../app/src/camera-path.js';
const bytes=fs.readFileSync('assets/sony-a7s-iii.glb');
assert.equal(bytes.readUInt32LE(0),0x46546c67);
const jsonLength=bytes.readUInt32LE(12);
const gltf=JSON.parse(bytes.subarray(20,20+jsonLength).toString());
const binary=bytes.subarray(28+jsonLength);
const vertices=[];
function visit(index,parent=new T.Matrix4()){
 const node=gltf.nodes[index];
 const local=node.matrix?new T.Matrix4().fromArray(node.matrix):new T.Matrix4().compose(new T.Vector3().fromArray(node.translation||[0,0,0]),new T.Quaternion().fromArray(node.rotation||[0,0,0,1]),new T.Vector3().fromArray(node.scale||[1,1,1]));
 const world=parent.clone().multiply(local);
 if(node.mesh!==undefined)for(const primitive of gltf.meshes[node.mesh].primitives){
  const acc=gltf.accessors[primitive.attributes.POSITION],view=gltf.bufferViews[acc.bufferView];
  assert.equal(acc.componentType,5126);
  for(let i=0;i<acc.count;i++){
   const offset=(view.byteOffset||0)+(acc.byteOffset||0)+i*(view.byteStride||12);
   vertices.push(new T.Vector3(binary.readFloatLE(offset),binary.readFloatLE(offset+4),binary.readFloatLE(offset+8)).applyMatrix4(world));
  }
 }
 node.children?.forEach(child=>visit(child,world));
}
gltf.scenes[gltf.scene||0].nodes.forEach(index=>visit(index));
const bounds=new T.Box3().setFromPoints(vertices),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());
const unit=4.4/Math.max(...size.toArray());vertices.forEach(v=>v.sub(center).multiplyScalar(unit));
function project(pose,width,height,frame){
 const camera=new T.PerspectiveCamera(36,width/height,.1,45);camera.position.fromArray(pose.eye);camera.lookAt(new T.Vector3().fromArray(pose.target));camera.updateMatrixWorld();
 if(frame)camera.setViewOffset(width,height,frame.offsetX,frame.offsetY,width,height);
 const matrix=new T.Matrix4().compose(new T.Vector3().fromArray(pose.position),new T.Quaternion().setFromEuler(new T.Euler(...pose.rotation)),new T.Vector3().setScalar(pose.scale));
 const result={left:Infinity,right:-Infinity,top:Infinity,bottom:-Infinity,depth:Infinity};
 for(const vertex of vertices){
  const v=vertex.clone().applyMatrix4(matrix);result.depth=Math.min(result.depth,-v.clone().applyMatrix4(camera.matrixWorldInverse).z);v.project(camera);
  const x=(v.x+1)/2,y=(1-v.y)/2;
  result.left=Math.min(result.left,x);result.right=Math.max(result.right,x);result.top=Math.min(result.top,y);result.bottom=Math.max(result.bottom,y);
 }
 return Object.fromEntries(Object.entries(result).map(([k,v])=>[k,Number(v.toFixed(3))]));
}
// Independently measure the supplied glass instead of trusting authored poses.
const lcdPrimitive=gltf.meshes[gltf.nodes.find(n=>n.name==='Rear__02 LCD').mesh].primitives.find(p=>p.material===7);
const lcdAccessor=gltf.accessors[lcdPrimitive.attributes.POSITION];
const lcdMin=new T.Vector3().fromArray(lcdAccessor.min).sub(center).multiplyScalar(unit);
const lcdMax=new T.Vector3().fromArray(lcdAccessor.max).sub(center).multiplyScalar(unit);
const measured=new T.Vector3((lcdMin.x+lcdMax.x)/2,(lcdMin.y+lcdMax.y)/2,lcdMin.z);
assert.ok(measured.distanceTo(new T.Vector3().fromArray(LCD.center))<1e-7,'Screen target must match the actual GLB');
const sizes=[[360,800],[390,844],[430,932],[600,900],[768,1024],[820,1180],[1024,768],[1366,768],[1440,900],[1920,1080],[2560,1080]];
for(const [w,h] of sizes){
 const mobile=w<1000,tablet=mobile&&w>600;
 const pose=resolvePose('inside',mobile,w/h,tablet);
 const matrix=new T.Matrix4().compose(new T.Vector3().fromArray(pose.position),new T.Quaternion().setFromEuler(new T.Euler(...pose.rotation)),new T.Vector3().setScalar(pose.scale));
 const camera=new T.PerspectiveCamera(36,w/h,.1,45);camera.position.fromArray(pose.eye);camera.lookAt(new T.Vector3().fromArray(pose.target));camera.updateMatrixWorld();
 const corners=[];
 for(const x of [lcdMin.x,lcdMax.x])for(const y of [lcdMin.y,lcdMax.y])corners.push(new T.Vector3(x,y,lcdMin.z).applyMatrix4(matrix).project(camera));
 const xs=corners.map(v=>v.x),ys=corners.map(v=>v.y);
 assert.ok(Math.min(...xs)<-1.05&&Math.max(...xs)>1.05&&Math.min(...ys)<-1.05&&Math.max(...ys)>1.05,`${w}: LCD must cover viewport with a crop margin`);
 const target=measured.clone().applyMatrix4(matrix).project(camera);
 assert.ok(Math.abs(target.x)<1e-6&&Math.abs(target.y)<1e-6,`${w}: LCD must be exactly centred`);
 const opening=project(resolvePose('opening',mobile,w/h,tablet),w,h);
 assert.ok(opening.left>0&&opening.right<1&&opening.top>0&&opening.bottom<1,`${w}: opening camera should fit`);
 console.log(`PASS ${w}×${h}: opening fits; actual LCD centres and covers viewport.`);
 // The closing camera must fit its real layout region, including when that
 // region scrolls above/below the viewport. Every actual model vertex is used.
 for(const y of [h*.4,h*.7,-h*.2]){
  const width=Math.min(w-48,680),height=Math.min(420,Math.max(200,h*.37));
  const rect={x:(w-width)/2,y,width,height};
  const frame=contactFraming(rect,w,h);
  const finalPose=resolvePose('contact',mobile,w/h,tablet,frame.scale);
  const projected=project(finalPose,w,h,frame);
  assert.ok(projected.left>=rect.x/w&&projected.right<=(rect.x+width)/w,`${w}: closing camera must fit horizontally`);
  assert.ok(projected.top>=y/h&&projected.bottom<=(y+height)/h,`${w}: camera must stay above social links`);
  assert.ok(Math.abs((projected.left+projected.right)/2-.5)<.04,`${w}: side view must remain centred`);
  assert.ok(projected.depth>.1,`${w}: closing camera must not clip`);
  assert.equal(Math.abs(Math.cos(finalPose.rotation[1]))<1e-6,true,'Camera must settle side-on');
 }
}
console.log('PASS: side-profile camera stays centred inside its DOM slot at every size and scroll offset.');
for(const [mobile,w,h] of [[false,1440,900],[true,390,844],[true,820,1180]]){
 const names=Object.keys(mobile?MOBILE_POSES:WAYPOINTS);
 const path=names.map((name,i)=>({name,at:i/(names.length-1)}));
 for(let i=0;i<path.length-1;i++)for(let j=0;j<=20;j++){
  const progress=(i+j/20)/(path.length-1);
  const pose=samplePose(path,progress,mobile,w/h,mobile&&w>600);
  const box=project(pose,w,h);
  assert.ok(box.depth>.1,`${w}: ${names[i]} → ${names[i+1]} clips near plane at ${j/20}: ${box.depth}`);
 }
 const stable=samplePose(path,path.find(w=>w.name==='inside').at,mobile,w/h,false,true);
 assert.equal(stable.rotation[1],Math.PI,'Reduced motion shows a stable rear view');
 assert.ok(stable.eye[2]>8,'Reduced motion must not dolly into the screen');
}
console.log('PASS: no near-plane collision across sampled journey poses; reduced motion stays outside the screen.');
