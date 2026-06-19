/* global Handlebars */

export class NoteView {
  constructor() {
    this.source = document.getElementById("note-template").innerHTML;
    this.template = Handlebars.compile(this.source);
    this.noteList = document.querySelector(".note-list__ul");
    this.noteForm = document.getElementById("note-form");
  }

  renderNotes(notes) {
    const html = this.template({ notes });
    this.noteList.innerHTML = html;
  }

  updateSortButtons(currentSort) {
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

    sortButtons.forEach((btn) => {
      // Remove old arrow
      const textSpan = btn.element.querySelector(".sort-arrow");
      if (textSpan) {
        textSpan.remove();
      }

      // Add arrow if this column is sorted
      if (currentSort.column === btn.column) {
        const arrow = document.createElement("span");
        arrow.className = "sort-arrow";
        arrow.textContent = currentSort.direction === "asc" ? " ↑" : " ↓";
        btn.element.appendChild(arrow);
        btn.element.classList.add("button-sort-bold");
      } else {
        btn.element.classList.remove("button-sort-bold");
      }
    });
  }

  applyStyles(isAlternativeStyle) {
    const buttons = document.querySelectorAll("button");
    const noteItems = document.querySelectorAll(".note-list__item");
    const modalContent = document.querySelector(".modal-content");
    const modalTextElements = document.querySelectorAll(
      ".modal-content label, .modal-content h2, .modal-content p, .modal-content span",
    );

    if (isAlternativeStyle) {
      document.body.style.backgroundColor = "var(--darkBackgroundColor)";
      document.body.style.color = "var(--lightFontColor)";
      modalContent.style.backgroundColor = "var(--darkBackgroundColor)";
      modalTextElements.forEach(
        (el) => (el.style.color = "var(--lightFontColor)"),
      );
    } else {
      document.body.style.backgroundColor = "var(--lightBackgroundColor)";
      document.body.style.color = "var(--darkFontColor)";
      modalContent.style.backgroundColor = "var(--lightBackgroundColor)";
      modalTextElements.forEach(
        (el) => (el.style.color = "var(--darkFontColor)"),
      );
    }

    buttons.forEach((button) => {
      if (isAlternativeStyle) {
        button.style.backgroundColor = "var(--grayButtonColor)";
        button.style.color = "var(--lightFontColor)";
      } else {
        button.style.backgroundColor = "var(--greenButtonColor)";
        button.style.color = "var(--darkFontColor)";
      }
    });

    noteItems.forEach((item) => {
      if (isAlternativeStyle) {
        item.style.borderBottomColor = "var(--lightFontColor)";
      } else {
        item.style.borderBottomColor = "var(--darkFontColor)";
      }
    });
  }

  getElements() {
    return {
      filterButton: document.querySelector(".button-filter"),
      styleButton: document.querySelector(".button-style"),
      addBtn: document.querySelector(".button-add"),
      closeBtn: document.querySelector(".modal-close"),
      modal: document.getElementById("note-modal"),
      noteForm: document.getElementById("note-form"),
      modalTitle: document.getElementById("modal-title"),
      noteList: this.noteList,
    };
  }

  updateFilterButton(isActive) {
    const filterBtn = document.querySelector(".button-filter");
    if (isActive) {
      filterBtn.classList.add("button-filter-bold");
    } else {
      filterBtn.classList.remove("button-filter-bold");
    }
  }

  showModal(title = "Add New Note") {
    const modal = document.getElementById("note-modal");
    const modalTitle = document.getElementById("modal-title");
    modalTitle.textContent = title;
    modal.style.display = "block";
  }

  hideModal() {
    const modal = document.getElementById("note-modal");
    modal.style.display = "none";
  }

  getFormValues() {
    return {
      title: document.getElementById("note-title").value,
      text: document.getElementById("note-text").value,
      dueDate: document.getElementById("note-due-date").value,
      importance: parseInt(document.getElementById("note-importance").value),
      completed: document.getElementById("note-completed").checked,
    };
  }

  setFormValues(note) {
    document.getElementById("note-title").value = note.title;
    document.getElementById("note-text").value = note.text;
    document.getElementById("note-due-date").value = note.dueDate;
    document.getElementById("note-importance").value = note.importance;
    document.getElementById("note-completed").checked = note.completed;
  }

  resetForm() {
    document.getElementById("note-form").reset();
  }
}
