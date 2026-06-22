import { noteStore } from "../services/noteStore.js";

export class NotesController {
  getNotes = async (req, res) => {
    res.json((await noteStore.all()) || []);
  };

  saveNote = async (req, res) => {
    const noteData = req.body;

    if (noteData.id) {
      try {
        const updated = await noteStore.update(noteData.id, noteData);
        res.status(200);
        res.json(updated);
      } catch (error) {
        res.status(404).json({ error: error.message });
      }
    } else {
      res.status(201);
      res.json(await noteStore.add(noteData));
    }
  };
}

export const notesController = new NotesController();
