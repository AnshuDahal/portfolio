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
    learning: { title: 'Forever a student.', label: 'A NOTE ON CURIOSITY', body: 'I’m studious, but I also just really like finding things out. Computer science and data science give me a way to turn questions into experiments, and experiments into something useful. There’s always another idea I want to understand.' },
    hello: { title: 'Glad you’re here.', label: 'THE PERSON BEHIND THE BOARD', body: 'Hi, I’m Anshu! I care about my work, love a good laugh, and enjoy trying new things. This board brings together a little bit of everything I love, from research and building things to exploring new places. And yes, I’ll always stop to say hi to a dog.' },
    explore: { title: 'Take the scenic route.', label: 'A NOTE FROM OUTSIDE', body: 'I love exploring and hiking. A new trail, a different view, a little time away from a screen. I like the feeling of going somewhere unfamiliar and noticing things along the way. Curiosity follows me outside, too.' },
    music: { title: 'Make room for joy.', label: 'BEYOND THE KEYBOARD', body: 'I play piano, and I love music and dancing. Sometimes I want to sit with a melody; sometimes I just want to move. These are parts of my life I want to make room for, alongside the work I do.' },
    dogs: { title: 'Definitely a dog person.', label: 'A VERY IMPORTANT PERSONAL DETAIL', body: 'Some introductions don’t need a long explanation: I love dogs. This little clipping is here because a portfolio should have room for the things that make you smile, too.' }
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
const world = document.querySelector('.personal-world');
if (world) {
    const status = document.getElementById('scene-status');
    world.querySelectorAll('[data-sky-choice]').forEach(button => button.addEventListener('click', () => {
        world.dataset.sky = button.dataset.skyChoice;
        world.querySelectorAll('[data-sky-choice]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        document.getElementById('sky-caption').textContent = world.dataset.sky === 'moon' ? 'The moon makes me look up. Every time.' : 'One more minute of golden hour.';
    }));
    world.querySelector('.camera-object').addEventListener('click', () => {
        const keepsake = world.querySelector('.photo-keepsake');
        keepsake.hidden = false;
        keepsake.dataset.sky = world.dataset.sky;
        document.getElementById('keepsake-caption').textContent = world.dataset.sky === 'moon' ? 'a little moonlight, kept.' : 'a little golden hour, kept.';
        status.textContent = 'Click! A little illustrated keepsake of this ' + (world.dataset.sky === 'moon' ? 'moonlit sky.' : 'sunset.');
    });
    const record = world.querySelector('.record');
    record.addEventListener('click', () => {
        const spinning = record.getAttribute('aria-pressed') !== 'true';
        record.setAttribute('aria-pressed', String(spinning));
        record.setAttribute('aria-label', spinning ? 'Stop the record' : 'Spin the record');
        status.textContent = spinning ? 'A little spin, a little dancing. Try the piano for sound.' : 'Taking a quiet moment.';
    });
    let audioContext;
    let sound = false;
    const soundButton = document.getElementById('piano-sound');
    soundButton.addEventListener('click', async () => {
        try {
            const Audio = window.AudioContext || window.webkitAudioContext;
            if (!Audio) throw new Error('Audio unavailable');
            audioContext ||= new Audio();
            await audioContext.resume();
            sound = !sound;
            soundButton.setAttribute('aria-pressed', String(sound));
            soundButton.textContent = sound ? 'Sound on ♫' : 'Sound off ♫';
        } catch { status.textContent = 'Audio is unavailable in this browser. You can still explore the keys.'; }
    });
    const frequencies = { C:261.63, D:293.66, E:329.63, F:349.23, G:392, A:440, B:493.88, C5:523.25 };
    function playKey(button) {
        button.classList.remove('playing');
        void button.offsetWidth;
        button.classList.add('playing');
        status.textContent = 'Piano · ' + button.dataset.tone.replace('5','') + (sound ? '' : ' · enable sound to listen');
        if (!sound || !audioContext) return;
        const time = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.value = frequencies[button.dataset.tone];
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(.16, time + .012);
        gain.gain.exponentialRampToValueAtTime(.001, time + 1.1);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(time);
        oscillator.stop(time + 1.2);
    }
    world.querySelectorAll('[data-tone]').forEach(button => {
        button.addEventListener('click', () => playKey(button));
        button.addEventListener('animationend', () => button.classList.remove('playing'));
    });
    document.addEventListener('keydown', event => {
        if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || document.querySelector('dialog[open]') || event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
        const bounds = world.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
        const index = 'asdfghjk'.indexOf(event.key.toLowerCase());
        if (index >= 0) playKey(world.querySelectorAll('[data-tone]')[index]);
    });
}
