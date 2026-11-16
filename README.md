# Through the 35mm Lens

Ajinkya Khanapurkar’s portfolio, built with React 18, Vite, Three.js, React Three Fiber and GSAP. Includes the Pristine Forests, Growth Supercharge, Artist Studio and Chat PF case studies.

## Run locally

Use Node.js 22.12 or later (or a compatible Node.js 20.19+ release).

```sh
git clone https://github.com/ajinkyakhanapurkar19-png/AjinkyaKhanapurPorfolio.git
cd AjinkyaKhanapurPorfolio
npm ci --include=dev
npm run dev
```

Vite serves the source pages from `app/`. Dependencies are pinned in `package-lock.json`.

```sh
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static host. The build also creates root HTML previews and `bundles/` for Open Design. Generated files and dependencies are not committed.

## Pages and editable source

| Page | Source |
| --- | --- |
| `index.html` | `app/src/main.jsx`, `content.js`, `work-gallery.jsx` |
| `pristine-forests-case-study.html` | `app/src/pristine/` |
| `gsc-case-study.html` | `app/src/gsc/` |
| `artist-studio-case-study.html` | `app/src/artist-studio/` |
| `chat-pf-case-study.html` | `app/chat-pf-case-study.html` (standalone HTML, inline CSS and JavaScript) |

Only these five pages are built. Standalone reference pages and their unused components/assets have been removed. Shared case-study navigation, image viewing and styles live in `app/src/reference-case/`; `app/src/mount.jsx` provides their common page bootstrap.

## Assets

- `assets/`: imported camera model, portfolio photographs, résumé, fonts and the root preview’s case-study assets.
- `public/assets/`: editable path-based case-study screenshots, recordings and supporting evidence. These are copied into `dist/assets/` and merged into `assets/` when packaging the root preview. These copies are required for the two output locations.
- `app/assets`: relative symlink to `../assets` for source preview paths. Keep this symlink when copying the project.
- `licenses/` and font license files: attribution and model provenance.
- `assets/chat-pf/source-manifest.json`: Figma frame provenance. WebP files display the UI; the original PNG files serve the full-resolution download links.

To replace case-study visuals, edit the relevant `content.js`, `evidence.json` or media component. Keep screenshot aspect ratios and existing presentation dimensions. Project role, duration and outcomes must reflect supplied evidence.

Artist Studio opens the deployed Pristine Forests experience. The unused local gallery model and old recordings are not distributed with this portfolio. Gallery foundation attribution remains in the case-study footer; artwork is credited to Pankaj Saroj.

## Camera and motion

`scene.jsx` renders the supplied Sony camera model. `camera-path.js` defines the desktop journey; `mobile-camera.js` supplies the simplified mobile path. The desktop rotation, rear-screen entry, film reveal and final side view are preserved. `portfolio-mobile.css` and the case-study mobile styles isolate compact layouts.

Native scrolling drives the scene through a mutable GSAP progress value without React state updates every frame. Reduced motion and unavailable WebGL preserve readable content and working links. The scene is lazy-loaded, uses capped pixel ratios and stops unnecessary invalidation while hidden.

## Verification

After building:

```sh
node scripts/verify.mjs
node --experimental-vm-modules scripts/verify-preview.mjs
node scripts/verify-camera.mjs
node scripts/verify-work-gallery.mjs
node scripts/verify-mobile.mjs
```

These check content, local asset paths, preview module loading, camera geometry, responsive font metrics and gallery lifecycle hooks. They do not replace rendered visual review or real-device touch and performance testing.

## Cleanup

The November 2026 cleanup removed standalone Shotgun, Content Hub, VR and generic reference pages, unused template assets, obsolete project-stack code, historical snapshots and redundant uploads. The build regenerates `dist/`, `bundles/` and root HTML previews. Active source, current assets and attribution remain.
