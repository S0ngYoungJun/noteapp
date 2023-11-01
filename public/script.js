document.addEventListener('DOMContentLoaded', () => {
  const createButton = document.getElementById('createButton');
  const noteModal = document.getElementById('noteModal');
  const noteTitle = document.getElementById('noteTitle');
  const noteContent = document.getElementById('noteContent');
  const doneButton = document.getElementById('doneButton');
  const deleteButton = document.getElementById('deleteButton');
  const noteContainer = document.getElementById('noteContainer');

  createButton.addEventListener('click', () => {
    noteModal.style.display = 'block';
  });

  doneButton.addEventListener('click', () => {
    const title = noteTitle.value;
    const content = noteContent.value;

    if (title && content) {
      const noteData = { title, content };

      fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      })
        .then((response) => response.json())
        .then((note) => {
          noteTitle.value = '';
          noteContent.value = '';
          noteModal.style.display = 'none';
          displayNoteBox(note);
        });
    }
  });
  function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 100); // 0에서 999 사이의 랜덤 숫자
    return `note-${timestamp}-${random}`;
  }
  

  function displayNoteBox(note) {
    const noteBox = document.createElement('div');
    noteBox.className = 'note-box';
    noteBox.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
    noteBox.id =  generateUniqueId()
    noteBox.style.borderRadius="30px"
    noteBox.setAttribute('data-note-id', note.id);
    const contentParagraph = noteBox.querySelector('p');
    contentParagraph.addEventListener('click', () => {
      contentParagraph.classList.toggle('selected');
    });
    noteBox.addEventListener('click', () => {
      const id = noteBox.getAttribute('data-note-id');
    noteModal.setAttribute('data-note-id', id);
      editNote(noteBox);
    });
    noteContainer.appendChild(noteBox);
  }

  deleteButton.addEventListener('click', () => {
    const id = noteModal.getAttribute('data-note-id');
    if (id) {
      fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Note deleted successfully') {
            const noteBox = document.getElementById(id);
            if (noteBox) {
              noteContainer.removeChild(noteBox);
            }
            noteModal.style.display = 'none';
          } else {
            alert('Failed to delete the note.');
          }
        })
        .catch((error) => {
          console.error('Error deleting note:', error);
          alert('An error occurred while deleting the note.');
        });
    }
  });
  
  noteContainer.addEventListener('click', (event) => {
    const noteBox = event.target.closest('.note-box');
    if (noteBox) {
      const id = noteBox.getAttribute('data-note-id');
      noteModal.setAttribute('data-note-id', id);
      editNote();
    }
  });
  function editNote(noteBox) {
    // const noteBox = document.querySelector(".note-box")
    const editTitle = noteBox.querySelector('h3');
    const editContent = noteBox.querySelector('p');

    // 기존 내용을 폼에 설정
    noteTitle.value = editTitle.textContent;
    noteContent.value = editContent.textContent;

    noteContainer.removeChild(noteBox); // 기존 노트 박스 제거

    noteModal.style.display = 'block'; // 수정 폼 표시

    doneButton.addEventListener('click', () => {
      const updatedTitle = noteTitle.value;
      const updatedContent = noteContent.value;

      if (updatedTitle && updatedContent) {
        fetch('/api/notes', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: note.id, title: updatedTitle, content: updatedContent }),
        })
          .then((response) => response.json())
          .then((updatedNote) => {
            noteTitle.value = '';
            noteContent.value = '';
            noteModal.style.display = 'none';
            displayNoteBox(updatedNote);
          });
      }
    });
  }

  // 초기 노트 목록을 불러오기
  fetch('/api/notes')
    .then((response) => response.json())
    .then((notes) => {
      notes.forEach((note) => displayNoteBox(note));
    });
});