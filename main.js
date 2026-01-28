import { DatabaseSync } from "node:sqlite";
import { chooseDatabase, runCli } from "./src/cli-input.js";
import { inMemoryTodoStore } from "./src/memory.js";
import { SqliteTodoStore } from "./src/sqlite-class.js";

export const main = async () => {
  const databaseChoice = await chooseDatabase();
  if (databaseChoice === "inMemory") {
    let db;
    const todoService = new inMemoryTodoStore();
    db = todoService.createDb();
    db = todoService.initializeDb(db);
    runCli(db, todoService, databaseChoice);
  } else {
    const db = new DatabaseSync("ToDo.db");
    const todoService = new SqliteTodoStore();
    todoService.createToDoTable(db);
    todoService.createTasksTable(db);

    runCli(db, todoService, databaseChoice);
  }
};
main();
