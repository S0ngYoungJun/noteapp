document.addEventListener('DOMContentLoaded', () => {
  const createButton = document.getElementById('createButton');
  const noteModal = document.getElementById('noteModal');
  const noteTitle = document.getElementById('noteTitle');
  const noteContent = document.getElementById('noteContent');
  const doneButton = document.getElementById('doneButton');
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

  function displayNoteBox(note) {
    const noteBox = document.createElement('div');
    noteBox.className = 'note-box';
    noteBox.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
    noteContainer.appendChild(noteBox);

    noteBox.addEventListener('click', () => {
      editNote(note);
    });
  }

  function editNote(note) {
    // 박스 클릭 시 수정 기능을 구현
    // 여기에 수정할 수 있는 UI 및 기능을 추가하세요
  }

  // 초기 노트 목록을 불러오기
  fetch('/api/notes')
    .then((response) => response.json())
    .then((notes) => {
      notes.forEach((note) => displayNoteBox(note));
    });
});