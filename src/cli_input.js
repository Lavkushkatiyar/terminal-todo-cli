import { select } from "npm:@inquirer/prompts";
import { operations } from "../terminal-ui/constants.js";

import {
  chooseDatabase,
  getTodosChoicesFromHandler,
} from "../terminal-ui/prompts.js";
import { collectArgsForOperation } from "../terminal-ui/collect_args.js";
import { manageTodoMenu } from "../terminal-ui/manager_menu.js";
import { todoManager } from "./todo_manager.js";

export const runCli = async (todoHandler, databaseChoice, db) => {
  while (true) {
    try {
      const todosList = todoHandler.listTodo().content || [];
      const todosExist = todosList.length > 0;
      const allowedTaskOps = new Set([
        "addTaskInTodo",
        "listTasks",
        "markTaskDone",
        "deleteTask",
        "deleteTodo",
      ]);
      const choices = operations.filter((
        op,
      ) => (todosExist ? true : !allowedTaskOps.has(op.value)));
      const operation = await select({
        message: `Database: ${databaseChoice} — Select operation`,
        choices,
        loop: false,
        limit: 10,
      });
      console.clear();
      if (operation === "exit") {
        console.log("Goodbye");
        break;
      }
      if (operation === "changeDB") {
        databaseChoice = await chooseDatabase();
        continue;
      }
      if (operation === "listTodo") {
        const todos = getTodosChoicesFromHandler(todoHandler);
        if (todos.length === 0) {
          await todoManager(todoHandler, ["listTodo"]);
          continue;
        }
        const todoChoiceOptions = [
          { name: "Show all todos (raw list)", value: "__SHOW_ALL__" },
          ...todos,
          { name: "Back to main menu", value: "__BACK__" },
        ];
        const chosen = await select({
          message: "Select a Todo to manage (or show all):",
          choices: todoChoiceOptions,
          loop: false,
        });
        if (chosen === "__BACK__") continue;
        if (chosen === "__SHOW_ALL__") {
          await todoManager(todoHandler, ["listTodo"]);
          continue;
        }
        await manageTodoMenu(todoHandler, chosen);
        continue;
      }
      const args = await collectArgsForOperation(todoHandler, operation);
      const userChoice = [operation, ...args];
      await todoManager(todoHandler, userChoice);
    } catch (err) {
      console.log(err.message);
    }
  }
};
