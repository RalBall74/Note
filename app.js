// Note Model: { id, title, text, color, date }

const notesGrid = document.getElementById('notes-grid');
const addNoteBtn = document.getElementById('add-note-btn');
const noteModal = document.getElementById('note-modal');
const saveNoteBtn = document.getElementById('save-note');
const cancelNoteBtn = document.getElementById('cancel-note');
const deleteNoteBtn = document.getElementById('delete-note');
const searchInput = document.getElementById('search-input');
const colorDots = document.querySelectorAll('.color-dot');
const noteTitle = document.getElementById('note-title');
const noteText = document.getElementById('note-text');

let notes = JSON.parse(localStorage.getItem('keep-notes')) || [];

let selectedColor = "#FF4D8D";
let editingId = null;

// Initialization
function init() {
    renderNotes(notes);
    saveToStorage();
}

function renderNotes(notesToRender) {
    notesGrid.innerHTML = '';
    notesToRender.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.text}</p>
            <div class="note-dot" style="background-color: ${note.color}"></div>
        `;
        card.onclick = () => openEditModal(note);
        notesGrid.appendChild(card);
    });
}

function saveToStorage() {
    localStorage.setItem('keep-notes', JSON.stringify(notes));
}

// Modal logic
addNoteBtn.onclick = () => {
    editingId = null;
    noteTitle.value = '';
    noteText.value = '';
    deleteNoteBtn.style.display = 'none';
    noteModal.classList.add('active');
};

cancelNoteBtn.onclick = () => {
    noteModal.classList.remove('active');
};

deleteNoteBtn.onclick = () => {
    if (editingId) {
        notes = notes.filter(n => n.id !== editingId);
        renderNotes(notes);
        saveToStorage();
        noteModal.classList.remove('active');
    }
};

saveNoteBtn.onclick = () => {
    const title = noteTitle.value.trim();
    const text = noteText.value.trim();

    if (!title && !text) return;

    if (editingId) {
        const index = notes.findIndex(n => n.id === editingId);
        notes[index] = { ...notes[index], title, text, color: selectedColor };
    } else {
        const newNote = {
            id: Date.now(),
            title: title || "Untitled Note",
            text: text || "",
            color: selectedColor,
            date: Date.now()
        };
        notes.unshift(newNote);
    }

    renderNotes(notes);
    saveToStorage();
    noteModal.classList.remove('active');
};

function openEditModal(note) {
    editingId = note.id;
    noteTitle.value = note.title;
    noteText.value = note.text;
    selectedColor = note.color;
    
    // Update active dot in modal
    colorDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.color === selectedColor);
    });
    
    deleteNoteBtn.style.display = 'block';
    noteModal.classList.add('active');
}

// Color picker logic
colorDots.forEach(dot => {
    dot.onclick = () => {
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        selectedColor = dot.dataset.color;
    };
});

// Search logic
searchInput.oninput = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.text.toLowerCase().includes(query)
    );
    renderNotes(filtered);
};

// Layout toggle simulation
document.getElementById('layout-toggle').onclick = () => {
    const isGrid = notesGrid.style.gridTemplateColumns !== '1fr';
    notesGrid.style.gridTemplateColumns = isGrid ? '1fr' : 'repeat(2, 1fr)';
};

init();
