import {
  getTasksChoicesFromHandler,
  getTodosChoicesFromHandler,
  promptInput,
  promptSelect,
} from "./prompts.js";

export const collectArgsForAddToDo = async () => {
  const todoTitle = await promptInput("Enter ToDo title:", true);
  const description = await promptInput("Enter description:", false);
  return [todoTitle, description ?? ""];
};

export const collectArgsForAddTaskInToDo = async (handler) => {
  const todos = getTodosChoicesFromHandler(handler);
  if (todos.length === 0) throw new Error("Create a Todo first");
  const todoName = await promptSelect("Choose ToDo", todos);
  const taskName = await promptInput("Enter Task name:", true);
  const taskDesc = await promptInput("Enter Task description:", false);
  return [todoName, taskName, taskDesc ?? ""];
};

export const collectArgsForListTasks = async (handler) => {
  const todos = getTodosChoicesFromHandler(handler);
  if (todos.length === 0) throw new Error("Create a Todo first");
  const todoName = await promptSelect("Choose ToDo", todos);
  return [todoName];
};

export const collectArgsForMarkTaskDone = async (handler) => {
  const todos = getTodosChoicesFromHandler(handler);
  if (todos.length === 0) throw new Error("Create a Todo first");
  const todo_name = await promptSelect("Choose ToDo", todos);
  const tasks = getTasksChoicesFromHandler(handler, todo_name);
  if (tasks.length === 0) throw new Error("Create a Task First");
  const taskName = await promptSelect("Select Task :", tasks);
  return [todo_name, taskName];
};

export const collectArgsForDeleteTask = async (handler) => {
  const todos = getTodosChoicesFromHandler(handler);
  if (todos.length === 0) throw new Error("Create a Todo first");
  const todo_name = await promptSelect("Choose ToDo", todos);
  const tasks = getTasksChoicesFromHandler(handler, todo_name);
  if (tasks.length === 0) throw new Error("Create a Task first");
  const taskName = await promptSelect("Enter Task name or id:", tasks);
  return [todo_name, taskName];
};

export const collectArgsForDeleteTodo = async (handler) => {
  const todos = getTodosChoicesFromHandler(handler);
  if (todos.length === 0) throw new Error("Create a Todo first");
  const todo_name = await promptSelect("Choose ToDo", todos);
  return [todo_name];
};

export const collectArgsForOperation = async (handler, op) => {
  switch (op) {
    case "addToDo":
      return await collectArgsForAddToDo();
    case "listTodo":
      return [];
    case "addTaskInToDo":
      return await collectArgsForAddTaskInToDo(handler);
    case "listTasks":
      return await collectArgsForListTasks(handler);
    case "markTaskDone":
      return await collectArgsForMarkTaskDone(handler);
    case "deleteTask":
      return await collectArgsForDeleteTask(handler);
    case "deleteTodo":
      return await collectArgsForDeleteTodo(handler);
    default:
      return [];
  }
};
