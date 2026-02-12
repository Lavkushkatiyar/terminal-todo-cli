import { select } from "npm:@inquirer/prompts";
import { manageActions } from "./constants.js";
import {
  getTasksChoicesFromHandler,
  promptInput,
  promptSelect,
} from "./prompts.js";
import { todoManager } from "../src/todo_manager.js";

export const handleAddTaskInTodo = async (todoHandler, todo_name) => {
  const taskName = await promptInput("Enter Task name:", true);
  const taskDesc = await promptInput("Enter Task description:", false);
  await todoManager(todoHandler, [
    "addTaskInTodo",
    todo_name,
    taskName,
    taskDesc ?? "",
  ]);
};

export const handleListTasks = async (todoHandler, todo_name) =>
  await todoManager(todoHandler, ["listTasks", todo_name]);

export const handleMarkTaskDone = async (todoHandler, todo_name) => {
  const tasks = getTasksChoicesFromHandler(todoHandler, todo_name);
  if (tasks.length === 0) {
    console.log("Create a Task first");
    return;
  }
  const taskName = await select({
    message: "Select Task to mark done:",
    choices: tasks,
    required: true,
  });
  await todoManager(todoHandler, ["markTaskDone", todo_name, taskName]);
};

export const handleDeleteTask = async (todoHandler, todo_name) => {
  const tasks = getTasksChoicesFromHandler(todoHandler, todo_name);
  if (tasks.length === 0) {
    console.log("Create a Task first");
    return;
  }
  const taskName = await select({
    message: "Select Task to delete:",
    choices: tasks,
    required: true,
  });
  await todoManager(todoHandler, ["deleteTask", todo_name, taskName]);
};

export const handleDeleteTodo = async (todoHandler, todo_name) =>
  await todoManager(todoHandler, ["deleteTodo", todo_name]);
const manageActionHandlers = {
  addTaskInTodo: handleAddTaskInTodo,
  listTasks: handleListTasks,
  markTaskDone: handleMarkTaskDone,
  deleteTask: handleDeleteTask,
  deleteTodo: handleDeleteTodo,
};

export const manageTodoMenu = async (todoHandler, todo_name) => {
  while (true) {
    try {
      const choice = await promptSelect(
        `Manage Todo: ${todo_name} — choose action`,
        manageActions,
      );

      if (choice === "back") {
        return;
      }
      const actionHandler = manageActionHandlers[choice];

      if (!actionHandler) {
        return;
      }

      await actionHandler(todoHandler, todo_name);

      if (choice === "deleteTodo") {
        return;
      }
    } catch (err) {
      console.log(err.message);
    }
  }
};
