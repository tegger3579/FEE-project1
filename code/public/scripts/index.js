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
  const html = template({ notes });
  document.querySelector(".note-list__ul").innerHTML = html;
});