document.addEventListener('DOMContentLoaded', () => {
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');
    const searchInput = document.getElementById('search-input');
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Track if editing
    let editingIndex = null;

    // Render notes
    function renderNotes(filter = '') {
        notesList.innerHTML = '';
        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(filter.toLowerCase()) ||
            note.content.toLowerCase().includes(filter.toLowerCase())
        );

        filteredNotes.forEach((note, index) => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card');
            noteCard.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <div class="note-actions">
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            notesList.appendChild(noteCard);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => editNote(e.target.dataset.index));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteNote(e.target.dataset.index));
        });
    }

    // Add or Save Note
    addNoteBtn.addEventListener('click', () => {
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (!title || !content) return;

        if (editingIndex === null) {
            // Add mode
            notes.push({ title, content });
        } else {
            // Edit mode
            notes[editingIndex] = { title, content };
            editingIndex = null;
            addNoteBtn.textContent = 'Add Note';
        }

        localStorage.setItem('notes', JSON.stringify(notes));
        noteTitleInput.value = '';
        noteContentInput.value = '';
        renderNotes();
    });

    // Edit note
    function editNote(index) {
        const note = notes[index];
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        editingIndex = index;
        addNoteBtn.textContent = 'Save Note';
        noteTitleInput.focus();
    }

    // Delete note
    function deleteNote(index) {
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        if (editingIndex === parseInt(index)) {
            editingIndex = null;
            addNoteBtn.textContent = 'Add Note';
            noteTitleInput.value = '';
            noteContentInput.value = '';
        }
        renderNotes();
    }

    // Search notes
    searchInput.addEventListener('input', (e) => {
        renderNotes(e.target.value);
    });

    // Initial render
    renderNotes();
});
