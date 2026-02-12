export class SqliteTodoStore {
  #db;

  constructor(db) {
    this.#db = db;
  }

  createTodoTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          todo_name TEXT NOT NULL UNIQUE,
          todo_desc TEXT NOT NULL
        ) STRICT;
      `;
      this.#db.exec(query);
      return { success: true };
    } catch {
      return { success: false, error: "failed to create todo table" };
    }
  }

  #getTodo(todo_name) {
    return this.#db
      .prepare("SELECT id FROM todos WHERE todo_name = ?")
      .get(todo_name);
  }

  createTasksTable() {
    const todosPresent = this.#db.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    ).get("todos");

    if (!todosPresent) {
      return { success: false, error: "todos is not present" };
    }

    try {
      const query = `
        CREATE TABLE IF NOT EXISTS task (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          todo_id INTEGER NOT NULL,
          task_name TEXT NOT NULL,
          task_desc TEXT NOT NULL,
          complete TEXT NOT NULL DEFAULT 'false',
          FOREIGN KEY (todo_id) REFERENCES todos(id)
            ON DELETE CASCADE
        ) STRICT;
      `;
      this.#db.exec(query);
      return { success: true };
    } catch {
      return { success: false, error: "failed to create task table" };
    }
  }

  #isTodoAlreadyExist(todo_name) {
    const row = this.#db.prepare(
      "SELECT 1 FROM todos WHERE todo_name = ?",
    ).get(todo_name);

    return row !== undefined;
  }

  addTodo({ todo_name, todo_desc }) {
    if (todo_name === undefined) {
      return { success: false, error: "todo is undefined" };
    }

    if (this.#isTodoAlreadyExist(todo_name)) {
      return { success: false, error: "TODO is Already Exist" };
    }

    try {
      this.#db.prepare(
        "INSERT INTO todos (todo_name, todo_desc) VALUES (?, ?)",
      ).run(todo_name, todo_desc);

      return { success: true };
    } catch {
      return { success: false, error: "failed to add todo" };
    }
  }

  listTodo() {
    try {
      const content = this.#db.prepare("SELECT * FROM todos").all();
      return { success: true, content };
    } catch {
      return { success: false, error: "failed to list todos" };
    }
  }

  deleteTodo({ todo_name }) {
    if (todo_name === undefined) {
      return { success: false, error: "todo is undefined" };
    }
    const result = this.#db.prepare(
      "DELETE FROM todos WHERE todo_name = ?",
    ).run(todo_name);

    if (result.changes === 0) {
      return { success: false, error: "todo doesn't exist" };
    }

    return { success: true };
  }

  addTaskInTodo({ todo_name, task_name, task_desc }) {
    if (todo_name === undefined) {
      return { success: false, error: "todo name is required" };
    }

    if (!this.#isTodoAlreadyExist(todo_name)) {
      return { success: false, error: "todo doesn't exist" };
    }

    const todo = this.#getTodo(todo_name);

    try {
      this.#db.prepare(
        "INSERT INTO task (todo_id, task_name, task_desc) VALUES (?, ?, ?)",
      ).run(todo.id, task_name, task_desc);

      return { success: true };
    } catch {
      return { success: false, error: "failed to add task" };
    }
  }

  markTaskDone({ todo_name, task_name }) {
    if (todo_name === undefined || !this.#isTodoAlreadyExist(todo_name)) {
      return { success: false, error: "todo doesn't exist" };
    }

    const todo = this.#getTodo(todo_name);

    const result = this.#db.prepare(
      `UPDATE task
       SET complete = 'done'
       WHERE task_name = ? AND todo_id = ?`,
    ).run(task_name, todo.id);

    if (result.changes === 0) {
      return { success: false, error: "task doesn't exist" };
    }

    return { success: true };
  }

  listTasks({ todo_name }) {
    if (todo_name === undefined || !this.#isTodoAlreadyExist(todo_name)) {
      return { success: false, error: "todo doesn't exist" };
    }

    const todo = this.#getTodo(todo_name);

    const content = this.#db.prepare(
      "SELECT * FROM task WHERE todo_id = ?",
    ).all(todo.id);

    return { success: true, content };
  }

  deleteTask({ todo_name, task_name }) {
    if (todo_name === undefined || !this.#isTodoAlreadyExist(todo_name)) {
      return { success: false, error: "todo doesn't exist" };
    }

    const todo = this.#getTodo(todo_name);

    const result = this.#db.prepare(
      "DELETE FROM task WHERE todo_id = ? AND task_name = ?",
    ).run(todo.id, task_name);

    if (result.changes === 0) {
      return { success: false, error: "task doesn't exist" };
    }

    return { success: true };
  }
}
