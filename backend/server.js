const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('../public'));

// Read notes from the db.json file
function readNotesFile() {
  const dbFilePath = path.join(__dirname, 'db.json');
  return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
}

// Write notes to the db.json file
function writeNotesFile(notes) {
  const dbFilePath = path.join(__dirname, 'db.json');
  fs.writeFileSync(dbFilePath, JSON.stringify(notes));
}

// API route to get all notes
app.get('/api/notes', (req, res) => {
  const notes = readNotesFile();
  res.json(notes);
});

// API route to save a new note
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: 'Title and text are required fields.' });
  }

  const notes = readNotesFile();
  const newNote = { id: uuidv4(), title, text };
  notes.push(newNote);
  writeNotesFile(notes);

  res.json(newNote);
});

// API route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  let notes = readNotesFile();
  notes = notes.filter((note) => note.id !== noteId);
  writeNotesFile(notes);

  res.sendStatus(200);
});

// Route to serve the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'notes.html'));
});

// Route to serve the index.html file for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
