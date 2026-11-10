const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle ?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
});
links ?.addEventListener('click', e => {
    if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle ?.setAttribute('aria-expanded', 'false');
    }
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        links ?.classList.remove('open');
        toggle ?.setAttribute('aria-expanded', 'false');
    }
});
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
const notes = {
    learning: { title: 'Always learning.', label: '', body: 'I study computer science and data science at Truman State.' },
    hello: { title: 'Hi, I’m Anshu.', label: '', body: 'I’m a student at Truman State. I work on AI projects and health research.' },
    explore: { title: 'Outside, for a bit.', label: '', body: 'I like getting outside and taking photos, especially of sunsets and the moon.' },
    music: { title: 'A little music.', label: '', body: 'I play piano and love dancing. There’s usually music somewhere in my day.' },
    dogs: { title: 'A dog person.', label: '', body: 'Always happy to meet a dog.' }
};
const dialog = document.getElementById('note-dialog');
if (dialog) {
    let opener = null;
    document.querySelectorAll('[data-note]').forEach(button => button.addEventListener('click', () => {
        const note = notes[button.dataset.note];
        if (!note) return;
        opener = button;
        document.getElementById('note-title').textContent = note.title;
        document.getElementById('note-label').textContent = note.label;
        document.getElementById('note-body').textContent = note.body;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
    }));
    dialog.querySelector('.note-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => {
        document.body.style.overflow = '';
        opener ?.focus();
    });
}

const themeToggle = document.querySelector('.theme-toggle');
function applyTheme(dark) {
    document.documentElement.classList.toggle('moonlit', dark);
    themeToggle?.setAttribute('aria-pressed', String(dark));
    themeToggle?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    if (themeToggle) themeToggle.textContent = dark ? 'Light mode' : 'Dark mode';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#22232e' : '#eee7df');
}
applyTheme(document.documentElement.classList.contains('moonlit'));
themeToggle?.addEventListener('click', () => {
    const dark = !document.documentElement.classList.contains('moonlit');
    applyTheme(dark);
    try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch {}
});
window.addEventListener('storage', event => {
    if (event.key === 'portfolio-theme') applyTheme(event.newValue === 'dark');
});
