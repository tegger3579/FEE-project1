export class Note {
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
