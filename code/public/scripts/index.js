/* global Handlebars */

const notes = [
  { id: 1, title: "Buy groceries", text: "Milk, eggs, bread, and vegetables",
    dueDate: "2026-06-02", completed: true, importance: 4, createDate: "2026-05-25" },
  { id: 2, title: "Pay bill", text: "Pay the electricity bill",
    dueDate: "2026-05-30", completed: false, importance: 5, createDate: "2026-05-26" },
  { id: 3, title: "Call mom", text: "Schedule a video call for Sunday afternoon",
    dueDate: "2026-06-01", completed: false, importance: 1, createDate: "2026-05-27" },
];

let currentSort = {
  column: null,
  direction: 'asc' // 'asc' or 'desc'
};

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const source = document.getElementById("note-template").innerHTML;
  const template = Handlebars.compile(source);
  const noteList = document.querySelector(".note-list__ul");

  const renderNotes = (filterCompleted = false) => {
    let filteredNotes = filterCompleted 
      ? notes.filter(note => !note.completed)
      : notes;

    if (currentSort.column) {
      filteredNotes = [...filteredNotes].sort((a, b) => {
        let valueA = a[currentSort.column];
        let valueB = b[currentSort.column];
        
        // Handle string comparison (case-insensitive)
        if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        
        let comparison = 0;
        if (valueA < valueB) comparison = -1;
        if (valueA > valueB) comparison = 1;
        
        return currentSort.direction === 'asc' ? comparison : -comparison;
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
        defaultText: "By name"
      },
      { 
        element: document.querySelector(".button-sort-due-date"), 
        column: "dueDate",
        defaultText: "By due date"
      },
      { 
        element: document.querySelector(".button-sort-creation-date"), 
        column: "createDate",
        defaultText: "By creation date"
      },
      { 
        element: document.querySelector(".button-sort-importance"), 
        column: "importance",
        defaultText: "By importance"
      }
    ];

    sortButtons.forEach(btn => {
      // Remove old arrow if exists
      const textSpan = btn.element.querySelector('.sort-arrow');
      if (textSpan) {
        textSpan.remove();
      }
    
    // Add arrow if this column is currently sorted
      if (currentSort.column === btn.column) {
        const arrow = document.createElement('span');
        arrow.className = 'sort-arrow';
        arrow.textContent = currentSort.direction === 'asc' ? ' ↑' : ' ↓';
        btn.element.appendChild(arrow);
        btn.element.classList.add('button-sort-bold');
      } else {
        btn.element.classList.remove('button-sort-bold');
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
    
    buttons.forEach(button => {
      if (isAlternativeStyle) {
        document.body.style.backgroundColor = "var(--darkBackgroundColor)";
        document.body.style.color = "var(--lightFontColor)";
        button.style.backgroundColor = "var(--grayButtonColor)";
        button.style.color = "var(--lightFontColor)";
        noteItems.forEach(item => {
          item.style.borderBottomColor = "var(--lightFontColor)";
        });
      } else {
        document.body.style.backgroundColor = "var(--lightBackgroundColor)";
        document.body.style.color = "var(--darkFontColor)";
        button.style.backgroundColor = "var(--greenButtonColor)";
        button.style.color = "var(--darkFontColor)";
        noteItems.forEach(item => {
          item.style.borderBottomColor = "var(--darkFontColor)";
        });
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
      column: "title" 
    },
    { 
      element: document.querySelector(".button-sort-due-date"), 
      column: "dueDate" 
    },
    { 
      element: document.querySelector(".button-sort-creation-date"), 
      column: "createDate" 
    },
    { 
      element: document.querySelector(".button-sort-importance"), 
      column: "importance" 
    }
  ];

  sortButtons.forEach(sortBtn => {
    sortBtn.element.addEventListener("click", () => {
      // Toggle direction if clicking the same column, otherwise switch to ascending
      if (currentSort.column === sortBtn.column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort.column = sortBtn.column;
        currentSort.direction = 'asc';
      }
      
      updateSortButtons();
      renderNotes(filterCompleted);
    });
  });

  // Initial render and styling
  renderNotes(filterCompleted);
  applyStyles();
  updateSortButtons();
});