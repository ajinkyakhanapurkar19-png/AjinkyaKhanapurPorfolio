## Lens glass repair — 24 October 2026

- Cause: the runtime changed the supplied optical material from transmission `1` to `0`, increased roughness from `.025` to `.09`, and added clearcoat. The supplied screenshot shows the resulting opaque pale-green lens.
- Removed that override. Original GLB transmission, IOR `1.48`, roughness `.025`, nonmetallic response, coating tint and clearcoat are preserved. Glass does not cast an opaque shadow into the lens cavity.
- Added two front studio reflection panels and raised the once-captured environment from 128 to 256px. Model geometry, poses, scroll timeline, typography and content remain intact. Physical transmission adds a render pass; DPR remains capped at 1.5 and rendering remains on demand. No device performance claim is made.
- `npm run build`, existing content/structure checks, packaged module-resolution checks and camera geometry checks passed.
- Actual Three.js GLTFLoader material inspection passed for the optical mesh: runtime cloning retains exported optical values and the shader reveal preserves the transmission shader. Texture decoding and GPU rendering were not exercised by this Node check.
- Strict UI audit: zero findings after explicitly declaring the existing automatic scrollbar width.
- P0 review: no changed content, navigation, responsive structure, focus handling, reduced-motion logic or token values. Five-dimensional source critique passed; rendered visual quality remains unverified.
- Visual limitation: installed Open Design wrapper has no screenshot/render action. No rendered comparison with Blender was performed; exact optical appearance and device performance still need visual confirmation.
- Technical reference consulted: https://threejs.org/docs/pages/MeshPhysicalMaterial.html

# Verification

## Missing camera repair — 23 October 2026
- Confirmed root cause in the desktop renderer log: `Failed to fetch dynamically imported module` requested `raw/scene-Ca0ErR49.js`, omitting `bundles/`. The preview host inlines local script tags, which changes the entry module's URL and breaks relative lazy imports and `import.meta.url` asset paths.
- Fixed `scripts/package-preview.mjs` to emit an inline bootstrap that imports the external entry using an absolute URL resolved from `document.baseURI`. Entry, lazy scene, GLB, and images now retain their real module directory. Development and deployment output remain supported; no camera poses, styling, or content changed.
- `npm run build`, `node --experimental-vm-modules scripts/verify-preview.mjs`, `node scripts/verify.mjs`, and `node scripts/verify-camera.mjs` passed. Regression executes the bootstrap for embedded preview, root hosting, and nested hosting, then validates 13 reachable module/asset URLs for each.
- Current packaged entry JS, lazy scene JS, and full GLB each return HTTP 200 from the project raw-file endpoint; both modules have JavaScript content types.
- Actual Three.js GLTFLoader parsed the supplied model and generated its merged outlines in Node (53 meshes; 90,272 outline vertices). Texture decoding and GPU rendering were not exercised by that Node check.
- Existing P0 checklist reviewed: repair preserves tokens, typography, accent budget, real content, section identifiers, responsive behavior, and scroll behavior. General static UI audit flagged a pre-existing missing `scrollbar-width` property; unrelated CSS was not changed for this loading repair.
- Rendered verification remains unavailable: the installed command interface has no screenshot action, and computer access to the Open Design app was not approved. No visual-success or GPU-render claim is made.

## Passed
- `npm run build`: Vite production bundle and packaged preview created successfully.
- `node scripts/verify.mjs`: all 8 unique project records, original local images, source destinations, explicit missing values, 5 labelled sections, bundle paths, CSS palette / reduced-motion structure and navigation lifecycle checks passed.
- `npm run dev -- --port 5173`: Vite starts successfully. HTTP requests to the page and an original project asset return successfully.
- React 18.3.1 / Fiber 8.18.0 / drei 9.122.0 peer dependencies checked against the package registry. Three 0.170.0 is compatible with these declared peer ranges. Node 26.4.0 satisfies Vite 8 requirements.
- The scene remains a separate lazy-loaded chunk. No network model or font requests, no runtime physics and no post-processing chain.

## P0 self-check (static)
- UI palette uses six OKLch tokens; no literal UI hex outside root. 3D physical materials use independent material values.
- All heading levels use the serif display stack.
- Hero accent budget: context label and primary CTA. Later chapters use neutral labels.
- No violet backgrounds, emoji icons, fabricated achievements, testimonials or metrics.
- No filler content; absent source details are null or clearly unavailable.
- Five top-level sections have unique `data-od-id` and `data-screen-label` values.
- Responsive single-column contracts at tablet/mobile widths. Mobile projects are vertical; no transformed desktop-width strip is retained.
- Font metrics were checked against the system Iowan Old Style font; compact hero type was reduced to fit the 360px contract.
- No scrollIntoView, scroll event hijacking, frame-by-frame React state updates, custom cursor or designer controls.
- Main timeline / pin trigger / media-query lifecycle, scene disposal and pointer/visibility handlers have cleanup paths.

## Limits
This environment's Open Design CLI does not expose a visual screenshot/render command. No browser-rendered or real-device pass was completed. The reference site's HTML/CSS was studied; its live 3D choreography was not visually validated. No frame-rate or photorealism result is claimed.

Review the camera framing, lens close-up, pin transitions and mobile touch behavior in the preview. Narrow-layout contracts were inspected statically at 360 / 390 / 430 / 600 / 768 / 820 / 1024 / 1366 / 1440 / 1920px. Rendering and hardware feel remain unverified.

Vite reports a size advisory for the lazy 3D chunk (about 238kB gzip); this is the Three.js/R3F/environment runtime, loaded after the HTML shell, not an uncompressed model. Original imagery totals approximately 916kB and project images use lazy loading.

## Supplied camera hero revision — 23 October 2026
- `npm run build` and `node scripts/verify.mjs`: pass. Vite asset imports now keep the supplied GLB, project images, and font reachable in both development and packaged preview. Inline CSS font URLs are rebased to `bundles/`.
- `node scripts/verify-camera.mjs`: pass. Uses all 137,959 GLB vertices; opening bounds checked at 360, 390, 430, 600, 768, 820, 1024, 1366, 1440 and 1920px widths. No near-plane collisions in sampled interpolated waypoints. This is geometric validation, not a rendered screenshot.
- Vite development server starts and serves the React entry, scene module, and exact 12,634,520-byte GLB successfully.
- Hero name uses locally licensed B612 Mono. Measured font advances put the desktop line at 94.5vw within its 95vw region; the mobile surname is 87.92vw within 90vw. Other chapter typography is unchanged.
- P0: tokenized palette, reference-authorized hero font override, one accent, no invented metrics, five section identifiers, meaningful links, separate mobile route, reduced motion, no scroll hijacking.
- Supplied material/texture data is retained. Optical transmission is replaced with a reflective coated-glass material to avoid an extra full-scene render pass. Geometry outlines are merged into one draw call.
- Earlier procedural SLR and hero are recoverable from `reference/portfolio-before-sony-hero.zip`.
- Visual limitation remains: the available Open Design command interface has no render/screenshot action. No browser-rendered comparison or device-performance claim is made. The 12.63 MB model remains a material network payload; it loads with the lazy scene.

## Rear-screen entry — 24 October 2026

- Removed the scrolling film gallery and its pin/controller. Existing project records remain accessible through the Work index; About and Contact remain downstream.
- Added a transparent native-scroll chapter: turn the supplied camera 180°, align with its actual rear LCD, then dolly until that surface covers the viewport. No page-wide black overlay. The screen itself settles to empty charcoal for the next instruction.
- `app/src/camera-path.js` holds named poses and the shared deterministic sampler. Final distance accounts for both viewport axes. Pointer offset reaches zero before screen alignment.
- Reduced motion uses a stable rear view without the zoom or long scroll chapter; WebGL fallback collapses the chapter and provides a working About link.
- `npm run build`, `node scripts/verify.mjs`, `node scripts/verify-camera.mjs`, and `node --experimental-vm-modules scripts/verify-preview.mjs` pass.
- GLB glass bounds independently match the screen target. Projected LCD coverage passes at 360, 390, 430, 600, 768, 820, 1024, 1366, 1440, 1920 and 2560px widths. Sampled desktop/phone/tablet poses have no near-plane collision.
- Source checklist and five-axis critique completed. No rendered capture: the installed wrapper does not expose rendering/screenshot commands. GPU appearance, scroll feel and real-device touch remain unverified.
- Source backup: `reference/before-screen-entry.zip`.

## Film-roll work chapter — 24 October 2026

- Production build and packaged preview rebuilt successfully. Dependencies unchanged.
- Existing static/content and packaged import checks pass, including nested hosting and the design preview. Six labelled chapters now resolve.
- Camera bounds/near-plane checks pass at 11 sizes; existing opening and LCD poses unchanged.
- New ribbon: 960 triangles; finite positions, normals and UVs; valid indices. Screen-to-work layout begins after LCD coverage within 0.3 viewport at nine tested dimensions.
- Premium static audit: no findings. Scoped P0 review passes: existing tokens, reference-approved mono display, one amber film visual, no fabricated metrics/URLs, labelled section, mobile reflow, no scrollIntoView.
- The film is in the existing on-demand WebGL scene; no second canvas, render loop or dependencies. Geometry/material/texture cleanup and reduced-motion handling are present. HTML/CSS film fallback preserves the content.
- Visual capture: the installed project wrapper exposes no screenshot command. No rendered screenshots or real-device interaction claims are made. Film lighting, texture appearance and motion pacing remain subject to preview review.
- Prior files backed up in reference/before-film-roll.zip.

## Supplied film photographs — 24 October 2026

- Replaced the roll imagery with the five supplied photos in attachment order; the same set powers the HTML fallback.
- Original uploads retained. Web copies total 264,586 bytes, with EXIF orientation applied and maximum dimension 1024px.
- Full-image fitting retains portrait and landscape compositions, with original colors and neutral mattes inside the existing amber border. Atlas proportions compensate for the curved ribbon UV scale.
- Five numbered frames repeat along the unchanged ribbon. Failed image loads retain their slot instead of shifting subsequent photos. Existing geometry, camera movement and scroll timing are unchanged.
- Production build, static/content checks, packaged import checks and all five packaged image references pass. Strict premium audit reports zero findings.
- Checklist: no content/link changes, no new dependencies, original photo order retained, no crops, existing responsive and reduced-motion paths preserved, resource cleanup retained.
- Rendered review unavailable: the installed project command interface has no screenshot action. Input photographs were visually inspected; the final WebGL appearance has not been visually verified.

## Project-card stack — 24 October 2026
- Added the Selected Projects chapter between The Roll and Behind the Lens. The prior section ends at the new chapter; about/contact labels now follow it. The camera remains hidden and on-demand during the cards.
- One photographic plate at the start; three further plates separate sequentially; names reveal in the final phase. Reveal all projects and Replay the reveal scroll to defined positions. All captions remain accessible to assistive technology.
- Normal motion: four-column desktop spread and two-column phone spread. Reduced motion, short desktop heights, and phones under 741px tall use static document flow. WebGL failure does not affect the CSS card section.
- Passed: npm run build; node scripts/verify.mjs; node --experimental-vm-modules scripts/verify-preview.mjs; node scripts/verify-camera.mjs; node scripts/verify-project-stack.mjs. The production build retains the existing large 3D chunk warning.
- New numerical tests cover ten sizes from 360px through 1920px: first-card visibility, four reveal beats, labels only after all four spread, final frame/caption bounds, non-overlap, continuity, and identical reverse traversal. These are layout calculations, not browser screenshots.
- Strict premium static audit: zero findings. Scoped P0 checklist passes: existing tokens and approved display type, no invented claims/links, local uncropped photography, labelled section, mobile layout, no scrollIntoView.
- Rendered review unavailable: the installed project wrapper has no screenshot action. No alternate browser was launched. The actual composited perspective and perceived pacing require preview review.
- Backup: reference/before-project-stack.zip.

## Earlier rear-screen rotation — 24 October 2026

- Starts at Focus + 0.12 viewport heights; removes the held close-up. Rear view follows after 0.5 viewport heights, then LCD alignment and entry.
- Screen-entry height: 220 → 130svh desktop; 190 → 130svh mobile. Reduced motion remains 100svh with stable poses.
- Passed production build, existing camera geometry, project-stack, static content and preview-import checks. Strict premium audit: zero findings.
- Evaluated the actual timing expressions across 10 viewport sizes, with full and reduced motion: stops stay ordered, rear view occurs before Focus ends, entry completes within its section.
- No rendered pacing verification: preview capture unavailable.

## Editorial About update — 24 October 2026
- Rebuilt the existing canonical `index.html`; source in `app/src/main.jsx`, `app/src/about-reveal.js`, and the existing CSS files.
- Local Bodoni Moda (SIL OFL) replaces display overrides; system sans body and mono camera metadata remain. Name widths checked with font metrics at 360/390/430/600/768/820/1024/1366/1440/1920px.
- Portrait arrival sampled from the existing journey: center growth, left-column placement, then copy. Desktop uses 85svh of extra travel; compact layouts stay in native flow. Reduced motion exposes the final state immediately.
- Build, content/token checks, preview imports/assets and existing project-stack regression pass. Preview check requires `node --experimental-vm-modules scripts/verify-preview.mjs` on Node 26.
- Mocked-DOM checks cover phase order, final transform, reverse scroll, refresh, hidden link focus, reduced motion and disposal at ten sizes. These do not establish actual browser layout or animation appearance.
- Rendered capture unavailable: configured preview wrapper offers no screenshot action. No browser capture or real-device touch review performed.
- Previous source snapshot: `reference/before-editorial-about.zip`.

## Paragraph blocks, capability columns and Akira hero — 2026-10-24
- Body copy uses justified alignment, including the final line, and automatic hyphenation. About prose uses equal-width columns on desktop.
- Capabilities now span three columns on desktop; phones use two columns and a full-width final item. Original content remains intact.
- Akira Expanded is bundled locally with the designer's personal-use terms. Actual OpenType character metrics confirm name fit at 360, 390, 430, 600, 768, 820, 1024, 1366, 1440 and 1920px.
- Production build, existing content/token checks, preview bootstrap resolution and exact font asset packaging pass.
- Source checklist and five-axis critique completed. Rendered review remains unavailable in the configured preview interface; paragraph spacing and browser-specific hyphenation have not been visually verified.

## Tall hero name — 24 October 2026
- Replaced hero-only Akira Expanded with local Six Caps regular (SIL OFL).
- Desktop title is 21.5vw, with 96px top inset; phones use two lines starting at 92px. Existing title z-index 0 remains below the 3D scene at z-index 1.
- Production build, existing static checks and packaged asset checks pass. Actual hmtx advances fit 360, 390, 430, 600, 768, 820, 1024, 1366, 1440 and 1920px widths.
- P0 source checklist and five-dimensional critique completed. Rendered overlap was not verified: configured wrapper provides no screenshot command.

## About closing cleanup — 24 October 2026
- Removed the capabilities block and complete films side column; centered the retained Chasing light statement and eyebrow. Cleared obsolete responsive constraints.
- Production build, packaged scene/asset paths and strict static audit pass. No rendered capture was performed for this markup/CSS-only adjustment.

### Focus alignment and contact side view — 2026-10-24

- Aligned Focus body and labels to the title edge. Closing CTA sits right of its title; support/email align left; social links center below the model. Removed contact separator.
- Reserved a responsive DOM region for the actual camera. Final pose is centered, side-on, pointer-stable and framed to that region through a projection offset. Reverse scrolling clears that offset outside the closing transition.
- Production build, existing source checks, preview module/GLB resolution, strict static audit and camera geometry checks passed. Actual GLB vertices fit the reserved closing region at 11 viewport sizes (360–2560 px) and three vertical offsets; all sampled journey poses clear the near plane.
- Source P0 checklist and five-axis critique completed. No browser-rendered review: the installed preview wrapper has no capture command. Motion feel, final text wrapping and lighting remain visually unverified.

### Closing film carousel — 24 October 2026
- Converted the closing strip to two equal-width photo groups with a 36-second linear transform loop; group width always covers the viewport to prevent an empty seam.
- Reduced total strip height to 110–154px and composited grayscale photos onto their own isolated amber background.
- Pause/play button supports keyboard and touch; fine-pointer hover, offscreen and hidden-tab pauses included. Reduced motion shows a static strip. Observer/listener cleanup verified in source.
- Scoped P0 review: unchanged content/links/camera path, local assets, no placeholders, local overflow clipping, accessible control, reduced-motion handling, production build and existing portfolio/packaged-preview checks passed.
- Five-axis critique: 4/5. Visual review unavailable because the configured preview wrapper exposes no capture action. No extra browser launched.
