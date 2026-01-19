export class memoryInventory {
  i = 1;

  findTODOindex(todo, todo_name) {
    return todo.findIndex((x) => x.todo_name === todo_name);
  }
  findTaskIndex(todo, task_name) {
    return todo.findIndex((x) => x.task_name === task_name);
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
    const todo = this.findTODOindex(db.tables.todos, todo_name);
    db.tables.todos[todo].tasks.push({
      task_name,
      task_desc,
      completed: false,
    });
    return { success: true };
  }
  listTasks(db, todo_name) {
    if (db === undefined) throw new Error("DB is Undefined");
    const todo = this.findTODOindex(db.tables.todos, todo_name);
    return db.tables.todos[todo].tasks;
  }
  markTaskDone(db, todo_name, task_name) {
    if (db === undefined) throw new Error("DB is Undefined");

    const todoIndex = this.findTODOindex(db.tables.todos, todo_name);
    const todo = db.tables.todos[todoIndex].tasks;
    const taskIndex = this.findTaskIndex(todo, task_name);
    todo[taskIndex].completed = true;
  }

  deleteTask(db, todo_name, task_name) {
    if (db === undefined) throw new Error("DB is Undefined");

    const todoIndex = this.findTODOindex(db.tables.todos, todo_name);
    const todo = db.tables.todos[todoIndex].tasks;
    const taskIndex = this.findTaskIndex(todo, task_name);
    todo.splice(taskIndex, 1);
  }
  deleteTodo(db, todo_name) {
    if (db === undefined) throw new Error("DB is Undefined");

    const todoIndex = this.findTODOindex(db.tables.todos, todo_name);
    const todosList = db.tables.todos;
    todosList.splice(todoIndex, 1);
  }
}
