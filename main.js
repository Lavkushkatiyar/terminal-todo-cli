import { DatabaseSync } from "node:sqlite";
import { chooseDatabase, runCli } from "./src/CLIinput.js";
import { memoryTodoClass } from "./src/memory.js";
import { sqLiteTodoClass } from "./src/Sqlite.js";

export const main = async () => {
  const databaseChoice = await chooseDatabase();
  if (databaseChoice === "inMemory") {
    let db;
    const todoService = new memoryTodoClass();
    db = todoService.createDB();
    db = todoService.initializeDB(db);
    runCli(db, todoService, databaseChoice);
  } else {
    const db = new DatabaseSync("ToDo.db");
    const todoService = new sqLiteTodoClass();
    todoService.createToDoTable(db);
    todoService.createTasksTable(db);

    runCli(db, todoService, databaseChoice);
  }
};
main();
