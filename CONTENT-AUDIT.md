# Portfolio content audit — 23 October 2026

Sources: [Home](https://ajinkyakhanapurkar.framer.website/) and [About](https://ajinkyakhanapurkar.framer.website/about). Raw source snapshots are preserved in `reference/`. Images downloaded from the original Framer CDN into `assets/` for reuse in the owner's portfolio.

## Preserved
- Name, User Experience Designer / UX Designer / UI/UX designer role, storyteller introduction, both biography paragraphs.
- Human-Centered Approach, Problem-Solving Expertise, Research Driven Design and descriptions.
- Nyaya Saathi, Fumiha, Junction, Intent Search, CineJournal, TuDoom, STILL STILLNESS and the temporary-infrastructure research entry.
- Each distinct original work image, available category, description and destination; duplicated responsive records deduplicated.
- Email from the actual `mailto` href; LinkedIn, Behance and personal Instagram URLs.
- Photography interests and favorite films: Pather Panchali / Satyajit Ray, Fight Club / David Fincher, Dunkirk / Christopher Nolan.

## Source inconsistencies and explicit missing data
- The email's visible text omits the `r` in Khanapurkar. The actual mailto is `ajinkyakhanapurkar19@gmail.com`; this is the value used.
- Some responsive Junction / Intent Search images link to CineJournal and reuse the wrong descriptions. The unambiguous title-specific Behance URLs are used for Junction / Intent Search. CineJournal remains separate with a null category and description.
- The research-paper entry links to the photography case study. Its destination is set to null instead of silently retaining the wrong link. It appears in the complete work index with a clearly unavailable link.
- No resume URL or file was found on home or about. `profile.resume = null`; the interface honestly says `Resume · available on request` and links to the verified email, with an explicit resume-request subject.
- No tool list was found. `profile.tools = []`; no unverified software expertise was added.
- The source includes a Blog menu label but supplies no blog destination or posts; no invented blog page was added.
- CineJournal's category and description need confirmation. Its original case-study link and image are preserved.
- Home photograph variants incorrectly link to YouTube in one responsive branch; the explicit photography/Behance URL is retained.
- Project destination URLs are preserved from the source, not claimed to have authenticated access or availability. External platforms may restrict automated browsing.

## Editable data
`app/src/content.js` is the single content source. Set `resume`, `tools`, the CineJournal description/category and research-paper URL when ready. No client claims, metrics, testimonials, employer history or experience were invented.
