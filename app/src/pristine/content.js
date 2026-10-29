import mobileCollection from './mobile-screens.json';
import existingDesktopUi from '../../../assets/pristine-forests/figma/earlier-desktop-full.png';
import existingMobileUi from '../../../assets/pristine-forests/figma/earlier-mobile-home.webp';
// Editorial page: Page.jsx. Project details and evidence slots remain here.
// Pristine Forests case-study content. Edit project details and image paths here.
// Place exports in public/assets/pristine-forests/, then set src to
// './assets/pristine-forests/your-file.webp'. Rebuild with npm run build.
// Genuine Figma exports are mapped below; undocumented research remains empty.
export const project = {
  liveUrl: 'https://www.pristineforests.com/',
  name: 'Pristine Forests',
  eyebrow: 'WEBSITE REDESIGN · E-COMMERCE · UX/UI',
  subtitle: 'Redesigning a digital experience where nature, product discovery, and premium e-commerce meet.',
  description: 'A website redesign exploring how a more considered visual language, clearer content hierarchy, and refined shopping experience can bring the Pristine Forests brand to life digitally.',
  role: 'UI & UX Designer',
  duration: '2 months',
  scope: 'Website audit, UX/UI design, responsive design, visual direction',
  platform: 'E-commerce website',
  reflection: 'Designing desktop and mobile together helped me give the website a consistent visual language. The typography, botanical palette and product imagery connect the brand story with the shopping experience, while the layouts give product details room to breathe on each screen.',
  improvements: 'I would next test the journey from the menu to checkout with users, especially on mobile. Those sessions would help me refine product discovery and purchase decisions. I would also review contrast, text sizes and touch targets across the key screens.',
  outcomes: 'The redesign includes desktop and mobile interfaces, with screens covering the homepage, product listings, product details, articles, cart and checkout. The Figma designs and earlier-site comparisons document the work; user-testing results and business impact are not documented.',
};

// Unfilled slots reserve their original dimensions. Populated records use the
// delivered export dimensions; device mockups scroll the full image natively.
const slot = (label, width, height, note) => ({ src: '', label, width, height, note });
export const images = {
  PF_DESKTOP_HOMEPAGE: slot('Desktop homepage', 1440, 900, 'Redesigned website · desktop'),
  PF_MOBILE_HOMEPAGE: slot('Mobile homepage', 390, 844, 'Redesigned website · mobile'),
  PF_EXISTING_WEBSITE_AUDIT: slot('Existing website audit', 1440, 900, 'Original screenshots with observed design opportunities'),
  PF_MOBILE_AUDIT_BEFORE: slot('Existing mobile experience', 390, 844, 'Original website capture · before redesign'),
  PF_MOBILE_AUDIT_AFTER: slot('Redesigned mobile experience', 390, 844, 'Corresponding redesigned screen'),
  PF_AUDIT_ANNOTATIONS: slot('Audit observations', 1200, 800, 'Actual annotated screenshots or audit board'),
  // This board is rendered by ResearchBoard.jsx. Edit its five screenshot
  // sources and captions in research-references.js; no single-image slot needed.
  PF_VISUAL_RESEARCH_BOARD: slot('Visual research board', 1440, 900, 'Rendered from research-references.js'),
  PF_DESIGN_PROCESS_BOARD: slot('Design process artifacts', 1440, 800, 'Add only existing structure, wireframes or interface iterations'),
  PF_DESKTOP_PRODUCT_LISTING: slot('Desktop product listing', 1440, 1000, 'Redesigned product discovery · desktop'),
  PF_MOBILE_PRODUCT_LISTING: slot('Mobile product listing', 390, 844, 'Redesigned product discovery · mobile'),
  PF_PRODUCT_DETAIL_DESKTOP: slot('Desktop product detail', 1440, 1000, 'Product information and purchase journey · desktop'),
  PF_PRODUCT_DETAIL_MOBILE: slot('Mobile product detail', 390, 844, 'Product information and purchase journey · mobile'),
  PF_PRODUCT_CARD_DETAIL: slot('Product card close-up', 1000, 800, 'Actual card design with supporting annotations'),
  PF_PRODUCT_INFORMATION_DETAIL: slot('Product information close-up', 1000, 800, 'Actual product-detail layout with supporting annotations'),
  PF_DESKTOP_HOMEPAGE_FULL: slot('Full desktop homepage', 1440, 1800, 'Complete desktop design · uncropped export'),
  PF_MOBILE_NAVIGATION: slot('Mobile navigation', 390, 844, 'Responsive navigation · where available'),
  PF_ADDITIONAL_REDESIGNED_PAGES: slot('Additional redesigned pages', 1440, 900, 'Only pages that exist in the redesign'),
};

// Verified exports from the supplied canvas. Earlier-site captures stay in
// audit slots; current screens populate the responsive showcases.
const figmaEvidence = {
  "PF_DESKTOP_HOMEPAGE": {
    "src": "./assets/pristine-forests/figma/desktop-home.webp",
    "label": "Redesigned desktop homepage",
    "width": 1512,
    "height": 6982,
    "sourceNode": "1115:4442",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-4442"
  },
  "PF_MOBILE_HOMEPAGE": {
    "src": "./assets/pristine-forests/figma/mobile-home.webp",
    "label": "Redesigned mobile homepage",
    "width": 340,
    "height": 4096,
    "sourceNode": "1115:2407",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-2407"
  },
  "PF_EXISTING_WEBSITE_AUDIT": {
    "src": existingDesktopUi,
    "loading": "eager",
    "label": "Existing website — Essential Oils desktop page",
    "width": 1515,
    "height": 4096,
    "sourceNode": "3496:1877",
    "stage": "before",
    "caption": "Earlier website imported into the supplied Figma file on 15 June 2026.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=3496-1877"
  },
  "PF_MOBILE_AUDIT_BEFORE": {
    "src": existingMobileUi,
    "loading": "eager",
    "label": "Existing website — Essential Oils mobile page",
    "width": 590,
    "height": 4096,
    "sourceNode": "3496:2356",
    "stage": "before",
    "caption": "Earlier website imported into the supplied Figma file on 15 June 2026.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=3496-2356"
  },
  "PF_MOBILE_AUDIT_AFTER": {
    "src": "./assets/pristine-forests/figma/mobile-home.webp",
    "label": "Redesigned mobile homepage",
    "width": 340,
    "height": 4096,
    "sourceNode": "1115:2407",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-2407"
  },
  "PF_DESKTOP_PRODUCT_LISTING": {
    "src": "./assets/pristine-forests/figma/desktop-body-oils.webp",
    "label": "After-Shower Body Oils — desktop listing",
    "width": 1512,
    "height": 3508,
    "sourceNode": "3019:2868",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=3019-2868"
  },
  "PF_MOBILE_PRODUCT_LISTING": {
    "src": "./assets/pristine-forests/figma/mobile-body-oils.webp",
    "label": "After-Shower Body Oils — mobile listing",
    "width": 390,
    "height": 2127,
    "sourceNode": "1115:2778",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-2778"
  },
  "PF_PRODUCT_DETAIL_DESKTOP": {
    "src": "./assets/pristine-forests/figma/desktop-candy-glaze-v2.webp",
    "label": "Candy Glaze — desktop product page",
    "width": 1066,
    "height": 4096,
    "sourceNode": "1115:5586",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-5586"
  },
  "PF_PRODUCT_DETAIL_MOBILE": {
    "src": "./assets/pristine-forests/figma/mobile-candy-glaze-v2.webp",
    "label": "Candy Glaze — mobile product page",
    "width": 317,
    "height": 4096,
    "sourceNode": "1115:7050",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-7050"
  },
  "PF_PRODUCT_CARD_DETAIL": {
    "src": "./assets/pristine-forests/figma/desktop-product-cards.webp",
    "label": "Product cards — name, scent description and price",
    "width": 1464,
    "height": 568,
    "sourceNode": "1115:4447",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-4447"
  },
  "PF_PRODUCT_INFORMATION_DETAIL": {
    "src": "./assets/pristine-forests/figma/product-information.webp",
    "label": "Candy Glaze — product information and purchase controls",
    "width": 625,
    "height": 935,
    "sourceNode": "1115:5618",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-5618"
  },
  "PF_DESKTOP_HOMEPAGE_FULL": {
    "src": "./assets/pristine-forests/figma/desktop-home.webp",
    "label": "Full redesigned desktop homepage",
    "width": 1512,
    "height": 6982,
    "sourceNode": "1115:4442",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-4442"
  },
  "PF_MOBILE_NAVIGATION": {
    "src": "./assets/pristine-forests/figma/navigation-study.webp",
    "label": "Mobile category navigation study",
    "width": 312,
    "height": 796,
    "sourceNode": "3:741",
    "stage": "navigation-study",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=3-741"
  },
  "PF_ADDITIONAL_REDESIGNED_PAGES": {
    "src": "./assets/pristine-forests/figma/desktop-right-by-you.webp",
    "label": "Right by You — desktop page",
    "width": 1512,
    "height": 3532,
    "sourceNode": "1115:6237",
    "stage": "redesign",
    "caption": "Exported from the supplied Pristine Forests Figma file.",
    "sourceUrl": "https://www.figma.com/design/PtcjagsXzlGFsFkCV4H6GL/Pristine-Forests?node-id=1115-6237"
  }
};
Object.entries(figmaEvidence).forEach(([name, evidence]) => Object.assign(images[name], evidence));

// Presentation-only trims in source pixels. Original exports remain in the
// reference folder; no page content is stretched or painted over.
images.PF_MOBILE_HOMEPAGE.trim = {top:15};
images.PF_MOBILE_AUDIT_AFTER.trim = {top:15};
images.PF_MOBILE_AUDIT_BEFORE.trim = {top:118};
// Source-pixel bounds of the sort row, six product cards and pagination.
// Center this band for presentation without modifying the original export.
images.PF_MOBILE_AUDIT_BEFORE.centeredProductArea = {top:934, bottom:2110, left:235, right:565};
images.PF_PRODUCT_DETAIL_MOBILE.trim = {top:40};
// Remove only the blank export margin. Preserve the full original capture,
// including its source artefacts, for scrolling inside the browser frame.
images.PF_EXISTING_WEBSITE_AUDIT.trim = {top:94};

// Complete mobile collection; the final-canvas exports retain source IDs and
// documented crops in mobile-screens.json. Existing primary slots use the same
// delivery copies so the hero, comparisons and mobile gallery remain in sync.
Object.assign(images, mobileCollection.screens);
images.PF_MOBILE_HOMEPAGE = {...images.PF_MOBILE_HOME};
images.PF_MOBILE_AUDIT_AFTER = {...images.PF_MOBILE_HOME};
images.PF_MOBILE_PRODUCT_LISTING = {...images.PF_MOBILE_BODY_OILS_LISTING};
images.PF_PRODUCT_DETAIL_MOBILE = {...images.PF_MOBILE_CANDY_GLAZE};
// Curated showcase; retain the full export inventory above for future edits.
export const mobileScreens = [
  {name:'PF_MOBILE_NAVIGATION', label:'Menu'},
  {name:'PF_MOBILE_HOME', label:'Home'},
  {name:'PF_MOBILE_BODY_OILS_LISTING', label:'PLP · Product listing'},
  {name:'PF_MOBILE_CANDY_GLAZE', label:'PDP · Product detail'},
  {name:'PF_MOBILE_ARTICLE', label:'Article'},
  {name:'PF_MOBILE_CART_GUEST', label:'Cart'},
  {name:'PF_MOBILE_CHECKOUT_GUEST', label:'Checkout'},
];

export const chapters = [
  ['overview', 'Overview'], ['challenge', 'The challenge'], ['audit', 'The website audit'],
  ['visual-research', 'Visual research'], ['designing', 'Designing the experience'],
  ['responsive', 'Desktop meets mobile'], ['discovery', 'Product discovery'],
  ['final-website', 'The mobile experience'], ['reflection', 'Reflection'],
];
