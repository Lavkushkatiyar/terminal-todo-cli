import { DatabaseSync } from "node:sqlite";

import { InMemoryTodoStore } from "./src/memory.js";
import { SqliteTodoStore } from "./src/sqlite_class.js";
import { chooseDatabase } from "./terminal-ui/prompts.js";
import { runCli } from "./src/cli_input.js";

export const main = async () => {
  const databaseChoice = await chooseDatabase();

  if (databaseChoice === "inMemory") {
    const todoService = new InMemoryTodoStore();
    runCli(todoService, databaseChoice);
  } else {
    const db = new DatabaseSync("Todo_db.db");
    const todoService = new SqliteTodoStore(db);
    todoService.createTodoTable();
    todoService.createTasksTable();

    runCli(todoService, databaseChoice);
  }
};
main();
