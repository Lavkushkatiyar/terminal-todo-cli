export class memoryInventory {
  i = 1;
  createDB = () => {
    return { tables: {} };
  };
  initializeDB(db) {
    if (db === undefined) {
      throw new Error("DB is Undefined");
    }
    db.tables["todos"] = [];
    return db;
  }
  addToDo(db, todo_name, todo_desc) {
    if (db === undefined) {
      throw new Error("DB is Undefined");
    }
    db.tables.todos.push({
      todo_id: this.i++,
      todo_name,
      todo_desc,
      completed: "❌",
      tasks: [],
    });
    return db.tables.todos;
  }

  listTodo(db) {
    if (db === undefined) {
      throw new Error("DB is Undefined");
    }
    const content = db.tables.todos;
    return { success: true, content };
  }
}
