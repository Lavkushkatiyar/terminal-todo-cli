export class memoryInventory {
  i = 1;

  findTodo(todo, todo_name) {
    return todo.findIndex((x) => x.todo_name === todo_name);
  }

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

  addTaskInToDo(db, todo_name, task_name, task_desc) {
    if (db === undefined) throw new Error("DB is Undefined");
    const todo = this.findTodo(db.tables.todos, todo_name);
    db.tables.todos[todo].tasks.push({
      task_name,
      task_desc,
      completed: false,
    });
    return { success: true };
  }
  listTasks(db, todo_name) {
    if (db === undefined) throw new Error("DB is Undefined");
    const todo = this.findTodo(db.tables.todos, todo_name);
    return db.tables.todos[todo].tasks;
  }
}
