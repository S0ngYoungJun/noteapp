document.addEventListener('DOMContentLoaded', () => {
  const createButton = document.getElementById('createButton');
  const noteModal = document.getElementById('noteModal');
  const noteTitle = document.getElementById('noteTitle');
  const noteContent = document.getElementById('noteContent');
  const doneButton = document.getElementById('doneButton');
  const noteContainer = document.getElementById('noteContainer');
  const editModal = document.getElementById('editModal');
  const closeEditModalButton = document.getElementById('closeEditModal');
  const deleteButton = document.getElementById('deleteButton');

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
    noteBox.dataset.id = note.id; // Add data attribute for the note's ID
    noteBox.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
    noteContainer.appendChild(noteBox);

    noteBox.addEventListener('click', () => {
      displayEditModal(note);
    });
  }

  function displayEditModal(note) {
    const editNoteTitle = document.getElementById('editNoteTitle');
    const editNoteContent = document.getElementById('editNoteContent');
    const updateButton = document.getElementById('updateButton');

    // 모달 내용 초기화
    if (editNoteTitle && editNoteContent && updateButton) {
      editNoteTitle.value = note.title;
      editNoteContent.value = note.content;

      // 모달 보이기
      editModal.style.display = 'block';

      updateButton.addEventListener('click', () => {
        const updatedTitle = editNoteTitle.value;
        const updatedContent = editNoteContent.value;

        if (updatedTitle && updatedContent) {
          const updatedNoteData = { title: updatedTitle, content: updatedContent };

          fetch(`/api/notes/${note.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedNoteData),
          })
            .then((response) => response.json())
            .then((updatedNote) => {
              editModal.style.display = 'none';

              // Update the note on the page
              note.title = updatedTitle;
              note.content = updatedContent;
              const noteBox = document.querySelector('.note-box[data-id="' + note.id + '"]');
              noteBox.innerHTML = `<h3>${updatedTitle}</h3><p>${updatedContent}</p>`;
            });
        }
      })
      deleteButton.addEventListener('click', () => {
      deleteNote(note.id);
    });

    function deleteNote(noteId) {
  // 서버에서 노트 삭제 요청을 보내는 코드 작성
  fetch(`/api/notes/${noteId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.status === 204) {
        // 삭제가 성공하면 페이지에서 노트 박스 제거
        const noteBox = document.querySelector('.note-box[data-id="' + noteId + '"]');
        if (noteBox) {
          noteContainer.removeChild(noteBox);
          // 모달 닫기
          editModal.style.display = 'none';
        }
      } else {
        console.error('Failed to delete the note.');
      }
    })
    .catch((error) => {
      console.error('An error occurred while deleting the note:', error);
    });
}
      if (!closeEditModalButton) {
        // 닫기 버튼이 없을 때만 추가
        const closeModalButton = document.createElement('button');
        closeModalButton.id = 'closeEditModal'; // ID 설정
        closeModalButton.addEventListener('click', () => {
          editModal.style.display = 'none';
        });
        closeModalButton.textContent = 'Close';
        editModal.appendChild(closeModalButton);
      }
      closeEditModalButton.addEventListener('click', () => {
        editModal.style.display = 'none';
      });
    }};
    
    

  
    // 수정 모달 닫기
    // editModal.addEventListener('click', (e) => {
    //   if (e.target === editModal) {
    //     editModal.style.display = 'none';
    //   }
    // });
  

  // 초기 노트 목록을 불러오기
  fetch('/api/notes')
    .then((response) => response.json())
    .then((notes) => {
      notes.forEach((note) => displayNoteBox(note));
    });
});