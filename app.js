const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const notesFilePath = path.join(__dirname, 'notes.json');


if (!fs.existsSync(notesFilePath)) {
  fs.writeFileSync(notesFilePath, '[]');
}

app.get('/api/notes', (req, res) => {
  // 읽어온 노트 목록을 클라이언트에 보내기
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  // 새 노트 추가
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }

    const notes = JSON.parse(data);
    const newNote = { title, content };
    notes.push(newNote);

    fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while saving the note.' });
      }
      res.json(newNote);
    });
  });
});

app.put('/api/notes', (req, res) => {
  const { id, title, content } = req.body;
  if (!id || !title || !content) {
    return res.status(400).json({ error: 'ID, title, and content are required.' });
  }

  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }

    const notes = JSON.parse(data);
    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    notes[noteIndex] = { id, title, content };

    fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while saving the note.' });
      }
      res.json(notes[noteIndex]);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  
  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err); // 에러 로그 추가
      return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }

    const notes = JSON.parse(data);
    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
      console.error('Note not found:', id); // 노트를 찾지 못한 경우 로그 추가
      return res.status(404).json({ error: 'Note not found.' });
    }

    notes.splice(noteIndex, 1); // 배열에서 노트 삭제

    fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error('Error saving notes:', err); // 에러 로그 추가
        return res.status(500).json({ error: 'An error occurred while saving the notes.' });
      }
      res.json({ message: 'Note deleted successfully.' });
    });
  });
});


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});