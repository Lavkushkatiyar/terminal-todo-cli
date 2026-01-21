import { input, select } from "npm:@inquirer/prompts";

import { todoManager } from "./Todo_manager.js";

const dbChoices = [
  { name: "In-Memory", value: "inMemory", description: "Uses in-memory DB" },
  {
    name: "SQLite 3",
    value: "sqlite",
    description: "Use sqlite Database",
    disabled: "will implement soon",
  },
];

const operations = [
  {
    name: "Add Todo",
    value: "addToDo",
    description: "Add a new todo (todo_title, todo_desc)",
  },
  { name: "List Todos", value: "listTodo", description: "List all todos" },
  {
    name: "Add Task In Todo",
    value: "addTaskInToDo",
    description: "Add task into a todo (todo_name, task_name, task_desc)",
  },
  {
    name: "List Tasks",
    value: "listTasks",
    description: "List tasks of a todo (todo_name)",
  },
  {
    name: "Mark Task Done",
    value: "markTaskDone",
    description: "Mark task done (todo_name, task_name)",
  },
  {
    name: "Delete Task",
    value: "deleteTask",
    description: "Delete a task (todo_name, task_name)",
  },
  {
    name: "Delete Todo",
    value: "deleteTodo",
    description: "Delete a todo (todo_name)",
  },
  {
    name: "Change Database",
    value: "changeDB",
    description: "Select different database",
  },
  { name: "Exit", value: "exit", description: "Quit the app" },
];

const chooseDatabase = async () => {
  const db = await select({
    message: "Select Database",
    choices: dbChoices,
    loop: false,
  });
  return db;
};

const collectArgsForOperation = async (db, handler, op) => {
  switch (op) {
    case "addToDo": {
      const todoTitle = await input({
        message: "Enter ToDo title:",
        required: true,
      });
      const description = await input({
        message: "Enter description:",
        required: false,
      });
      return [todoTitle, description ?? ""];
    }
    case "listTodo":
      return [];
    case "addTaskInToDo": {
      const todos = handler.listTodo(db).content.map((x) => ({
        name: x.todo_name,
        value: x.todo_name,
      }));
      if (todos.length === 0) throw new Error("Create a Todo first ");

      const todoName = await select({
        message: "choose ToDo",
        choices: todos,

        required: true,
      });

      const taskName = await input({
        message: "Enter Task name:",
        required: true,
      });
      const taskDesc = await input({
        message: "Enter Task description:",
        required: false,
      });
      return [todoName, taskName, taskDesc ?? ""];
    }
    case "listTasks": {
      const todos = handler.listTodo(db).content.map((x) => ({
        name: x.todo_name,
        value: x.todo_name,
      }));
      if (todos.length === 0) throw new Error("Create a Todo first ");

      const todoName = await select({
        message: "choose ToDo",
        choices: todos,
        required: true,
      });
      return [todoName];
    }
    case "markTaskDone": {
      const todos = handler.listTodo(db).content.map((x) => ({
        name: x.todo_name,
        value: x.todo_name,
      }));
      if (todos.length === 0) throw new Error("Create a Todo first ");
      const todo_name = await select({
        message: "choose ToDo",
        choices: todos,
        required: true,
      });

      const task = handler.listTasks(db, { todo_name }).content.map((x) => ({
        name: x.task_name,
        value: x.task_name,
      }));
      if (task.length === 0) throw new Error("Create a Task First");
      const taskName = await select({
        choices: task,
        message: "Select Task :",
        required: true,
      });
      return [todo_name, taskName];
    }
    case "deleteTask": {
      const todos = handler.listTodo(db).content.map((x) => ({
        name: x.todo_name,
        value: x.todo_name,
      }));
      if (todos.length === 0) throw new Error("Create a Todo first ");

      const todo_name = await select({
        message: "choose ToDo",
        choices: todos,
        required: true,
      });

      const task = handler.listTasks(db, { todo_name }).content.map((x) => ({
        name: x.task_name,
        value: x.task_name,
      }));
      if (task.length === 0) throw new Error("Create a Task first ");

      const taskName = await select({
        choices: task,
        message: "Enter Task name or id:",
        required: true,
      });
      return [todo_name, taskName];
    }
    case "deleteTodo": {
      const todos = handler.listTodo(db).content.map((x) => ({
        name: x.todo_name,
        value: x.todo_name,
      }));
      if (todos.length === 0) throw new Error("Create a Todo first ");

      const todo_name = await select({
        message: "choose ToDo",
        choices: todos,
        required: true,
      });

      return [todo_name];
    }
    default:
      return [];
  }
};

export const runCli = async (db, todoHandler) => {
  let database = await chooseDatabase();
  while (true) {
    try {
      const operation = await select({
        message: `Database: ${database} — Select operation`,
        choices: operations,
        loop: false,
        limit: 10,
      });
      console.clear();

      if (operation === "exit") {
        console.log("Goodbye");
        break;
      }

      if (operation === "changeDB") {
        database = await chooseDatabase();
        continue;
      }

      const args = await collectArgsForOperation(db, todoHandler, operation);
      const userChoice = [operation, ...args];
      await todoManager(db, todoHandler, userChoice);
    } catch (err) {
      console.log(err.message);
    }
  }
};
