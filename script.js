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
const board = document.querySelector('.vision-board');
if (board) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
    const motionButton = document.getElementById('board-motion');
    let paused = reducedMotion.matches;
    let drag = null;
    let frame = 0;
    let targetX = 0, targetY = 0;
    const positions = new Map();
    const pieces = [...board.querySelectorAll('.board-piece')];
    function updateMotion() {
        board.classList.toggle('still', paused);
        motionButton.setAttribute('aria-pressed', String(paused));
        motionButton.setAttribute('aria-label', paused ? 'Enable 3D movement' : 'Pause 3D movement');
        motionButton.title = motionButton.getAttribute('aria-label');
        board.style.setProperty('--view-x', '0deg');
        board.style.setProperty('--view-y', '0deg');
    }
    updateMotion();
    reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updateMotion(); });
    motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
    const light = document.getElementById('board-light');
    light.addEventListener('click', () => {
        const night = document.body.classList.toggle('moonlit');
        light.setAttribute('aria-pressed', String(night));
        light.setAttribute('aria-label', night ? 'Switch to daylight' : 'Switch to moonlight');
        light.title = light.getAttribute('aria-label');
    });
    function resetPositions() {
        pieces.forEach(piece => {
            piece.style.setProperty('--drag-x', '0px');
            piece.style.setProperty('--drag-y', '0px');
        });
        positions.clear();
    }
    document.getElementById('board-reset').addEventListener('click', resetPositions);
    board.addEventListener('pointermove', event => {
        if (!finePointer.matches) return;
        if (drag && event.pointerId === drag.id) {
            const x = event.clientX - drag.startX;
            const y = event.clientY - drag.startY;
            if (!drag.moved && Math.hypot(x,y) < 7) return;
            drag.moved = true;
            drag.piece.classList.add('is-dragging');
            drag.piece.setPointerCapture(event.pointerId);
            const dx = Math.max(-90, Math.min(90, drag.x + x));
            const dy = Math.max(-70, Math.min(70, drag.y + y));
            positions.set(drag.piece, { x:dx, y:dy });
            drag.piece.style.setProperty('--drag-x', dx + 'px');
            drag.piece.style.setProperty('--drag-y', dy + 'px');
            return;
        }
        if (paused) return;
        const rect = board.getBoundingClientRect();
        targetX = ((event.clientY - rect.top) / rect.height - .5) * -7;
        targetY = ((event.clientX - rect.left) / rect.width - .5) * 8;
        if (!frame) frame = requestAnimationFrame(() => {
            board.style.setProperty('--view-x', targetX + 'deg');
            board.style.setProperty('--view-y', targetY + 'deg');
            board.style.setProperty('--light-x', (50 + targetY * 5) + '%');
            frame = 0;
        });
    });
    // Fine-pointer dragging never captures a tap or interferes with touch scrolling.
    pieces.filter(piece => piece.matches('button')).forEach(piece => {
        piece.addEventListener('pointerdown', event => {
            if (!finePointer.matches || paused || event.button !== 0) return;
            const position = positions.get(piece) || {x:0,y:0};
            drag = {piece,id:event.pointerId,startX:event.clientX,startY:event.clientY,x:position.x,y:position.y,moved:false};
        });
        piece.addEventListener('click', event => {
            if (piece.dataset.dragged === 'true') {
                event.preventDefault();
                event.stopImmediatePropagation();
                delete piece.dataset.dragged;
            }
        }, true);
    });
    function endDrag(event) {
        if (!drag || drag.id !== event.pointerId) return;
        drag.piece.classList.remove('is-dragging');
        if (drag.moved) {
            drag.piece.dataset.dragged = 'true';
            const piece = drag.piece;
            setTimeout(() => delete piece.dataset.dragged, 0);
        }
        if (drag.piece.hasPointerCapture(event.pointerId)) drag.piece.releasePointerCapture(event.pointerId);
        drag = null;
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    board.addEventListener('pointerleave', () => {
        if (drag || paused) return;
        board.style.setProperty('--view-x', '0deg');
        board.style.setProperty('--view-y', '0deg');
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') { resetPositions(); drag = null; }
    });
}
