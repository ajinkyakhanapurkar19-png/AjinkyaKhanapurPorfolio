import {rollPhotos} from './roll-photos.js';
const local = name => `./assets/roll-gallery/${name}.webp`;
const pf = name => `./assets/pristine-forests/${name}.webp`;
const chat = name => `./assets/chat-pf/${name}.webp`;
const phone = (src, alt, long = false) => ({src, alt, kind:'phone', long});
const browser = (src, alt) => ({src, alt, kind:'browser'});
const art = (src, alt) => ({src, alt, kind:'art'});
const tablet = (src, alt) => ({src, alt, kind:'tablet'});

export const workProjects = [
 {id:'pristine', title:'Pristine Forests', subtitle:'Website redesign',
  description:'An editorial shopping experience, from discovering a daily ritual to finding the right product.',
  disciplines:'Website design / UI & UX', year:'—', href:'./pristine-forests-case-study.html',
  frames:[
   {label:'The storefront', layout:'tablet', media:[tablet(local('pristine-home'),'Pristine Forests redesigned desktop homepage')]},
   {label:'Product discovery', layout:'desktop', media:[browser(local('pristine-oils'),'Pristine Forests After-Shower Body Oils product listing')]},
   {label:'A mobile ritual', layout:'phones', media:[phone(pf('figma/mobile-body-oils'),'Body Oils mobile product listing',true),phone(pf('figma/mobile-candy-glaze-v2'),'Candy Glaze mobile product details',true)]}
  ]},
 {id:'gsc', title:'Growth Supercharge', subtitle:'Website system',
  description:'A connected website system that brings clarity to growth strategy, services and business intelligence.',
  disciplines:'Information architecture / Website design', year:'—', href:'./gsc-case-study.html',
  frames:[
   {label:'The bigger picture', layout:'tablet', media:[tablet(local('gsc-solutions'),'GSC Growth Solutions website hero')]},
   {label:'Connected growth systems', layout:'desktop', media:[browser(local('gsc-systems'),'GSC cohesive structures and operational architecture website section')]},
   {label:'Designed across screens', layout:'phones', media:[phone('./assets/gsc/screenshots/about-mobile.png','GSC About Us mobile website'),phone('./assets/gsc/screenshots/product-analytics-mobile.png','GSC Product Analytics mobile website')]}
  ]},
 {id:'artist', title:'3D Artist Studio', subtitle:'An immersive gallery',
  description:'An artist’s portfolio becomes a place to explore. Architecture, artwork and movement shape the experience.',
  disciplines:'Interaction design / 3D / Web experience', year:'—', href:'./artist-studio-case-study.html',
  frames:[
   {label:'Inside the studio', layout:'tablet', media:[tablet(local('artist-hero'),'Artist Studio curved gallery, paintings and reflective floor')]},
   {label:'A sense of place', layout:'art', media:[art(local('artist-entrance'),'Artist Studio entrance and story walls')]},
   {label:'The work, in its setting', layout:'art', media:[art(local('artist-artwork'),'Original Artist Studio artwork composition')]}
  ]},
 {id:'office', title:'Office OS / Chat PF', subtitle:'A connected mobile workspace',
  description:'Bringing conversations, focused work and internal tools into one considered mobile experience.',
  disciplines:'Mobile UI / UX / Interaction design', year:'—', href:'./chat-pf-case-study.html',
  frames:[
   {label:'Conversations in context', layout:'phones', media:[phone(chat('home'),'Original Chat PF conversation list from Figma'),phone(chat('channel'),'Original Chat PF Design channel from Figma')]},
   {label:'Making room for focus', layout:'phones', media:[phone(chat('focus-setup'),'Chat PF Focus Mode setup'),phone(chat('focus-active'),'Chat PF active focus session')]},
   {label:'Beyond the conversation', layout:'phones', media:[phone(chat('content-hub'),'Chat PF Content Hub integration'),phone(chat('erp'),'Chat PF ERP integration')]}
  ]}
];

// A single mixed roll: personal photography punctuated by real project work.
const photoDescriptions = [
 'Black-and-white street photograph of a crowded train',
 'Bottle study against a dark background',
 'White sculptural still life with yellow flowers',
 'Green perfume bottle in light and shadow',
 'A child looking out through a train window'
];
// Original dimensions reserve the image area and keep the paper frame fitted.
const photoDimensions = [[633,1024],[683,1024],[1024,683],[683,1024],[1024,576]];
export const galleryFrames = rollPhotos.flatMap((photo,i)=>[
 {id:`photo-${photo.label}`,layout:'photograph',media:[{src:photo.src,alt:photoDescriptions[i],kind:'photograph',width:photoDimensions[i][0],height:photoDimensions[i][1]}]},
 ...(workProjects[i]?[{...workProjects[i].frames[0],id:workProjects[i].id,href:workProjects[i].href,title:workProjects[i].title}]:[])
]);
