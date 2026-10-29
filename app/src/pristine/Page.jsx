import React, {useEffect, useRef, useState} from 'react';
import {ReferenceCase, Chapter, Evidence} from '../reference-case/ReferenceCase.jsx';
import {project, images, chapters, mobileScreens} from './content.js';
import ResearchBoard from './ResearchBoard.jsx';
import Showreel from './Showreel.jsx';
import './pristine.css';
import {PortfolioBackLink, NextProject, LiveWebsiteLink} from '../reference-case/ProjectNavigation.jsx';
import '../reference-case/case-mobile.css';
import './mobile.css';

// Keep the shared navigation and reading progress.
function Jump({id, children, className = ''}) {
 return <a href={`#${id}`} className={className} onClick={event => {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  window.scrollTo({top:target.getBoundingClientRect().top + window.scrollY - 80,
   behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  target.focus({preventScroll:true}); history.replaceState(null, '', `#${id}`);
 }}>{children}</a>;
}
function Media({name, ratio}) {
 const asset = images[name];
 const {top = 0, bottom = 0} = asset.trim || {};
 const centered = asset.centeredProductArea;
 // Reframe only the product band. Keep the original capture and every other
 // part of the screen intact; all measurements scale with the phone width.
 const evidenceImages = centered ? {...images, [name]: {...asset, render: () => {
  const visibleHeight = asset.height - top - bottom;
  const bandWidth = centered.right - centered.left;
  return <div className="pf-centered-capture" role="img" aria-label={`${asset.label}; product cards centered for presentation`}>
   <img src={asset.src} alt="" aria-hidden="true" width={asset.width} height={asset.height} loading="eager" style={{marginTop:`${-100 * top / asset.width}%`}}/>
   <div className="pf-centered-product-band" style={{top:`${100 * (centered.top - top) / visibleHeight}%`,height:`${100 * (centered.bottom - centered.top) / visibleHeight}%`}}>
    <div className="pf-centered-product-window" style={{width:`${100 * bandWidth / asset.width}%`}}>
     <img src={asset.src} alt="" aria-hidden="true" width={asset.width} height={asset.height} loading="eager" style={{width:`${100 * asset.width / bandWidth}%`,marginLeft:`${-100 * centered.left / bandWidth}%`,marginTop:`${-100 * centered.top / bandWidth}%`}}/>
    </div>
   </div>
  </div>;
 }}} : images;
 // Trim only documented export margins; preserve source pixels and proportions.
 const presentationRatio = asset.src ? `${asset.width}/${asset.height - top - bottom}` : ratio;
 return <div className={`pf-media ${asset.src ? 'pf-media-populated' : 'pf-media-pending'} ${asset.stage === 'before' ? 'pf-media-original' : ''}`} style={{'--image-trim-top':`${-100 * top / asset.width}%`, '--image-trim-bottom':`${-100 * bottom / asset.width}%`}}>
  <Evidence name={name} images={evidenceImages} ratio={presentationRatio} enlarge={false}/>
 </div>;
}
function Visual({name, caption, className = '', ratio}) {
 return <figure className={`pf-visual ${className}`}><Media name={name} ratio={ratio}/>{caption && <figcaption>{caption}</figcaption>}</figure>;
}
function Device({name, kind = 'browser', label, className = '', full = false, screenRatio}) {
 const available = Boolean(images[name].src);
 return <div className={`pf-device pf-${kind} ${className}`}>
  <div className="pf-device-shell">
  {kind === 'browser' && <div className="pf-browser-bar"><span className="pf-browser-dots" aria-hidden="true"><i/><i/><i/></span><span>{label || images[name].label}</span><span aria-hidden="true">↗</span></div>}
  {kind === 'phone' && <div className="pf-phone-top" aria-hidden="true"><span className="pf-phone-speaker"/></div>}
  {available ? <div key={name} className="pf-device-viewport" style={{'--screen-ratio':screenRatio || (kind==='phone'?'390 / 820':full?'4 / 5':'16 / 10')}} tabIndex={0} role="region" aria-label={`${images[name].label} — scroll to view the full design`}><Media name={name}/></div> : <Media name={name}/>}
  {kind === 'laptop' && <div className="pf-laptop-base" aria-hidden="true"/>}
  </div>
 </div>;
}
function Header({number, title, next}) {
 return <header className="pf-chapter-head"><h2>{title}<sup>({number})</sup></h2>{next && <Jump id={next} className="pf-next"><span className="visually-hidden">Continue to {chapters.find(c=>c[0]===next)?.[1]}</span><span aria-hidden="true">↓</span></Jump>}</header>;
}
function Intro({label, children, className = ''}) {
 return <div className={`pf-editorial-row ${className}`}><p className="pf-label">{label}</p><div className="pf-copy">{children}</div></div>;
}
// The bottle regions come from the existing Figma export. Their shared image
// stage preserves proportions; all names, descriptions and prices follow it.
const products = [
 {name:'Candy Glaze', category:'Body oil', x:0},
 {name:'Above Treelines', category:'Face mist', x:294},
 {name:'Golden Glow', category:'Face mist', x:588},
 {name:'Lemongrass', category:'Essential oil', x:882},
 {name:'Half Past Summer', category:'Body oil', x:1176},
];
function ProductCarousel({id, compact = false}) {
 const track = useRef(null);
 const [range, setRange] = useState({start:1, end:compact ? 2 : 4, first:true, last:false});
 const [failed, setFailed] = useState(false);
 const source = images.PF_PRODUCT_CARD_DETAIL;
 useEffect(() => {
  const rail = track.current;
  let frame = 0;
  const update = () => {
   frame = 0;
   const viewport = rail.getBoundingClientRect();
   const visible = [...rail.children].map((card, index) => ({index, box:card.getBoundingClientRect()}))
    .filter(({box}) => box.right > viewport.left + 2 && box.left < viewport.right - 2);
   const next = {start:(visible[0]?.index ?? 0) + 1, end:(visible.at(-1)?.index ?? 0) + 1,
    first:rail.scrollLeft <= 2, last:rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2};
   setRange(previous => Object.keys(next).every(key => previous[key] === next[key]) ? previous : next);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const observer = new ResizeObserver(schedule);
  observer.observe(rail);
  rail.addEventListener('scroll', schedule, {passive:true});
  update();
  return () => {observer.disconnect(); rail.removeEventListener('scroll', schedule); cancelAnimationFrame(frame);};
 }, []);
 function move(direction) {
  const rail = track.current;
  const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft;
  const current = Math.round(rail.scrollLeft / step);
  rail.scrollTo({left:Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth, (current + direction) * step)),
   behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
 }
 function onKey(event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);}
  if (event.key === 'Home' || event.key === 'End') {event.preventDefault(); track.current.scrollTo({left:event.key === 'Home' ? 0 : track.current.scrollWidth, behavior:'instant'});}
 }
 return <div className={`pf-product-carousel ${compact ? 'pf-product-carousel-compact' : ''}`} role="region" aria-roledescription="carousel" aria-labelledby={`${id}-title`}>
  <div className="pf-product-heading"><h3 id={`${id}-title`}>Trending Now</h3><div className="pf-product-controls">
   <button type="button" aria-label="Previous products" aria-controls={`${id}-track`} aria-disabled={range.first} onClick={()=>{if(!range.first)move(-1);}}><span aria-hidden="true">←</span></button>
   <button type="button" aria-label="Next products" aria-controls={`${id}-track`} aria-disabled={range.last} onClick={()=>{if(!range.last)move(1);}}><span aria-hidden="true">→</span></button>
  </div></div>
  <div ref={track} id={`${id}-track`} className="pf-product-track" tabIndex={0} onKeyDown={onKey} aria-label="Product cards. Swipe, scroll horizontally, or use the arrow keys.">
   {products.map((product,index)=><article key={product.name} className="pf-product-card" aria-roledescription="slide" aria-label={`${index + 1} of ${products.length}: ${product.name}`}>
    <div className="pf-product-image" style={{'--product-image-left':`${-100 * product.x / 288}%`}}>
     {failed ? <span className="pf-product-unavailable">Product image unavailable</span> : <img src={source.src} width={source.width} height={source.height} alt={`${product.name} ${product.category} bottle`} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}
    </div>
    <h4>{product.name}<span>{product.category}</span></h4>
    <p>For warm, comforting sweetness</p><p className="pf-product-price">Rs. 1299.00</p>
   </article>)}
  </div>
  <div className="pf-product-footer"><span>Explore the range</span><span aria-live="polite" aria-atomic="true">{range.start}–{range.end} / {products.length}</span></div>
 </div>;
}
const pageViews = [
 {label:'Homepage', desktop:'PF_DESKTOP_HOMEPAGE', mobile:'PF_MOBILE_HOMEPAGE', text:'An introduction to the brand, with space for its products and their stories.'},
 {label:'Product listing', desktop:'PF_DESKTOP_PRODUCT_LISTING', mobile:'PF_MOBILE_PRODUCT_LISTING', text:'Product imagery and useful information share a consistent browsing rhythm.'},
 {label:'Product detail', desktop:'PF_PRODUCT_DETAIL_DESKTOP', mobile:'PF_PRODUCT_DETAIL_MOBILE', text:'A closer look at the product, its details, and the next step in the shopping journey.'},
 {label:'Right by You', desktop:'PF_ADDITIONAL_REDESIGNED_PAGES', mobile:'PF_MOBILE_RIGHT_BY_YOU', text:'The replacement-request introduction, adapted across desktop and mobile.'},
];
function ResponsiveShowcase() {
 const [active, setActive] = useState(0); const view = pageViews[active];
 return <div className="pf-responsive-showcase">
  <div className="pf-showcase-bar"><div role="tablist" aria-label="Compare desktop and mobile page designs">
   {pageViews.map((item,i)=><button key={item.label} type="button" role="tab" id={`pf-page-tab-${i}`} aria-controls="pf-page-panel" aria-selected={i===active} tabIndex={i===active?0:-1} onClick={()=>setActive(i)} onKeyDown={event=>{
    let next;
    if(event.key==='ArrowRight')next=(i+1)%pageViews.length;
    if(event.key==='ArrowLeft')next=(i+pageViews.length-1)%pageViews.length;
    if(event.key==='Home')next=0;
    if(event.key==='End')next=pageViews.length-1;
    if(next!==undefined){event.preventDefault();setActive(next);event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();}
   }}>{item.label}</button>)}
  </div><span className="pf-label">Desktop ↔ Mobile</span></div>
  <div id="pf-page-panel" role="tabpanel" aria-labelledby={`pf-page-tab-${active}`} tabIndex={0}>
   <div className="pf-paired-devices"><Device name={view.desktop}/><Device kind="phone" name={view.mobile}/></div><p className="pf-showcase-caption">{view.text} Scroll within a screen to explore the full design.</p>
  </div>
 </div>;
}
function MobileShowcase() {
 const rail=useRef(null);
 const [ends,setEnds]=useState({first:true,last:false});
 useEffect(()=>{
  const node=rail.current;
  const update=()=>setEnds({first:node.scrollLeft<2,last:node.scrollLeft>=node.scrollWidth-node.clientWidth-2});
  const observer=new ResizeObserver(update);observer.observe(node);node.addEventListener('scroll',update,{passive:true});update();
  return()=>{observer.disconnect();node.removeEventListener('scroll',update);};
 },[]);
 const move=direction=>{const node=rail.current;node.scrollBy({left:direction*(node.children[0].offsetWidth+24),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 return <div className="pf-mobile-exhibition" id="mobile-designs">
  <div className="pf-container">
   <div className="pf-mobile-heading"><p className="pf-label">The mobile experience</p><h2>The same feeling.<br/>A smaller screen.</h2><p>From the menu and homepage to products, stories and checkout. Scroll inside each phone to explore the full design.</p></div>
   <div className="pf-mobile-browse"><span>Swipe through the screens</span><div><button type="button" aria-label="Previous mobile screen" disabled={ends.first} onClick={()=>move(-1)}>←</button><button type="button" aria-label="Next mobile screen" disabled={ends.last} onClick={()=>move(1)}>→</button></div></div>
   <div ref={rail} className="pf-mobile-grid" role="region" aria-label="Mobile website screens" tabIndex={0} onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}}}>{mobileScreens.map(({name,label})=><figure key={name}>
     <Device kind="phone" name={name}/>
     <figcaption><span>{label}</span></figcaption>
   </figure>)}</div>
  </div>
 </div>;
}
export default function Page() {
 return <div className="pf-met"><ReferenceCase slug="pf-met" title={project.name} width={1440} chapters={chapters}>
  <Chapter id="overview" label="Project overview" source="metropolitan-editorial" className="pf-overview">
   <nav className="pf-topbar" aria-label="Project navigation"><PortfolioBackLink/><Jump id="final-website">View the design <span aria-hidden="true">↘</span></Jump></nav>
   <div className="pf-container">
    <div className="pf-project-facts"><div><span className="pf-label">Project</span><p>Pristine Forests<br/>E-commerce website</p></div><div><span className="pf-label">Scope</span><p>Website audit<br/>UX / UI design<br/>Responsive design<br/>Visual direction</p></div><div><span className="pf-label">Role</span><p>{project.role}</p></div><div><span className="pf-label">Duration</span><p>{project.duration}</p></div></div>
    <div className="pf-hero-intro"><div className="pf-name"><p className="pf-label">Website redesign · E-commerce · UX/UI</p><p className="pf-wordmark" aria-label="Pristine Forests">Pristine<br/>Forests</p></div><div className="pf-about"><h2>About the project</h2><p className="pf-subtitle">{project.subtitle}</p><p>{project.description}</p><div className="case-project-actions"><LiveWebsiteLink href={project.liveUrl} name={project.name} target="pristine-website-live"/><Jump id="challenge" className="pf-text-link">Read the story <span aria-hidden="true">↓</span></Jump></div></div></div>
    <Intro label="Preview" className="pf-preview-intro"><p>The redesign brings the brand story and shopping experience into the same frame. Desktop and mobile are considered together, with an emphasis on product discovery, clear information and a calm visual rhythm.</p></Intro>
   </div>
   <div className="pf-contact-sheet">
    <div className="pf-collage-word"><span className="pf-label">Pristine Forests</span><p>Nature.<br/>Discovery.<br/>Considered.</p><span>Website redesign</span></div>
    <div className="pf-collage-desktop"><Device kind="laptop" name="PF_DESKTOP_HOMEPAGE"/></div>
    <div className="pf-collage-type"><span className="pf-label">A quieter expression</span><p>Aa</p><span>Space for the product.</span></div>
    <div className="pf-collage-detail"><ProductCarousel id="pf-preview-products" compact/></div>
    <div className="pf-collage-mobile"><Device kind="phone" name="PF_MOBILE_HOMEPAGE"/></div>
    <div className="pf-collage-palette" aria-label="White, botanical green, light grey, sage and charcoal presentation palette"><i/><i/><i/><i/><i/></div>
   </div>
  </Chapter>
  <Chapter id="challenge" label="The challenge" source="metropolitan-editorial" className="pf-section pf-container">
   <Header number="01" title="The challenge" next="audit"/>
   <div className="pf-challenge-grid"><div><p className="pf-label">Bringing the brand experience online</p><h3>How can a shopping experience feel as considered as the products?</h3></div><div className="pf-copy"><p>The opportunity was to create a more coherent digital expression of Pristine Forests: communicate the nature-inspired identity while helping visitors understand and explore the range.</p><p>The design questions focus on the relationship between brand, content and shopping—not on unverified claims about user behaviour.</p><ol className="pf-question-list"><li>Communicate the brand’s premium, nature-inspired positioning.</li><li>Make product discovery and content hierarchy easier to follow.</li><li>Adapt the experience thoughtfully across desktop and mobile.</li><li>Let imagery and typography support the products.</li></ol></div></div>
   <figure className="pf-visual pf-existing-website"><p className="pf-label">Existing website / Before the redesign</p><Device name="PF_EXISTING_WEBSITE_AUDIT" label="Existing UI · Essential Oils" screenRatio="1515 / 620"/><figcaption>Scroll inside the frame to explore the original Essential Oils page, from navigation to products and footer.</figcaption></figure>
  </Chapter>
  <Chapter id="audit" label="The website audit" source="metropolitan-editorial" className="pf-section pf-container">
   <Header number="02" title="Understanding the experience" next="visual-research"/>
   <Intro label="Website audit"><p>The original Essential Oils page introduces the product range through a promotional banner, category description and product listing. The redesigned homepage brings the brand introduction, Trending Now, product categories and brand pillars into a different reading order.</p><p className="pf-note">The existing UI comes from the imports at the bottom of the supplied Figma canvas; the redesigned homepage comes from its FINAL SCREENS group. These show the two visual systems on different pages, not a like-for-like page comparison or validated usability findings.</p></Intro>
   <div className="pf-audit-layout"><div className="pf-audit-phones"><figure><Device kind="phone" name="PF_MOBILE_AUDIT_BEFORE"/><figcaption>Existing experience</figcaption></figure><figure><Device kind="phone" name="PF_MOBILE_AUDIT_AFTER"/><figcaption>Redesigned experience</figcaption></figure></div><div><div className="pf-index-lines"><p><span>01</span>Navigation and orientation</p><p><span>02</span>Content and reading order</p><p><span>03</span>Product imagery and information</p><p><span>04</span>Responsive layout</p></div></div></div>
  </Chapter>
  <Chapter id="visual-research" label="Visual research" source="metropolitan-editorial" className="pf-section">
   <div className="pf-container"><Header number="03" title="Visual direction" next="designing"/><Intro label="Research & references"><p>Rituals, Kinfill, Malin + Goetz, Versed and Tatcha informed an exploration of editorial layouts, product presentation, whitespace, typography and image direction.</p><p>The intention is to create a recognisable Pristine Forests experience, while giving the products room to lead.</p></Intro><ResearchBoard/></div>
   <div className="pf-container pf-board-heading"><h3>Colour</h3><p>White and charcoal create a quiet foundation. Botanical green and softer foliage tones carry the nature-inspired character of this presentation.</p></div>
   <div className="pf-colour-board">{[['Charcoal','--fg'],['Botanical','--accent'],['White','--bg'],['Mist','--surface'],['Sage','--border']].map(([label,token])=><div key={label} style={{background:`var(${token})`}} className={token==='--fg'||token==='--accent'?'pf-swatch-dark':''}><span>{label}</span><span className="pf-swatch-glyph" aria-hidden="true">Pf</span><span>{({'--fg':'#171A16','--accent':'#2D6543','--bg':'#FFFFFF','--surface':'#F2F4EF','--border':'#D8DED4'})[token]}</span></div>)}</div>
   <div className="pf-container pf-board-heading"><h3>Typography</h3><p>A clear, open type system gives the story a deliberate pace. Large headings introduce the chapters; smaller text carries the detail without competing with the visuals.</p></div>
   <div className="pf-type-board"><div className="pf-type-samples"><div><span className="pf-label">Cabinet Grotesk / Chapter headings</span><p className="pf-font-cabinet">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm<br/>Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</p><p>0 1 2 3 4 5 6 7 8 9<br/>! @ # $ % & * ( )</p></div><div><span className="pf-label">Instrument Sans / Reading text</span><p>Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm<br/>Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</p><p>0 1 2 3 4 5 6 7 8 9<br/>! @ # $ % & * ( )</p></div><span className="pf-label">Case-study presentation typography</span></div><div className="pf-type-specimen"><span>Clarity, with character.</span><p>Ag</p><span>Cabinet Grotesk + Instrument Sans</span></div></div>
  </Chapter>
  <Chapter id="designing" label="Designing the experience" source="metropolitan-editorial" className="pf-section pf-container">
   <Header number="04" title="From structure to interface" next="responsive"/>
   <Intro label="Design development"><p>The design exploration connects the page hierarchy to the shopping journey: introduce the brand, help visitors discover products, then make space for a closer look.</p><p>Navigation, product cards, imagery and key e-commerce sections need to work as one system.</p></Intro>
   <div className="pf-process-lines"><div><span className="pf-label">Structure</span><p>Put the next step in context.</p></div><span aria-hidden="true">→</span><div><span className="pf-label">Hierarchy</span><p>Help the product stand out.</p></div><span aria-hidden="true">→</span><div><span className="pf-label">Interface</span><p>Make the experience coherent.</p></div></div>
  </Chapter>
  <Chapter id="responsive" label="Desktop meets mobile" source="metropolitan-editorial" className="pf-section">
   <div className="pf-container"><Header number="05" title="Web design" next="discovery"/><Intro label="One brand, two screen sizes"><p>The same visual identity needs a different composition on each screen. Desktop creates room for larger imagery and more context; mobile needs a deliberate reading order and comfortable controls.</p><p>Compare the actual homepage, After-Shower Body Oils listing and Candy Glaze product page. The desktop and mobile layouts are exported directly from the supplied designs.</p></Intro></div>
   <div className="pf-laptop-stage"><Device kind="laptop" name="PF_DESKTOP_HOMEPAGE"/><p className="pf-label">The homepage / Desktop experience</p></div>
   <div className="pf-container"><ResponsiveShowcase/></div>
  </Chapter>
  <Chapter id="discovery" label="Product discovery" source="metropolitan-editorial" className="pf-section pf-discovery">
   <div className="pf-container"><Header number="06" title="Room to discover" next="final-website"/><Intro label="Product discovery & shopping"><p>The product cards pair isolated bottle imagery with a name, a short scent description and a price. Category links and a filter entry point sit alongside the range, giving visitors different ways to narrow their browsing.</p><p>The Candy Glaze page moves from product imagery to a description, size and quantity choices, purchase controls and ingredients. Desktop places imagery and information beside each other; mobile follows a vertical sequence.</p></Intro>
    <div className="pf-shopping-composition"><div className="pf-listing-board"><Device name="PF_DESKTOP_PRODUCT_LISTING"/><p>01 / Browsing the range</p></div><div className="pf-detail-phone"><Device kind="phone" name="PF_PRODUCT_DETAIL_MOBILE"/><p>02 / A closer look</p></div></div>
    <div className="pf-discovery-products"><ProductCarousel id="pf-discovery-products"/><p className="pf-showcase-caption">Product imagery, scent descriptions and prices from the homepage design.</p></div>
    <figure className="pf-product-page"><Device name="PF_PRODUCT_DETAIL_DESKTOP" label="Candy Glaze / Product detail" screenRatio="1066 / 950"/><figcaption>Candy Glaze · the complete product composition, with imagery, description, size and purchase controls together. Scroll within the frame to explore the page.</figcaption></figure>
   </div>
  </Chapter>
  <Chapter id="final-website" label="The mobile experience" source="metropolitan-editorial" className="pf-section">
   <MobileShowcase/>
   <div className="pf-container pf-final-details"><div className="pf-final-detail-heading"><h3>Closer to the product.</h3><p>A larger view of the product page and supporting website designs.</p></div><Device name="PF_PRODUCT_DETAIL_DESKTOP" screenRatio="16 / 9"/><Showreel/></div>
  </Chapter>
  <Chapter id="reflection" label="Reflection" source="metropolitan-editorial" className="pf-section pf-container">
   <Header number="08" title="What this redesign explored"/>
   <div className="pf-reflection-grid"><h3>A brand experience,<br/>considered from<br/>every screen.</h3><div className="pf-copy"><p>Translating a nature-inspired identity into e-commerce is a question of balance. Imagery and typography create the atmosphere; hierarchy and structure help visitors move through it.</p><p>Designing desktop and mobile together keeps the brand recognisable while making room for the differences in how each screen is read and used.</p><dl className="pf-reflection-fields"><div><dt>What worked well</dt><dd>{project.reflection}</dd></div><div><dt>What I would improve next</dt><dd>{project.improvements}</dd></div><div><dt>Evidence or outcomes</dt><dd>{project.outcomes}</dd></div></dl></div></div>
   <div className="pf-closing"><p>Pristine Forests</p><LiveWebsiteLink href={project.liveUrl} name={project.name} target="pristine-website-live"/></div>
  </Chapter>
  <footer className="pf-footer pf-container"><span>Ajinkya Khanapurkar · Website redesign · UX/UI</span><Jump id="overview">Back to top ↑</Jump></footer>
  <NextProject current="pristine"/>
 </ReferenceCase></div>;
}
