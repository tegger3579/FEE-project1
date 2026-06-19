import { Note } from "../models/note.js";

export class NoteService {
  constructor() {
    this.notes = [
      new Note(
        1,
        "Buy groceries",
        "Milk, eggs, bread, and vegetables",
        "2026-06-02",
        true,
        4,
        "2026-05-25",
      ),
      new Note(
        2,
        "Pay bill",
        "Pay the electricity bill",
        "2026-05-30",
        false,
        5,
        "2026-06-26",
      ),
      new Note(
        3,
        "Call mom",
        "Schedule a video call for Sunday afternoon",
        "2026-07-01",
        false,
        1,
        "2026-05-27",
      ),
    ];

    this.currentSort = {
      column: null,
      direction: "asc", // 'asc' or 'desc'
    };
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

  createNote(formValues) {
    const newNote = new Note(
      Date.now(),
      formValues.title,
      formValues.text,
      formValues.dueDate,
      formValues.completed,
      formValues.importance,
      new Date().toISOString().split("T")[0],
    );

    this.notes.push(newNote);
    return newNote;
  }

  updateNote(id, formValues) {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notes[index].title = formValues.title;
      this.notes[index].text = formValues.text;
      this.notes[index].dueDate = formValues.dueDate;
      this.notes[index].importance = formValues.importance;
      this.notes[index].completed = formValues.completed;
      return this.notes[index];
    }
    return null;
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
