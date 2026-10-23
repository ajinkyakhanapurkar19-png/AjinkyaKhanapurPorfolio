import * as THREE from 'three';

// Actual rear LCD glass bounds in the supplied GLB, normalized to 4.4 units.
// The outside face is -Z. A half-turn brings it toward the virtual camera.
export const LCD = {
 center: [.3591153223, -.2622883831, -1.9673023738],
 width: 1.6109839669, height: .9397406925
};
export const WAYPOINTS = {
 opening:{eye:[0,0,9.4],target:[0,0,0],position:[0,-.28,0],rotation:[.32,.62,-.08],scale:1.13},
 front:{eye:[0,.3,9.4],target:[0,0,0],position:[-.1,-.1,0],rotation:[.1,.07,0],scale:1.05},
 closeup:{eye:[0,.16,7.3],target:[0,0,0],position:[-2.4,-.1,.1],rotation:[.025,.04,.02],scale:1.35},
 rear:{eye:[0,0,8.5],target:[0,0,0],position:[0,0,0],rotation:[0,Math.PI,0],scale:1},
 screen:{eye:[-.3591153223,-.2622883831,6.5],target:[-.3591153223,-.2622883831,1.9673023738],position:[0,0,0],rotation:[0,Math.PI,0],scale:1},
 inside:{eye:[-.3591153223,-.2622883831,2.5],target:[-.3591153223,-.2622883831,1.9673023738],position:[0,0,0],rotation:[0,Math.PI,0],scale:1},
 about:{eye:[-.3591153223,-.2622883831,2.5],target:[-.3591153223,-.2622883831,1.9673023738],position:[0,0,0],rotation:[0,Math.PI,0],scale:1},
 contact:{eye:[0,0,10],target:[0,0,0],position:[0,0,0],rotation:[0,Math.PI*1.5,0],scale:.8}
};
export const MOBILE_POSES = {
 opening:{eye:[0,0,10.1],target:[0,0,0],position:[0,-.12,0],rotation:[.32,.62,-.08],scale:.57},
 front:{eye:[0,.3,10.1],target:[0,0,0],position:[0,-1.2,0],rotation:[.03,-.06,0],scale:.79},
 closeup:{eye:[0,.15,9.7],target:[0,0,0],position:[0,-1.15,0],rotation:[0,.08,.02],scale:.85},
 rear:{eye:[0,0,11.5],target:[0,0,0],position:[0,0,0],rotation:[0,Math.PI,0],scale:.85},
 screen:{eye:[-.305248024,-.222945126,7],target:[-.305248024,-.222945126,1.672207018],position:[0,0,0],rotation:[0,Math.PI,0],scale:.85},
 inside:{eye:[-.305248024,-.222945126,2.2],target:[-.305248024,-.222945126,1.672207018],position:[0,0,0],rotation:[0,Math.PI,0],scale:.85},
 about:{eye:[-.305248024,-.222945126,2.2],target:[-.305248024,-.222945126,1.672207018],position:[0,0,0],rotation:[0,Math.PI,0],scale:.85},
 contact:{eye:[0,0,10],target:[0,0,0],position:[0,0,0],rotation:[0,Math.PI*1.5,0],scale:.5}
};

// Compute the final dolly distance from BOTH viewport axes. Stay outside the
// physical glass; its face covers the viewport before any geometry is crossed.
export function resolvePose(name, mobile, aspect, tablet = false, contactScale) {
 const source=(mobile?MOBILE_POSES:WAYPOINTS)[name];
 const pose={...source,eye:[...source.eye],target:[...source.target]};
 if(tablet&&['opening','front','closeup','contact'].includes(name))pose.scale*=1.25;
 if(name==='contact'&&Number.isFinite(contactScale))pose.scale=contactScale;
 if(name==='inside'||name==='about'){
  const halfFov=Math.tan(THREE.MathUtils.degToRad(36/2));
  const distance=Math.min(LCD.height,LCD.width/aspect)*pose.scale/(2*halfFov)*.86;
  pose.eye[2]=pose.target[2]+distance;
 }
 return pose;
}

// One deterministic sampler is shared by the renderer and geometry checks.
export function samplePose(path, progress, mobile, aspect, tablet = false, reduced = false, contactScale) {
 let n=0;
 for(let i=0;i<path.length;i++)if(progress>=path[i].at)n=i;
 const start=path[n]||{name:'opening',at:0};
 const end=path[Math.min(n+1,path.length-1)]||start;
 if(reduced){
  const name=['rear','screen','inside','about'].includes(start.name)?'rear':start.name;
  return resolvePose(name,mobile,aspect,tablet,contactScale);
 }
 let t=THREE.MathUtils.clamp((progress-start.at)/Math.max(.0001,end.at-start.at),0,1);
 t=t*t*(3-2*t);
 const a=resolvePose(start.name,mobile,aspect,tablet,contactScale),b=resolvePose(end.name,mobile,aspect,tablet,contactScale);
 const pose={scale:THREE.MathUtils.lerp(a.scale,b.scale,t)};
 for(const key of ['eye','target','position','rotation'])pose[key]=a[key].map((v,i)=>THREE.MathUtils.lerp(v,b[key][i],t));
 return pose;
}

// The GLB normalized to 4.4 units, then turned exactly side-on, measures
// 4.4 × 2.322614 × 2.995983. Fit its nearest depth plane inside the DOM slot.
// A projection offset places that slot in the full-page canvas without
// moving the object off-axis or making its side profile change on scroll.
export function contactFraming(rect, width, height) {
 const distance=10,halfDepth=2.995984/2;
 const viewHeight=2*distance*Math.tan(THREE.MathUtils.degToRad(18));
 const fit=Math.min(rect.width/width*viewHeight*(width/height)/4.4,rect.height/height*viewHeight/2.322614)*.88;
 return {
  scale:fit/(1+fit*halfDepth/distance),
  offsetX:width/2-(rect.x+rect.width/2),
  offsetY:height/2-(rect.y+rect.height/2)
 };
}
