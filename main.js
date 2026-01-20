import { runCli } from "./src/CLIinput.js";
import { memoryTodoClass } from "./src/memory.js";

export const main = () => {
  let db;
  const todoService = new memoryTodoClass();
  db = todoService.createDB();
  db = todoService.initializeDB(db);
  runCli(db, memoryTodoClass);
};
main();
