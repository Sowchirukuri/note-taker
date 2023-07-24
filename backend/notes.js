// routes/notes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Function to read data from db.json
function readNotes() {
  const data = fs.readFileSync(path.join(__dirname, '..', 'db', 'db.json'), 'utf-8');
  return JSON.parse(data);
}

// Function to write data to db.json
function writeNotes(notes) {
  fs.writeFileSync(path.join(__dirname, '..', 'db', 'db.json'), JSON.stringify(notes));
}

router.get('/', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

router.post('/', (req, res) => {
  const notes = readNotes();
  const newNote = req.body;
  newNote.id = Date.now().toString(); // Using timestamp as a simple unique ID
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});

router.delete('/:id', (req, res) => {
  const notes = readNotes();
  const noteId = req.params.id;
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  writeNotes(updatedNotes);
  res.json({ message: 'Note deleted successfully' });
});

module.exports = router;
