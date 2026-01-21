export class sqLiteTodoClass {
  createToDoTable(db) {
    if (!db) throw new Error("db is undefined");

    db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      todo_name TEXT NOT NULL UNIQUE,
      todo_desc TEXT NOT NULL
    ) STRICT;
  `);
  }

  createTasksTable(db) {
    if (!db) throw new Error("db is undefined");
    const todosPresent = db.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    ).get("todos");

    if (!todosPresent) {
      throw new Error("todos  is not present");
    }
    db.exec(`
    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      todo_id INTEGER NOT NULL,
      task_name TEXT NOT NULL,
      task_desc TEXT NOT NULL,
      complete TEXT NOT NULL DEFAULT 'false',
      FOREIGN KEY (todo_id) REFERENCES todos(id)
        ON DELETE CASCADE
    ) STRICT;
  `);
  }

  isToDoAlreadyExist(db, todo_name) {
    const isExist = db.prepare(
      "SELECT * FROM todos WHERE todo_name = ?",
    ).get(todo_name);
    return !!isExist;
  }
  createToDo(db, { todo_name, todo_desc }) {
    if (db === undefined || todo_name === undefined) {
      throw new Error("db is undefined");
    }
    if (this.isToDoAlreadyExist(db, todo_name)) {
      throw new Error("TODO is Already Exist");
    }

    const addData = db.prepare(`
      INSERT INTO todos (todo_name, todo_desc)
      VALUES (?, ?)
    `);

    addData.run(todo_name, todo_desc);
  }

  listTodo(db) {
    if (db === undefined) {
      throw new Error("db is undefined");
    }
    const display = db.prepare(`SELECT * FROM todos`).all();
    return display;
  }
  deleteTodo(db, { todo_name }) {
    if (db === undefined) {
      throw new Error("db is undefined");
    }
    const deleteQuery = db.prepare(`
      delete from todos where todo_name = ?
      `);
    deleteQuery.run(todo_name);
  }
  addTaskInTodo(db, { todo_name, task_name, task_desc }) {
    if (db === undefined || todo_name === undefined) {
      throw new Error(" doesn't exist");
    }
    if (!this.isToDoAlreadyExist(db, todo_name)) {
      throw new Error("todo doesn't exist");
    }
    const todo = db.prepare(`SELECT id FROM todos WHERE todo_name = ?`).get(
      todo_name,
    );

    const addTaskQuery = db.prepare(`
  INSERT INTO task (todo_id, task_name, task_desc)
  VALUES (?, ?, ?)
`);

    addTaskQuery.run(todo.id, task_name, task_desc);
  }
  markTaskASdone(db, { todo_name, task_name }) {
    if (db === undefined || todo_name === undefined) {
      throw new Error(" doesn't exist");
    }
    if (!this.isToDoAlreadyExist(db, todo_name)) {
      throw new Error("todo doesn't exist");
    }

    const todo = db.prepare(`SELECT id FROM todos WHERE todo_name = ?`).get(
      todo_name,
    );

    const updateTaskQuery = db.prepare(`
  UPDATE task
  SET complete = 'done'
  WHERE task_name = ? AND todo_id = ?
`);
    updateTaskQuery.run(task_name, todo.id);
  }

  listTaskOfATodo(db, { todo_name }) {
    const todo = db.prepare(`SELECT id FROM todos WHERE todo_name = ?`).get(
      todo_name,
    );
    const display = db.prepare(`SELECT * FROM task where todo_id = ?`).all(
      todo.id,
    );
    return display;
  }
  deleteTask(db, { todo_name, task_name }) {
    const todo = db.prepare(`SELECT id FROM todos WHERE todo_name = ?`).get(
      todo_name,
    );
    db.prepare(`
  delete from task where todo_id = ? and task_name = ?
  `).run(todo.id, task_name);
    return { success: true };
  }
}
