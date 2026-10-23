# Sony A7S III + FE 24–70mm F2.8 GM II

Created 23 October 2026 in Blender 5.2.0 LTS.

This is a **detailed procedural approximation informed by Sony references**, not a scan, manufacturer CAD model, or dimensionally exact photorealistic reproduction. The grip, EVF shell, small controls, lettering, and lens switch layout are simplified. It is intended as a portfolio hero asset; use the supplied preview and interactive viewer to judge its suitability for your closest shots.

## Delivered asset

| Property | Value |
|---|---:|
| Format | glTF 2.0 binary, `sony-a7s-iii.glb` |
| Triangles | 117,404 |
| Exported vertices | 137,959, including normal/UV splits |
| Mesh assemblies | 19 named groups |
| Material primitives | 53 |
| PBR materials | 14 |
| GLB size | 12,634,520 bytes / 12.63 MB / 12.05 MiB |
| Embedded texture images | Four 1024 × 1024 PNGs |
| Texture roles | Enamel normal + packed roughness; rubber normal + packed roughness |
| Overall bounds, X × Y × Z | 0.13390 × 0.103805 × 0.19665 m |
| Units | Meters; use scale 1 for physical scale |
| GLB axes | +Y up; lens points along +Z |
| Blender source axes | +Z up; lens points along −Y |
| Origin | Center of complete assembly bounding box |
| Compression | Standard indexed geometry and PNG; no Draco or KTX2 decoder |
| Material extensions | KHR_materials_transmission, KHR_materials_ior |
| External asset dependencies | None |

The 53 material primitives are separate render submissions. The supplied Three.js scene reports 106 submissions in the hero view because transmissive optics add a rendering pass. This is a desktop hero asset rather than a heavily reduced mobile LOD. No device-wide frame-rate guarantee or mobile performance benchmark is claimed.

The editable `.blend` contains the same optimized mesh assemblies, packed texture images, and a separate neutral studio collection. The studio camera, lights, and floor are excluded from the GLB. There is no articulation rig, functional zoom, internal sensor mechanism, or baked animation.

## Validation

- Reimported the exported GLB into a separate Blender scene and rendered hero, front, side, top, and rear views under neutral studio lighting.
- Checked the body/lens connection, viewfinder, screen, controls, silhouette and surface appearance from those views.
- All geometry attributes are finite, indices remain within bounds, and normals/tangents are present. No exact zero-area triangles or zero tangent vectors remain.
- Khronos glTF Validator: **0 errors and 0 warnings**. Informational notices identify UV/tangent attributes retained on untextured materials; see `gltf-validation.json`.
- Loaded and rendered through **Three.js r180 / GLTFLoader** in the local viewer in Brave and Safari. Runtime inspection confirms 117,404 triangles, 14 materials, four 1024² textures, centered bounds, and no missing normals or required tangents. All six view presets were inspected; Brave’s final console showed zero messages and no issues. Evidence is included in `inspection/threejs-validation.json` and `inspection/threejs/`.

The studio preview is an actual render of the reimported GLB. It is not an AI-generated stand-in. Optical highlights vary with lighting and angle; use environment lighting in the target website.

## React Three Fiber

Copy `sony-a7s-iii.glb` to your app's `public/` directory. `CameraModel.jsx` supplies both a reusable model component and a complete neutral preview using `@react-three/fiber`, `@react-three/drei`, and `three`.

```jsx
import CameraModel from './CameraModel';

// Inside your Canvas and Suspense boundary:
<CameraModel rotation={[0, 0, 0]} scale={1} />
```

The R3F component is supplied as an integration example; a separate React application build was not run.

A scene camera at `[0, 0.04, 0.4]` looks toward the front of the lens. A rear view uses a negative Z position. Rotate the component around its Y axis for a turntable or scroll-driven sequence; there is no corrective 90-degree rotation to apply. Keep the near clipping plane around `0.001` meters for close shots. Use a studio environment, tone mapping, and moderate exposure so the black surfaces and optical glass retain detail.

## Local inspection viewer

From this output folder, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [the local Three.js viewer](http://127.0.0.1:8000/viewer/). It provides six view presets, orbit/zoom controls, and a browser-derived model details panel. Three.js is vendored locally with its license; the viewer does not require a CDN or uploading the asset.

## Reference basis

Sony publishes the body as **128.9 × 96.9 × 80.8 mm**, and the lens as **87.8 mm diameter × 119.9 mm length**, with an **82 mm filter thread**. These guided construction, but the modeled overall assembly bounds above are the authoritative values for placement. Small external protrusions and the sculpted grip make this approximation wider than the published body width.

- [Sony A7S III specifications](https://www.sony.co.uk/electronics/support/e-mount-body-ilce-7-series/ilce-7sm3/specifications)
- [Sony FE 24–70mm F2.8 GM II specifications](https://www.sony.com/electronics/support/lenses-e-mount-lenses/sel2470gm2/specifications)
- [Sony front controls](https://helpguide.sony.net/ilc/2410/v1/en/contents/201h_names_of_parts_CX85000_front.html)
- [Sony top controls](https://helpguide.sony.net/ilc/2410/v1/en/contents/201h_names_of_parts_CX85000_top.html)
- [Sony rear controls](https://helpguide.sony.net/ilc/2410/v1/en/contents/201h_names_of_parts_CX85000_back.html)
