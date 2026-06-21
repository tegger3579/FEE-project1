import Datastore from "@seald-io/nedb";
import { CONFIG } from "../config.js";
import { Note } from "../models/note.js";

export class NoteStore {
  constructor(db) {
    this.db =
      db ||
      new Datastore({ filename: CONFIG.data("notes.db"), autoload: true });
  }

  async add(noteData) {
    const note = new Note(
      Date.now(),
      noteData.title,
      noteData.text,
      noteData.dueDate,
      noteData.completed ?? false,
      noteData.importance ?? 3,
      new Date().toISOString().split("T")[0],
    );
    return this.db.insertAsync(note);
  }

  async update(id, noteData) {
    const existingNote = await this.db.findOneAsync({ id: id });

    if (!existingNote) {
      throw new Error(`Note with id ${id} not found`);
    }

    const updatedNote = {
      ...existingNote,
      title: noteData.title ?? existingNote.title,
      text: noteData.text ?? existingNote.text,
      dueDate: noteData.dueDate ?? existingNote.dueDate,
      completed: noteData.completed ?? existingNote.completed,
      importance: noteData.importance ?? existingNote.importance,
    };

    await this.db.updateAsync({ id: id }, { $set: updatedNote });
    return updatedNote;
  }

  async all() {
    return this.db.findAsync({});
  }
}

export const noteStore = new NoteStore();
