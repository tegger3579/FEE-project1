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

  async get(id) {
    return this.db.findOneAsync({ id: id });
  }

  async all() {
    return this.db.findAsync({});
  }
}

export const noteStore = new NoteStore();
