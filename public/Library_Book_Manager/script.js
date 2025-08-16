const bookForm = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const statusInput = document.getElementById('status');
const bookIdInput = document.getElementById('bookId');
const booksTableBody = document.getElementById('booksTableBody');
const emptyMessage = document.getElementById('emptyMessage');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const toggleModeBtn = document.getElementById('toggleMode');
const root = document.documentElement;

let books = [];
let isEditing = false;

// Utility functions to save/load books in localStorage
function saveBooksToStorage() {
  localStorage.setItem('libraryBooks', JSON.stringify(books));
}

function loadBooksFromStorage() {
  const storedBooks = localStorage.getItem('libraryBooks');
  books = storedBooks ? JSON.parse(storedBooks) : [];
}

// Render books table
function renderBooks() {
  booksTableBody.innerHTML = '';
  if (books.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }
  emptyMessage.style.display = 'none';

  books.forEach((book, index) => {
    const tr = document.createElement('tr');

    // Title cell
    const titleTd = document.createElement('td');
    titleTd.textContent = book.title;
    tr.appendChild(titleTd);

    // Author cell
    const authorTd = document.createElement('td');
    authorTd.textContent = book.author;
    tr.appendChild(authorTd);

    // Status cell as clickable badge to toggle status
    const statusTd = document.createElement('td');
    const statusBadge = document.createElement('button');
    statusBadge.className = `status-badge status-${book.status.replace(/\s+/g, '')}`;
    statusBadge.type = 'button';
    statusBadge.textContent = book.status;
    statusBadge.setAttribute('aria-label', `Change status for ${book.title}`);
    statusBadge.onclick = () => toggleBookStatus(index);
    statusTd.appendChild(statusBadge);
    tr.appendChild(statusTd);

    // Actions cell: Edit & Delete buttons
    const actionsTd = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn';
    editBtn.setAttribute('aria-label', `Edit ${book.title}`);
    editBtn.innerHTML = '✏️';
    editBtn.onclick = () => startEditBook(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn';
    deleteBtn.setAttribute('aria-label', `Delete ${book.title}`);
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = () => deleteBook(index);

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);
    tr.appendChild(actionsTd);

    booksTableBody.appendChild(tr);
  });
}

// Toggle status cycle: Unread -> Reading -> Read -> Unread ...
function toggleBookStatus(index) {
  const currentStatus = books[index].status;
  const statuses = ['Unread', 'Reading', 'Read'];
  let currentIdx = statuses.indexOf(currentStatus);
  currentIdx = (currentIdx + 1) % statuses.length;
  books[index].status = statuses[currentIdx];
  saveBooksToStorage();
  renderBooks();
}

// Start editing a book
function startEditBook(index) {
  const book = books[index];
  bookIdInput.value = index;
  titleInput.value = book.title;
  authorInput.value = book.author;
  statusInput.value = book.status;
  submitBtn.textContent = 'Update Book';
  cancelBtn.hidden = false;
  isEditing = true;
  titleInput.focus();
}

// Cancel editing mode
function cancelEdit() {
  isEditing = false;
  bookIdInput.value = '';
  bookForm.reset();
  submitBtn.textContent = 'Add Book';
  cancelBtn.hidden = true;
  titleInput.focus();
}

// Delete a book from list
function deleteBook(index) {
  if (confirm(`Are you sure you want to delete "${books[index].title}"?`)) {
    books.splice(index, 1);
    saveBooksToStorage();
    renderBooks();
    if (isEditing && bookIdInput.value == index.toString()) cancelEdit();
  }
}

// Handle form submit for add/update
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const status = statusInput.value;

  if (!title || !author) {
    alert('Please fill all required fields.');
    return;
  }

  if (isEditing) {
    const id = parseInt(bookIdInput.value, 10);
    books[id] = { title, author, status };
  } else {
    books.push({ title, author, status });
  }

  saveBooksToStorage();
  renderBooks();

  cancelEdit();
});

// Cancel button click
cancelBtn.addEventListener('click', cancelEdit);

// Dark/Light mode toggle persistence & logic
let lightMode = true;

function applyTheme(mode) {
  if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
    toggleModeBtn.textContent = '☀️';
    lightMode = false;
  } else {
    root.removeAttribute('data-theme');
    toggleModeBtn.textContent = '🌙';
    lightMode = true;
  }
  localStorage.setItem('libraryTheme', mode);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('libraryTheme');
  if (savedTheme === 'dark') {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
}

toggleModeBtn.addEventListener('click', () => {
  applyTheme(lightMode ? 'dark' : 'light');
});

// Initialization
function init() {
  loadBooksFromStorage();
  renderBooks();
  loadTheme();
}

window.addEventListener('DOMContentLoaded', init);
