import evidence from './evidence.json';
// Layout copy uses reference-content.json; project fields and image paths remain here.
// Add genuine project exports to public/assets/artist-studio, then set src below.
// Use ./assets/artist-studio/filename.webp. No gallery images are fabricated.
// The reserved dimensions stay stable; images are contained. Only the cover
// is cropped to fill its cinematic composition (set position to adjust it).
export const project = {
  "title": "Artist Studio",
  "eyebrow": "IMMERSIVE PORTFOLIO · ARTIST EXPERIENCE",
  "subtitle": "What if exploring an artist’s portfolio felt like stepping into their studio?",
  "description": "An immersive digital portfolio concept for artists, bringing artwork, creative identity and a sense of place together for Pristine Forests.",
  "role": "[MY ROLE]",
  "duration": "[PROJECT DURATION]",
  "tools": "Blender, Three.js, GLB, HTML, CSS, JavaScript",
  "deliverables": "Immersive portfolio experience, adapted gallery environment, artwork and artist-profile integration, connected collections",
  "liveUrl": "https://www.pristineforests.com/pages/artist-studio?gallery=artist-profile",
  "interactionStatus": "Artist Studio is deployed on the Pristine Forests website. The local source connects a guided gallery route, closer artwork views, an artist profile and the collection catalogue. User testing has not been documented.",
  "actualBehavior": "The local implementation follows a Wall 01–04 scroll route. Wall zoom and focused artist and artwork views support closer inspection; orbit and pan become available after the guided route. Painting selections connect to the catalogue. The linked build has not been newly runtime-tested.",
  "learning": "The strongest idea is the connection between the person, the work and the place. Spatial storytelling can give a portfolio atmosphere, but visitors still need clear ways to orient themselves and inspect individual works. The 3D-to-web process is part of that design responsibility: visual ambition must leave room for readable content, usable navigation and practical loading.",
  "limitations": "The deployed Artist Studio experience is linked below. User testing and mobile performance have not been verified. The source gallery model is approximately 66 MB, so loading and navigation need evaluation on real devices.",
  "nextSteps": "Future opportunities include more personal environments for each artist, richer stories around individual works, and simpler portfolio maintenance. These are possibilities for later development, not existing features. Testing orientation, artwork discovery and loading would help prioritise the next iteration."
};

const slot = (label, width, height, note) => ({src: '', label, width, height, note, position: '50% 50%'});
export const images = {
  AS_GALLERY_ENTRANCE_CAPTURE: slot("Gallery entrance with curved story walls, a central bench and Wall Zoom control", 2220, 1584, 'Supplied browser screenshot · 27 October 2026'),
  AS_ARTIST_PROFILE_CAPTURE: slot("Pankaj Saroj artist profile with portrait, biography and selected works", 2940, 1612, 'Supplied browser screenshot · 27 October 2026'),
  AS_COLLECTION_CAPTURE: slot("B&W Miniature Paintings collection index with artwork titles, medium and dimensions", 2940, 1850, 'Supplied browser screenshot · 27 October 2026'),
  AS_HERO_RENDER: slot('Step inside the artist’s world', 1920, 1080, 'Current gallery interior · immersive portfolio cover'),
  AS_CONCEPT_BOARD: slot('An idea of space', 1600, 1000, 'Actual early renders, sketches or attributed architectural references'),
  AS_ARTWORK_COMPOSITION: slot('The artwork and its setting', 1200, 1500, 'Gallery wall and artwork composition from the actual scene'),
};

export const chapters = [
  [
    "overview",
    "More than a portfolio"
  ],
  [
    "concept",
    "Making it personal"
  ],
  [
    "environment",
    "The studio as portfolio"
  ],
  [
    "production",
    "Space around the art"
  ],
  [
    "exploration",
    "The visitor’s journey"
  ],
  [
    "atmosphere",
    "The feeling of being there"
  ],
  [
    "learnings",
    "Bringing it to the browser"
  ],
  [
    "final-experience",
    "The experience today"
  ],
  [
    "reflection",
    "A portfolio becomes a place"
  ]
];



// Imported evidence keeps the reserved template dimensions.
for (const [key, value] of Object.entries(evidence)) Object.assign(images[key], value);
