import { noteStore } from "../services/noteStore.js";

export class NotesController {
  getNotes = async (req, res) => {
    res.json((await noteStore.all()) || []);
  };

  createNote = async (req, res) => {
    res.json(await noteStore.add(req.body.name));
  };

  showNote = async (req, res) => {
    res.json(await noteStore.get(req.params.id));
  };
}

export const notesController = new NotesController();
