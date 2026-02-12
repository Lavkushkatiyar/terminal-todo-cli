export class SqliteTodoStore {
  #db;
  constructor(db) {
    this.#db = db;
  }
  createTodoTable() {
    if (!this.#db) {
      throw new Error("db is undefined");
    }
    const query = `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      todo_name TEXT NOT NULL UNIQUE,
      todo_desc TEXT NOT NULL
    ) STRICT;
  `;
    this.#db.exec(query);
  }
  #getTodo(todo_name) {
    return this.#db.prepare(`SELECT id FROM todos WHERE todo_name = ?`).get(
      todo_name,
    );
  }
  createTasksTable() {
    if (!this.#db) throw new Error("db is undefined");

    const todosPresent = this.#db.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    ).get("todos");

    if (!todosPresent) {
      throw new Error("todos  is not present");
    }

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      todo_id INTEGER NOT NULL,
      task_name TEXT NOT NULL,
      task_desc TEXT NOT NULL,
      complete TEXT NOT NULL DEFAULT 'false',
      FOREIGN KEY (todo_id) REFERENCES todos(id)
        ON DELETE CASCADE
    ) STRICT;`;

    this.#db.exec(createTableQuery);
  }

  isTodoAlreadyExist(todo_name) {
    const isExist = this.#db.prepare(
      "SELECT * FROM todos WHERE todo_name = ?", // get count
    ).get(todo_name);
    return !!isExist;
  }

  addTodo({ todo_name, todo_desc }) {
    if (this.#db === undefined || todo_name === undefined) {
      throw new Error("db is undefined");
    }
    if (this.isTodoAlreadyExist(todo_name)) {
      throw new Error("TODO is Already Exist");
    }
    const addData = this.#db.prepare(`
      INSERT INTO todos (todo_name, todo_desc)
      VALUES (?, ?)
    `);

    addData.run(todo_name, todo_desc);
  }

  listTodo() {
    if (this.#db === undefined) {
      throw new Error("db is undefined");
    }
    const content = this.#db.prepare(`SELECT * FROM todos`).all();
    return { success: true, content };
  }

  deleteTodo({ todo_name }) {
    if (this.#db === undefined) {
      throw new Error("db is undefined");
    }
    const deleteQuery = this.#db.prepare(`
      delete from todos where todo_name = ?
      `);
    deleteQuery.run(todo_name);
  }

  addTask({ todo_name, task_name, task_desc }) {
    const todo = this.#getTodo(todo_name);

    const addTaskQuery = this.#db.prepare(`
      INSERT INTO task (todo_id, task_name, task_desc)
      VALUES (?, ?, ?)`);

    addTaskQuery.run(todo.id, task_name, task_desc);
  }

  addTaskInTodo({ todo_name, task_name, task_desc }) {
    if (this.#db === undefined || todo_name === undefined) {
      throw new Error(" doesn't exist");
    }
    if (!this.isTodoAlreadyExist(todo_name)) {
      throw new Error("todo doesn't exist");
    }
    const todo = this.#getTodo(todo_name);

    const addTaskQuery = this.#db.prepare(`
      INSERT INTO task (todo_id, task_name, task_desc)
      VALUES (?, ?, ?)`);

    addTaskQuery.run(todo.id, task_name, task_desc);
  }

  markTaskDone({ todo_name, task_name }) {
    if (this.#db === undefined || todo_name === undefined) {
      throw new Error(" doesn't exist");
    }
    if (!this.isTodoAlreadyExist(todo_name)) {
      throw new Error("todo doesn't exist");
    }

    const todo = this.#getTodo(todo_name);

    const updateTaskQuery = this.#db.prepare(`
      UPDATE task
      SET complete = 'done'
      WHERE task_name = ? AND todo_id = ?
    `);
    updateTaskQuery.run(task_name, todo.id); // toggle
  }

  listTasks({ todo_name }) {
    const todo = this.#getTodo(todo_name);

    const content = this.#db.prepare(`SELECT * FROM task where todo_id = ?`)
      .all(
        todo.id,
      );

    return { success: true, content };
  }

  deleteTask({ todo_name, task_name }) {
    const todo = this.#getTodo(todo_name);

    this.#db.prepare(`
  DELETE FROM task WHERE todo_id = ? AND task_name = ?
  `).run(todo.id, task_name);

    return { success: true };
  }
}
