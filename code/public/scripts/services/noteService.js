import { Note } from "../models/note.js";
import { httpService } from "./httpService.js";

export class NoteService {
  constructor() {
    this.notes = [];

    this.currentSort = {
      column: null,
      direction: "asc",
    };

    this.initPromise = this.loadNotes();
  }

  async loadNotes() {
    try {
      const notes = await httpService.ajax("GET", "/notes/");
      this.notes = notes.map(
        (note) =>
          new Note(
            note.id,
            note.title,
            note.text,
            note.dueDate,
            note.completed,
            note.importance,
            note.createDate,
          ),
      );
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  }

  getNotes(filterCompleted = false) {
    let filteredNotes = filterCompleted
      ? this.notes.filter((note) => !note.completed)
      : this.notes;

    if (this.currentSort.column) {
      filteredNotes = [...filteredNotes].sort((a, b) => {
        let valueA = a[this.currentSort.column];
        let valueB = b[this.currentSort.column];

        // Handle string comparison (case-insensitive)
        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        let comparison = 0;
        if (valueA < valueB) comparison = -1;
        if (valueA > valueB) comparison = 1;

        return this.currentSort.direction === "asc" ? comparison : -comparison;
      });
    }

    return filteredNotes;
  }

  getNoteById(id) {
    return this.notes.find((n) => n.id === id);
  }

  async saveNote(id, formValues) {
    const noteData = {
      id,
      title: formValues.title,
      text: formValues.text,
      dueDate: formValues.dueDate,
      completed: formValues.completed || false,
      importance: formValues.importance || 3,
    };

    try {
      await httpService.ajax("POST", "/notes/", noteData);
      await this.loadNotes();
    } catch (error) {
      console.error("Failed to save note:", error);
      throw error;
    }
  }

  toggleSort(column) {
    if (this.currentSort.column === column) {
      this.currentSort.direction =
        this.currentSort.direction === "asc" ? "desc" : "asc";
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = "asc";
    }
  }
}
