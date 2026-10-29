# Through the 35mm Lens

Ajinkya Khanapurkar’s portfolio, built with React 18, Vite, Three.js, React Three Fiber and GSAP. Includes the Pristine Forests, Growth Supercharge and Artist Studio case studies.

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
| `index.html` | `app/src/main.jsx`, `content.js`, `project-stack.jsx` |
| `pristine-forests-case-study.html` | `app/src/pristine/` |
| `gsc-case-study.html` | `app/src/gsc/` |
| `artist-studio-case-study.html` | `app/src/artist-studio/` |

The original reference templates remain available separately: `case-study.html`, `content-hub-case-study.html`, `vr-case-study.html`, and `shotgun-case-study.html`. Their original author names and claims are reference content, not Ajinkya’s project claims. They are marked `noindex`.

## Assets

- `assets/`: imported camera model, portfolio photographs, résumé, logos, fonts and template images.
- `public/assets/`: path-based case-study screenshots, recordings and supporting evidence. These are copied into the build and the root preview.
- `app/assets`: relative symlink to `../assets` for source preview paths. Keep this symlink when copying the project.
- `licenses/`, font license files and `reference/sony-asset-report.md`: attribution and model provenance.

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
node scripts/verify-project-stack.mjs
node scripts/verify-mobile.mjs
```

These check content, local asset paths, preview module loading, camera geometry, responsive font metrics and motion state calculations. They do not replace rendered visual review or real-device touch and performance testing.

## Cleanup

The October 2026 cleanup removed unused local gallery files, superseded source layouts, original recording uploads, session screenshots, old export scripts and design-session backups. The active source, current assets, original template components and licenses remain. A local recovery copy and checksummed removal manifest are kept outside Design Files; they are not part of this repository.
