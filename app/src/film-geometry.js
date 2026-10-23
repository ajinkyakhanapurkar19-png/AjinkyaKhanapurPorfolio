import * as THREE from 'three';

// One continuous ribbon, with UVs following the film transport direction.
// Sprockets are cut out by the alpha map, not expensive repeated hole meshes.
export function createFilmGeometry(segments=480) {
 const vertices=[],uvs=[],indices=[];
 for(let i=0;i<=segments;i++) {
  const t=i/segments,theta=t*Math.PI*5.4;
  for(const side of [-1,1]) {
   vertices.push(Math.sin(theta),3.1-t*6.2+side*.38,Math.cos(theta));
   uvs.push(t*3,(side+1)/2);
  }
  if(i<segments) {const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}
 }
 const geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
 geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
 geometry.setIndex(indices);geometry.computeVertexNormals();geometry.computeBoundingSphere();
 return geometry;
}
