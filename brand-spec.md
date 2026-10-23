# Through the 35mm Lens

## Source extraction
- Interaction reference: https://lab.chakibmzn.com/35mm/
- Portfolio/content: https://ajinkyakhanapurkar.framer.website/ and /about
- Reference CSS downloaded to `reference/35mm-styles.css`. Extracted colors: white #fff, grey #9ca3af, transparent #0000. Font declarations: Inter and B612 Mono. Responsive thresholds: 640, 768, 1024px.
- Interaction-reference HTML describes camera components, film stock, and film-negative layers. No source code or model assets reused. Browser visual inspection was unavailable; movement and lighting are original interpretations of the user's requested architecture.

## Original system reconciled with the brief
The existing portfolio content is retained. Its presentation is replaced with the user's explicitly requested charcoal / black / silver / film-white direction. These are original tokens, not claimed to be an exact extraction of the reference.

```css
:root {
 --bg: oklch(17.5% 0.006 80);
 --surface: oklch(22% 0.007 80);
 --fg: oklch(93% 0.009 85);
 --muted: oklch(69% 0.012 85);
 --border: oklch(32% 0.008 85);
 --accent: oklch(76% 0.11 75);
 --font-display: 'Iowan Old Style', 'Charter', Georgia, serif;
 --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
 --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
}
```

## Layout posture
1. Editorial serif headings, clean sans body, mono camera metadata; display sizes use clamp.
2. A fixed 3D layer choreographed across five chapters; HTML content always remains usable independently.
3. Squared film frames, hairline divisions, no generic feature cards or heavy shadows.
4. Amber reserved for the opening context and primary work action; content imagery retains original color.
5. Desktop horizontal film strip; mobile and reduced motion use a vertical sequence. Native scroll, no scroll hijacking.

## Hero override — supplied screenshot, 23 October 2026
- Source: `mvkok0gk-Screenshot-2026-10-23-at-1.30.25-PM.png`.
- Near-black #131313 canvas, oversized B612 Mono bold name, fine neutral outlines, full-viewport corner marks, small lower-left introduction and focus scale.
- Hero-scoped OKLch tokens: bg 18.67% 0 0; surface 22% 0 0; fg 99% 0 0; muted 72% 0 0; border 36% 0 0; accent inherits 76% 0.11 75. Body and metadata retain the existing mono stack.
- B612 Mono is locally bundled from Google Fonts under the SIL OFL (`assets/fonts/B612-OFL.txt`).
- Use the user-supplied Sony A7S III GLB; outlines follow its actual geometry. Native scroll reveals its existing PBR materials. Keep camera transform separate from scene-camera transform.
- Preserve all five chapters, project content, links, and mobile vertical work sequence. The hero display font intentionally overrides the seed serif convention to match the supplied reference.

## Film-roll chapter — supplied references, 24 October 2026
- Sources: `mvlbrj35-Screenshot-2026-10-24-at-12.19.25-AM.png` and `mvlbrj3d-Screenshot-2026-10-24-at-12.19.13-AM.png`. Observed: near-black ground, amber spiral negative, quiet grey monospace copy, left narrative and lower-right ruled list.
- Extend the existing six neutral/amber CSS tokens; B612 Mono display, existing mono copy. Film amber is a physically lit material in `film-roll.jsx`, not an additional page accent.
- Layout 2 split + Layout 7 ruled list surround one continuous 3D helical film ribbon. Actual portfolio photographs supply negative-film texture; they are not represented as screenshots of the newly listed projects.
- User-approved disciplines: website, UI/UX, interaction, service, design systems, 3D generation and AI. The four selected project names come directly from the request; case-study destinations have not been supplied, so no links are invented.
- Screen entry hands off after LCD coverage. Desktop uses a short sticky stage; tablet/phone reflow and reduced motion use document flow. The existing project archive remains accessible.
- This supersedes the earlier horizontal project-strip posture. The hero and optical materials stay as previously implemented.

## Project stack — 24 October 2026
- Three supplied references establish overlapping photographic planes, sequential sideways separation, and caption connectors only after the final spread. Four planes represent the four user-named projects.
- Existing film photography is decorative film artwork, not project screenshots. No project destinations were supplied; the figures do not imply clickable case studies.
- Retain the six runtime tokens and B612 Mono. No changes to the camera material, hero, optical entry path, or the existing 3D roll.
- The shared primary journey samples the new CSS 3D planes. Desktop spreads into one row; phones spread into two rows. Reduced motion and short screens expose static figures and titles.

## Editorial typography and portrait arrival — 24 October 2026
- Sources: `mvld5jw8-image.png` (editorial type/layout reference) and `mvlcy457-Screenshot-2026-10-24-at-12.52.19-AM.png` (centered image composition).
- Observed: high-contrast narrow serif display, uppercase headings, small sans body columns, asymmetric image/text placement, square photography and quiet page labels. Bodoni Moda is a chosen visual match, not a verified identification of the reference font; bundled locally with its SIL OFL license.
- Palette retained: --bg oklch(17.5% 0.006 80); --surface oklch(22% 0.007 80); --fg oklch(93% 0.009 85); --muted oklch(69% 0.012 85); --border oklch(32% 0.008 85); --accent oklch(76% 0.11 75).
- Display: 'Bodoni Moda', Didot, 'Iowan Old Style', Georgia, serif. Body: existing system sans. Mono: existing stack for camera ticks, frame numbers and metadata only. Supersedes B612 display overrides throughout the page.
- Preserve all real biography, project names and links. About portrait grows in the center, travels to its existing left-column region, then reveals the editorial copy. Main scroll source controls this sequence; native-flow compact layout, static reduced-motion layout, and direct About navigation remain usable.

## Tall hero title — 24 October 2026
- Supersedes the Akira Expanded hero choice: user requested much taller lettering from the upper screen into the camera foreground.
- Local Six Caps regular, sourced from https://github.com/google/fonts/tree/main/ofl/sixcaps under SIL OFL; license retained in assets/fonts/Six-Caps-OFL.txt.
- One large condensed line on desktop, two lines on phones. The title remains on the existing background layer beneath the 3D camera; the camera path and other typography are unchanged.

## Hero corner alignment and short copy — 24 October 2026
- Anchor the hero introduction and right caption to the same horizontal inset as the navigation, with a shared lower baseline. Keep the scroll cue centered on desktop, right-aligned on tablet, and below the intro on phones.
- Short introductions, contact copy, capability summaries, archive summaries and film captions use natural word spacing and start alignment. Preserve justified edges only for the longer Focus, Work and About paragraphs.
- Runtime owner: `app/src/portfolio.css`; existing typography, camera layering and scroll motion remain intact.

## About closing statement — 24 October 2026
- Remove the Design Capabilities block and the entire favourite-films side column.
- Center “Chasing light. Collecting stories. Finding the extraordinary in the everyday.” and its eyebrow across the available content width. Retain the existing serif, colours and portrait reveal.
