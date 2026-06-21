import { NoteView } from "../views/noteView.js";
import { NoteService } from "../services/noteService.js";

export class NoteController {
  constructor() {
    this.view = new NoteView();
    this.service = new NoteService();
    this.filterCompleted = false;
    this.isAlternativeStyle = false;
    this.editingNoteId = null;

    this.init();
  }

  async init() {
    await this.service.initPromise;

    this.renderNotes();
    this.view.applyStyles(this.isAlternativeStyle);
    this.view.updateSortButtons(this.service.currentSort);

    this.setupEventListeners();
  }

  setupEventListeners() {
    const elements = this.view.getElements();

    elements.filterButton.addEventListener("click", () => {
      this.filterCompleted = !this.filterCompleted;
      this.view.updateFilterButton(this.filterCompleted);
      this.renderNotes();
    });

    elements.styleButton.addEventListener("click", () => {
      this.isAlternativeStyle = !this.isAlternativeStyle;
      this.view.applyStyles(this.isAlternativeStyle);
    });

    const sortButtons = [
      {
        element: document.querySelector(".button-sort-name"),
        column: "title",
      },
      {
        element: document.querySelector(".button-sort-due-date"),
        column: "dueDate",
      },
      {
        element: document.querySelector(".button-sort-creation-date"),
        column: "createDate",
      },
      {
        element: document.querySelector(".button-sort-importance"),
        column: "importance",
      },
    ];

    sortButtons.forEach((sortBtn) => {
      sortBtn.element.addEventListener("click", () => {
        this.service.toggleSort(sortBtn.column);
        this.view.updateSortButtons(this.service.currentSort);
        this.renderNotes();
      });
    });

    elements.addBtn.addEventListener("click", () => {
      this.view.resetForm();
      this.view.showModal("Add New Note");
    });

    elements.closeBtn.addEventListener("click", () => {
      this.editingNoteId = null;
      this.view.hideModal();
    });

    window.addEventListener("click", (event) => {
      if (event.target === elements.modal) {
        this.editingNoteId = null;
        this.view.hideModal();
      }
    });

    elements.noteList.addEventListener("click", (e) => {
      if (e.target.classList.contains("button-edit")) {
        this.handleEditNote(e);
      }
    });

    elements.noteForm.addEventListener("submit", (e) => {
      this.handleFormSubmit(e);
    });
  }

  handleEditNote(e) {
    const noteItem = e.target.closest(".note-list__item");
    this.editingNoteId = parseInt(noteItem.dataset.noteId);
    const noteToEdit = this.service.getNoteById(this.editingNoteId);

    if (noteToEdit) {
      this.view.setFormValues(noteToEdit);
      this.view.showModal("Edit Note");
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    const formValues = this.view.getFormValues();

    await this.service.saveNote(this.editingNoteId, formValues);

    this.editingNoteId = null;
    this.view.hideModal();
    this.view.resetForm();
    this.renderNotes();
  }

  renderNotes() {
    const notes = this.service.getNotes(this.filterCompleted);
    this.view.renderNotes(notes);
  }
}
