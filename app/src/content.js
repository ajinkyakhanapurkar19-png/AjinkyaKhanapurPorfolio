// Audited from the public portfolio on 2026-10-23. Missing values remain explicit.
export const profile = {
 name:'Ajinkya Khanapurkar', role:'User Experience Designer & Storyteller',
 intro:'Crafting Digital Experiences.',
 biography:"I'm a UI/UX designer passionate about creating meaningful digital experiences. With a keen eye for detail and a deep understanding of user behavior, I transform complex problems into elegant, intuitive solutions.",
 approach:'My approach combines strategic thinking with creative execution, ensuring that every design not only looks beautiful but also serves its purpose effectively.',
 email:'ajinkyakhanapurkar19@gmail.com',
 resume:new URL('../../assets/ajinkya-khanapurkar-resume-2026.pdf',import.meta.url).href, tools:[],
 links:{linkedin:'https://www.linkedin.com/in/ajinkya-khanapurkar-179a1326b/',behance:'https://www.behance.net/ajinkyakhanapu1',instagram:'https://www.instagram.com/ajinkya_khanapurkar/'}
};
export const capabilities = [
 {name:'Human-centered approach',text:'Designing experiences that prioritize user needs and behaviors.'},
 {name:'Problem-solving expertise',text:'Transforming challenges into simple, impactful solutions.'},
 {name:'Research-driven design',text:'Making informed design decisions through user research, usability testing, and insight-led validation.'}
];
export const projects = [
 {id:'nyaya-saathi',title:'Nyaya Saathi',category:'Service design',description:'Bridging the gap between legal information and understanding for citizens.',tags:['UI','Legal aid','UX design'],image:'nyaya-saathi.jpg',url:'https://www.behance.net/gallery/244830781/Nyaya-Saathi-(Service-Design-Project)',fit:'contain'},
 {id:'fumiha',title:'Fumiha',category:'Content design',description:'Designing content for a regional brand launch for Fumiha.',tags:['Branding','Content','Graphics'],image:'fumiha.jpg',url:'https://www.behance.net/gallery/215954617/Fumiha-Japanese-Paan-Shop'},
 {id:'junction',title:'Junction',category:'Research & interaction design',description:'Every day, 30,000 people pass through Indore Junction.',tags:['Research','Interaction','UX'],image:'junction.jpg',url:'https://www.behance.net/gallery/246268367/Junction-Interactive-Infrastructure-Map'},
 {id:'intent-search',title:'Intent Search',category:'UI design',description:'Helping users reach the right product faster by understanding why they are searching.',tags:['UI design','Feature UI','User interface'],image:'intent-search.jpg',url:'https://www.behance.net/gallery/244684083/Intent-Search'},
 {id:'cinejournal',title:'CineJournal',category:null,description:null,tags:[],image:'cinejournal.jpg',url:'https://www.behance.net/gallery/244401813/CineJournal',note:'Description unavailable in the source portfolio.'},
 {id:'tudoom',title:'TuDoom',category:'Film',description:'A short film showcasing the journey of Netflix. A study of how real-life stories are shaped through cinematic techniques.',tags:['Visual storytelling','Film'],image:'tudoom.jpg',url:'https://www.youtube.com/watch?v=vi5Ko7NsCPw&t=3s'},
 {id:'still-stillness',title:'STILL, STILLNESS',category:'Photography & visual storytelling',description:'Capturing portraits, street, lifestyle, and events with a strong focus on mood, emotion, and narrative.',tags:['Photography','Visual storytelling'],image:'still-stillness.jpg',url:'https://www.behance.net/gallery/231761255/STILL-STILLNESS'},
 {id:'infrastructure',title:'A life cycle mapping of temporary infrastructure from mass gathering in India',category:'Research',description:'This research paper examines the lifecycle of temporary infrastructure created during mass gatherings in India.',tags:['Research'],image:'infrastructure-research.png',url:null,note:'Research paper link unavailable.'}
];
export const filmProjects=projects.slice(0,7);
