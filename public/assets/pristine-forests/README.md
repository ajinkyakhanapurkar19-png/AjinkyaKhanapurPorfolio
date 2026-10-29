# Pristine Forests screenshot exports

Place genuine project exports here. Do not use Content Hub screens as Pristine Forests evidence.

Edit `app/src/pristine/content.js` to connect them:

```js
PF_DESKTOP_HOMEPAGE: {
  src: './assets/pristine-forests/homepage-desktop.webp',
  label: 'Desktop homepage',
  width: 1440,
  height: 900,
  note: 'Redesigned website · desktop'
}
```

Run `npm run build`. Vite copies this directory to `dist/assets/pristine-forests`; packaging copies it to `assets/pristine-forests` for the Open Design preview. Do not edit the generated copy.

- Keep `src: ''` for missing screenshots. Missing or broken paths display labelled placeholders.
- Existing website captures must be authentic. Do not reconstruct or infer the old UI.
- `width` and `height` reserve the presentation area. Long screenshots scroll inside the device frame; enlargement controls are intentionally removed.
- The mobile collection is in `app/src/pristine/mobile-screens.json`: 37 final-canvas designs grouped into six journeys. Original exports and presentation-only crop bounds are recorded in `reference/pristine/mobile-completion/`. The earlier navigation study remains available alongside these screens.
- The same screenshot can appear in the hero, responsive comparison, and final showcase through a single content record.
- Research-board screenshots need attribution. They are external references, not original designs.
- Role, duration, reflections, and outcomes are also in `app/src/pristine/content.js`.
- The page remains `noindex` until its evidence and personal details are completed.
