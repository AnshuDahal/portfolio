const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
links?.addEventListener('click',e=>{if(e.target.closest('a')){links.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){links?.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}});
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const notes={
 learning:{title:'Forever a student.',label:'A NOTE ON CURIOSITY',body:'I’m studious, but I also just really like finding things out. Computer science and data science give me a way to turn questions into experiments, and experiments into something useful. There’s always another idea I want to understand.'},
 hello:{title:'Glad you’re here.',label:'THE PERSON BEHIND THE BOARD',body:'I’m Anshu. I care about my work, I love a good laugh, and I have more interests than fit into a job title. This board brings those different parts together: the researcher, the builder, the explorer, and the person who will absolutely stop to say hello to a dog.'},
 explore:{title:'Take the scenic route.',label:'A NOTE FROM OUTSIDE',body:'I love exploring and hiking. A new trail, a different view, a little time away from a screen. I like the feeling of going somewhere unfamiliar and noticing things along the way. Curiosity follows me outside, too.'},
 music:{title:'Make room for joy.',label:'BEYOND THE KEYBOARD',body:'Singing, dancing, laughing. These are part of my life just as much as studying and building. I like being serious about what matters while leaving room for a little spontaneity. Not every interest needs to become an achievement.'},
 dogs:{title:'Definitely a dog person.',label:'A VERY IMPORTANT PERSONAL DETAIL',body:'Some introductions don’t need a long explanation: I love dogs. This little clipping is here because a portfolio should have room for the things that make you smile, too.'}
};
const dialog=document.getElementById('note-dialog');
if(dialog){let opener=null;document.querySelectorAll('[data-note]').forEach(button=>button.addEventListener('click',()=>{const note=notes[button.dataset.note];if(!note)return;opener=button;document.getElementById('note-title').textContent=note.title;document.getElementById('note-label').textContent=note.label;document.getElementById('note-body').textContent=note.body;dialog.showModal();document.body.style.overflow='hidden';}));dialog.querySelector('.note-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus();});}
