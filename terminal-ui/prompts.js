import { input, select } from "npm:@inquirer/prompts";
import { dbChoices } from "./constants.js";
export const chooseDatabase = async () =>
  await select({
    message: "Select Database",
    choices: dbChoices,
    loop: false,
  });

export const promptInput = async (message, required = false) =>
  await input({ message, required });

export const promptSelect = async (message, choices) =>
  await select({ message, choices, required: true });

export const mapTodosToChoiceArray = (todoList) =>
  todoList.map((x) => ({ name: x.todo_name, value: x.todo_name }));

export const getTodosChoicesFromHandler = (handler) =>
  mapTodosToChoiceArray(handler.listTodo().content);

export const getTasksChoicesFromHandler = (handler, todo_name) =>
  handler.listTasks({ todo_name }).content.map((task) => ({
    name: task.task_name,
    value: task.task_name,
  }));
