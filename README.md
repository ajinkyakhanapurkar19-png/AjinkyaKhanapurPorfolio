# Through the 35mm Lens

A React 18 + Vite portfolio for Ajinkya Khanapurkar, with the supplied Sony A7S III GLB rendered through Three.js, React Three Fiber, drei studio lighting and GSAP ScrollTrigger.

## Run locally

```sh
git clone https://github.com/ajinkyakhanapurkar19-png/AjinkyaKhanapurPorfolio.git
cd AjinkyaKhanapurPorfolio
npm ci --include=dev
npm run dev
```

Node tested: 26.4.0. Vite requires Node 20.19+ or 22.12+. React 18, Fiber 8, drei 9 and Three r170 are pinned together in `package.json` and the lockfile.

## Build

```sh
npm run build
npm run preview
```

`dist/` is the deployable static site. The build also packages the root `index.html` and `bundles/` for the Open Design preview. Keep those together; source assets remain in `assets/`. The editable Vite entry is `app/index.html`; it is a source file, not an additional product screen.

The repository includes editable source, required camera/photo/font assets, dependency versions, and build/verification scripts. Dependencies, generated output, original uploads, and design-session captures are excluded from Git. Build after cloning to generate the preview and deployable site.

## Checks

Run after building:

```sh
node scripts/verify.mjs
node --experimental-vm-modules scripts/verify-preview.mjs
node scripts/verify-camera.mjs
node scripts/verify-project-stack.mjs
```

## Edit

- `app/src/content.js`: audited profile, projects and original destination URLs. Missing resume / tools / research URL / CineJournal description are explicit nulls or an empty array.
- `app/src/main.jsx`: accessible HTML chapters, work index, native dialog filtering, project navigation, mailto links and clipboard feedback.
- `app/src/scene.jsx`: replaceable `CameraModel`, physically based materials, studio lights and named `WAYPOINTS` / `MOBILE_POSES`.
- `app/src/seed.css`: base classes copied from the bundled web-prototype seed with replaced palette tokens.
- `app/src/portfolio.css`: original editorial composition and responsive/reduced-motion contracts.
- `CONTENT-AUDIT.md`: missing content and source inconsistencies.
- `brand-spec.md`: extracted reference values and original presentation system.

## Motion architecture

One primary GSAP timeline maps native document scroll into a mutable progress object. The 3D rig reads it in `useFrame`, interpolating named virtual camera position/target and physical camera position/rotation/scale independently. Dedicated reveal animations handle the project-card stack and About portrait. Native scrolling remains available throughout.

The seven chapters move from the opening camera through Focus, rear-screen entry, the amber film roll, selected project cards, About, and Contact. The camera finishes in a centered side view above the contact links, with a thin looping photo strip below. CSS/GSAP media queries adapt framing and layouts for mobile. Reduced motion removes large scroll-driven movement. Pointer movement is a small offset on a nested group; it cannot overwrite the scroll pose.

Rendering uses demand mode, capped DPR 1.5, one 512px shadow map, a once-rendered 256px environment and no post-processing. The lens retains the GLB's original physical transmission, IOR and roughness; two front softboxes provide head-on reflections. Transmissive optics add a render pass and do not cast opaque shadows. The scene is lazy-loaded after the page shell. During the opaque About chapter it does not invalidate; hidden tabs stop rendering. R3F disposes mesh resources on unmount; custom geometries, materials and canvas textures have explicit disposal.

## Fallback and accessibility

Semantic content and links exist independently of WebGL. A failed context or 3D import retains every project and a typographic 35mm fallback. The native project dialog traps focus, supports Escape, filtering and restores focus. Controls have keyboard focus and project links explicitly label their destinations. The email copy action reports success only after clipboard confirmation; the email remains selectable if clipboard permission fails. No contact form suggests a message has been sent.

The camera is the user-supplied `sony-a7s-iii.glb`, extracted from the attached deliverables ZIP. Its source report is preserved in `reference/sony-asset-report.md`. The opening uses generated edge outlines of that same model, transitioning to its PBR materials on scroll. B612 Mono is bundled under the SIL Open Font License. Original portfolio imagery is retained for the portfolio owner's use.

## Verification limits

Production bundling and static content / lifecycle checks are documented in `VERIFICATION.md`. Automated visual capture is unavailable in this Open Design command interface; visual framing and touch behavior still need a rendered review and a real-device check. Photorealism is a target, not a claim of validated photographic accuracy. The supplied asset is a detailed procedural Sony approximation, as described by its author; it is not manufacturer CAD. `node scripts/verify-camera.mjs` checks projected opening bounds and sampled near-plane clearance.
