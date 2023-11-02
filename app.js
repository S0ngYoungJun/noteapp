const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse JSON request body
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
    const newNote = { id: Date.now(), title, content }; // Add a unique ID
    notes.push(newNote);

    fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while saving the note.' });
      }
      res.json(newNote);
    });
  });
});

app.put('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  if (isNaN(noteId)) {
    return res.status(400).json({ error: 'Invalid note ID.' });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }

    const notes = JSON.parse(data);
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    notes[noteIndex] = { id: noteId, title, content };
    
    fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while saving the note.' });
      }
      res.json(notes[noteIndex]);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  if (isNaN(noteId)) {
    return res.status(400).json({ error: 'Invalid note ID.' });
  }

  fs.readFile(notesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while reading notes.' });
    }

    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(notesFilePath, JSON.stringify(updatedNotes, null, 1), (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred while deleting the note.' });
      }
      res.sendStatus(204); // 성공적으로 삭제된 경우 204 상태 코드 반환
    });
  });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});