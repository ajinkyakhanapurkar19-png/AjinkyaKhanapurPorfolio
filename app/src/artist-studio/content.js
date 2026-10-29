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
  AS_EXTERIOR_RENDER: slot('Architecture meets landscape', 1920, 1080, 'Brutalist exterior, green trees and natural surroundings'),
  AS_INTERIOR_RENDER: slot('A quieter space for art', 1440, 1200, 'Off-white walls, artwork and the interior gallery atmosphere'),
  AS_ARTWORK_COMPOSITION: slot('The artwork and its setting', 1200, 1500, 'Gallery wall and artwork composition from the actual scene'),
  AS_SCENE_LAYOUT: slot('The space as a whole', 1600, 1000, 'Actual architectural layout or scene-organisation exploration'),
  AS_BLENDER_VIEWPORT: slot('Inside the Blender scene', 1600, 1000, 'Missing evidence: add a screenshot of the actual Blender working scene'),
  AS_MATERIAL_STUDIES: slot('Surface, texture, reflection', 1600, 1000, 'Real material and export comparison images'),
  AS_EXPORT_BREAKDOWN: slot('Preparing the scene for the web', 1600, 900, 'Actual GLB export, asset breakdown or browser comparison'),
  AS_LIGHTING_STUDIES: slot('Following the light', 1920, 1080, 'Golden-hour lighting studies from the existing gallery'),
  AS_ATMOSPHERE_INTERIOR: slot('Light across the gallery walls', 1600, 1200, 'Interior light, wall material and artwork detail'),
  AS_CAMERA_INTERACTION: slot('The gallery’s camera controls', 1600, 900, 'Actual website screenshot showing the final controls'),
  AS_ENTRANCE_VIEWPOINT: slot('Gallery entrance', 1600, 900, 'Entrance viewpoint · actual scene still'),
  AS_OPPOSITE_WALL_VIEWPOINT: slot('Opposite wall', 1600, 900, 'Opposite-wall viewpoint · actual scene still'),
  AS_ARTWORK_ROOM_VIEWPOINT: slot('Artwork room', 1600, 900, 'Artwork-room viewpoint · actual scene still'),
  AS_FINAL_GALLERY: slot('Inside Artist Studio', 1920, 1080, 'Final cinematic gallery render'),
  AS_FINAL_EXTERIOR: slot('Outside / the approach', 1920, 1080, 'Completed gallery exterior'),
  AS_FINAL_INTERIOR: slot('Inside / the experience', 1920, 1080, 'Completed gallery interior'),
  AS_ARTWORK_ROOM: slot('The room around the artwork', 1920, 1080, 'Final artwork-room composition'),
  AS_WEBSITE_SCREENSHOT: slot('The interactive website', 1600, 1000, 'Real browser capture with the implemented interface'),
  AS_BROWSER_COMPARISON: slot('The exported browser scene', 1600, 1000, 'Same viewpoint as the Blender capture, for a fair comparison'),
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

export const viewpoints = [
  {id: 'entrance', label: 'Gallery entrance', image: 'AS_ENTRANCE_VIEWPOINT', copy: 'The first view introduces the architecture, its scale and the threshold into the gallery.'},
  {id: 'opposite-wall', label: 'Opposite wall', image: 'AS_OPPOSITE_WALL_VIEWPOINT', copy: 'A view across the space considers the relationship between the gallery walls, light and the route through the room.'},
  {id: 'artwork-room', label: 'Artwork room', image: 'AS_ARTWORK_ROOM_VIEWPOINT', copy: 'The viewpoint brings the artwork into focus while retaining enough architectural context to understand its setting.'},
];

// Imported evidence keeps the reserved template dimensions.
for (const [key, value] of Object.entries(evidence)) Object.assign(images[key], value);
