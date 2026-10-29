import evidence from './evidence.json';
// Layout copy uses reference-content.json; project fields and image paths remain here.
// Edit project details and visual evidence here. No project outcomes are inferred.
// Add genuine exports to public/assets/gsc/ and set src to './assets/gsc/file.webp'.
// npm run build copies these assets into the root preview as well as dist/.
export const project = {
  liveUrl: 'https://www.growthsupercharged.com/index.html',
  name: 'Growth Supercharge',
  eyebrow: 'WEBSITE DESIGN · STRATEGY · UX/UI',
  subtitle: 'Structuring a consultancy website around clarity, positioning, and growth.',
  description: 'Designing the consultancy website across growth strategy, business intelligence, pricing intelligence, performance marketing, customer experience, product analytics, AI and automation, and revenue operations.',
  role: 'UI & UX Designer',
  duration: '15 days',
  scope: 'Competitor research, information architecture, wireframes, UI design',
  deliverables: 'Responsive consultancy homepage, Services, About Us and Contact pages; service artwork and shared navigation',
  reflection: '[MY REFLECTION]',
  improvements: '[FUTURE IMPROVEMENTS]',
  outcomes: '[DOCUMENTED EVIDENCE, IF AVAILABLE]',
};

// width/height reserve a presentation area. Images fit without cropping;
// use the lightbox to inspect the complete export at its original resolution.
const slot = (label, width, height, note) => ({src: '', label, width, height, note});
export const images = {
  GSC_HOMEPAGE_DESKTOP: slot('The GSC homepage', 1440, 820, 'Final desktop hero · website screenshot'),
  GSC_INITIAL_DESIGN: slot('Where the design began', 1440, 760, 'Existing website or early design · annotated screenshot'),
  GSC_COMPETITOR_RESEARCH: slot('The consultancy landscape', 1440, 820, 'Real reference screenshots · names, sources and observations'),
  GSC_SITEMAP: slot('The website structure', 1440, 780, 'Actual sitemap or page hierarchy · project artifact'),
  GSC_WIREFRAMES: slot('Structure before detail', 1200, 1000, 'Actual wireframes · page layouts and content hierarchy'),
  GSC_HERO_ITERATIONS: slot('Exploring the first impression', 900, 1050, 'Existing hero iterations · chronological design exploration'),
  GSC_SERVICE_SECTIONS: slot('The service experience', 1440, 900, 'Final service sections and page layouts'),
  GSC_NAVIGATION_DETAIL: slot('Finding the right service', 1100, 760, 'Actual navigation screenshot · detail crop'),
  GSC_SERVICE_CARD_DETAIL: slot('Explaining the offer', 1100, 760, 'Actual service card or content layout · detail crop'),
  GSC_FINAL_WEBSITE: slot('A clearer digital presence', 1440, 1500, 'Full desktop homepage · final implementation'),
  GSC_SERVICE_PAGE: slot('Beyond the homepage', 1440, 1000, 'Strongest supporting service page · final implementation'),
  GSC_MOBILE_SCREENS: slot('The experience on mobile', 390, 844, 'Responsive mobile screen · if available'),
};

export const chapters = [
  ['overview', 'Overview'], ['challenge', 'The challenge'], ['research', 'Competitor research'],
  ['architecture', 'Information architecture'], ['exploration', 'Wireframes & direction'],
  ['services', 'The service experience'], ['final-website', 'The final website'], ['reflection', 'Reflection'],
];

// These are current website observations, not historical project findings or
// evidence that these patterns were adopted by GSC. Reviewed 27 October 2026.
export const references = [
  {name: 'The Growth Consultancy', url: '', context: 'Reference named in the project brief',
    observation: 'The exact website and original research notes are still to be confirmed.',
    implication: 'Review the opening proposition, service grouping, navigation and credibility cues once the source is confirmed.'},
  {name: 'Kanvic', url: 'https://kanvic.com/', context: 'Current website observation',
    observation: 'Services, industries and insights form separate navigation groups. Its homepage introduces strategy, digital, transformation, and marketing and sales, followed by insights and a case study.',
    implication: 'Explore how GSC could distinguish what it offers from the supporting evidence, without giving every detail equal prominence.'},
  {name: 'xto10x', url: 'https://www.xto10x.com/', context: 'Current website observation',
    observation: 'A direct scaling proposition leads into named areas of support. Customer stories and resources sit alongside the explanation of its offering.',
    implication: 'Explore how a concise opening and recognisable service labels could help visitors orient themselves before reading in depth.'},
];

// Imported evidence keeps the reserved template dimensions.
for (const [key, value] of Object.entries(evidence)) Object.assign(images[key], value);
