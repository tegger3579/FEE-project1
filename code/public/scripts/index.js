/* global Handlebars */

class Note {
  constructor(id, title, text, dueDate, completed, importance, createDate) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.dueDate = dueDate;
    this.completed = completed;
    this.importance = importance;
    this.createDate = createDate;
  }
}

const notes = [
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

let currentSort = {
  column: null,
  direction: "asc", // 'asc' or 'desc'
};

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const source = document.getElementById("note-template").innerHTML;
  const template = Handlebars.compile(source);
  const noteList = document.querySelector(".note-list__ul");

  const renderNotes = (filterCompleted = false) => {
    let filteredNotes = filterCompleted
      ? notes.filter((note) => !note.completed)
      : notes;

    if (currentSort.column) {
      filteredNotes = [...filteredNotes].sort((a, b) => {
        let valueA = a[currentSort.column];
        let valueB = b[currentSort.column];

        // Handle string comparison (case-insensitive)
        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        let comparison = 0;
        if (valueA < valueB) comparison = -1;
        if (valueA > valueB) comparison = 1;

        return currentSort.direction === "asc" ? comparison : -comparison;
      });
    }

    const html = template({ notes: filteredNotes });
    noteList.innerHTML = html;
  };

  const updateSortButtons = () => {
    const sortButtons = [
      {
        element: document.querySelector(".button-sort-name"),
        column: "title",
        defaultText: "By name",
      },
      {
        element: document.querySelector(".button-sort-due-date"),
        column: "dueDate",
        defaultText: "By due date",
      },
      {
        element: document.querySelector(".button-sort-creation-date"),
        column: "createDate",
        defaultText: "By creation date",
      },
      {
        element: document.querySelector(".button-sort-importance"),
        column: "importance",
        defaultText: "By importance",
      },
    ];

    sortButtons.forEach((btn) => {
      // Remove old arrow if exists
      const textSpan = btn.element.querySelector(".sort-arrow");
      if (textSpan) {
        textSpan.remove();
      }

      // Add arrow if this column is currently sorted
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
  };

  const filterButton = document.querySelector(".button-filter");
  let filterCompleted = false;

  const styleButton = document.querySelector(".button-style");
  let isAlternativeStyle = false;

  const applyStyles = () => {
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
  };

  filterButton.addEventListener("click", () => {
    filterCompleted = !filterCompleted;

    if (filterCompleted) {
      filterButton.classList.add("button-filter-bold");
    } else {
      filterButton.classList.remove("button-filter-bold");
    }

    renderNotes(filterCompleted);
  });

  styleButton.addEventListener("click", () => {
    isAlternativeStyle = !isAlternativeStyle;
    applyStyles();
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
      // Toggle direction if clicking the same column, otherwise switch to ascending
      if (currentSort.column === sortBtn.column) {
        currentSort.direction =
          currentSort.direction === "asc" ? "desc" : "asc";
      } else {
        currentSort.column = sortBtn.column;
        currentSort.direction = "asc";
      }

      updateSortButtons();
      renderNotes(filterCompleted);
    });
  });

  // Initial render and styling
  renderNotes(filterCompleted);
  applyStyles();
  updateSortButtons();

  // Modal functionality
  const modal = document.getElementById("note-modal");
  const addBtn = document.querySelector(".button-add");
  const closeBtn = document.querySelector(".modal-close");
  const noteForm = document.getElementById("note-form");
  const modalTitle = document.getElementById("modal-title");

  addBtn.addEventListener("click", () => {
    modal.style.display = "block";
    modalTitle.textContent = "Add New Note";
    noteForm.reset();
  });

  noteList.addEventListener("click", (e) => {
    if (e.target.classList.contains("button-edit")) {
      const noteItem = e.target.closest(".note-list__item");
      const noteId = parseInt(noteItem.dataset.noteId);
      const noteToEdit = notes.find((n) => n.id === noteId);

      if (noteToEdit) {
        document.getElementById("note-title").value = noteToEdit.title;
        document.getElementById("note-text").value = noteToEdit.text;
        document.getElementById("note-due-date").value = noteToEdit.dueDate;
        document.getElementById("note-importance").value =
          noteToEdit.importance;
        document.getElementById("note-completed").checked =
          noteToEdit.completed;

        noteForm.dataset.editingId = noteId;

        modalTitle.textContent = "Edit Note";
        modal.style.display = "block";
      }
    }
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle form submission
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editingId = noteForm.dataset.editingId;

    if (editingId) {
      // Edit existing note
      const index = notes.findIndex((n) => n.id === parseInt(editingId));
      if (index !== -1) {
        notes[index] = {
          ...notes[index],
          title: document.getElementById("note-title").value,
          text: document.getElementById("note-text").value,
          dueDate: document.getElementById("note-due-date").value,
          importance: parseInt(
            document.getElementById("note-importance").value,
          ),
          completed: document.getElementById("note-completed").checked,
        };
      }
      delete noteForm.dataset.editingId;
    } else {
      const newNote = new Note(
        Date.now(),
        document.getElementById("note-title").value,
        document.getElementById("note-text").value,
        document.getElementById("note-due-date").value,
        document.getElementById("note-completed").checked,
        parseInt(document.getElementById("note-importance").value),
        new Date().toISOString().split("T")[0],
      );

      notes.push(newNote);
    }

    renderNotes(filterCompleted);
    modal.style.display = "none";
    noteForm.reset();
  });
});
