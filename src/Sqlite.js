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
}
