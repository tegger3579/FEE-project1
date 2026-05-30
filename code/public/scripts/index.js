/* global Handlebars */

const notes = [
  { id: 1, title: "Buy groceries", text: "Milk, eggs, bread, and vegetables",
    dueDate: "2026-06-02", completed: true, importance: 4 },
  { id: 2, title: "Pay bill", text: "Pay the electricity bill",
    dueDate: "2026-05-30", completed: false, importance: 5 },
  { id: 3, title: "Call mom", text: "Schedule a video call for Sunday afternoon",
    dueDate: "2026-06-01", completed: false, importance: 1 },
];

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const source = document.getElementById("note-template").innerHTML;
  const template = Handlebars.compile(source);
  const noteList = document.querySelector(".note-list__ul");

  const renderNotes = (filterCompleted = false) => {
    const filteredNotes = filterCompleted 
      ? notes.filter(note => !note.completed)
      : notes;
    
    const html = template({ notes: filteredNotes });
    noteList.innerHTML = html;
  };

  const filterButton = document.querySelector(".button-filter");
  let filterCompleted = false;

  filterButton.addEventListener("click", () => {
    filterCompleted = !filterCompleted;

    if (filterCompleted) {
      filterButton.classList.add("button-filter-bold");
    } else {
      filterButton.classList.remove("button-filter-bold");
    }

    renderNotes(filterCompleted);
  });

  // Initial render
  renderNotes(filterCompleted);
});