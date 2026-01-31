import { input, select } from "npm:@inquirer/prompts";

import { todoManager } from "./todo-manager.js";

export const dbChoices = [
  { name: "In-Memory", value: "inMemory", description: "Uses in-memory DB" },
  {
    name: "SQLite 3",
    value: "sqlite",
    description: "Use sqlite Database",
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

export const chooseDatabase = async () => {
  return await select({
    message: "Select Database",
    choices: dbChoices,
    loop: false,
  });
};

const collectArgsForOperation = async (handler, op) => {
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
      const todos = handler.listTodo().content.map((x) => ({
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
      const todos = handler.listTodo().content.map((x) => ({
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
      const todos = handler.listTodo().content.map((x) => ({
        name: x.todo_name,
        value: x.todo_name,
      }));
      if (todos.length === 0) throw new Error("Create a Todo first ");
      const todo_name = await select({
        message: "choose ToDo",
        choices: todos,
        required: true,
      });

      const task = handler.listTasks({ todo_name }).content.map((x) => ({
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
      const todos = handler.listTodo().content.map((x) => ({
        name: x.todo_name,
        value: x.todo_name,
      }));
      if (todos.length === 0) throw new Error("Create a Todo first ");

      const todo_name = await select({
        message: "choose ToDo",
        choices: todos,
        required: true,
      });

      const task = handler.listTasks({ todo_name }).content.map((x) => ({
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
      const todos = handler.listTodo().content.map((x) => ({
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

/**
 * Manage a single todo with a mini-menu.
 * Only UI logic lives here; all actions call todoManager exactly as before.
 */
const manageTodoMenu = async (todoHandler, todo_name) => {
  const manageActions = [
    { name: "Create Task", value: "addTaskInToDo" },
    { name: "List Tasks", value: "listTasks" },
    { name: "Mark Task Done", value: "markTaskDone" },
    { name: "Delete Task", value: "deleteTask" },
    { name: "Delete Todo", value: "deleteTodo" },
    { name: "Back", value: "back" },
  ];

  while (true) {
    try {
      const choice = await select({
        message: `Manage ToDo: ${todo_name} — choose action`,
        choices: manageActions,
        loop: false,
      });

      if (choice === "back") return;

      switch (choice) {
        case "addTaskInToDo": {
          const taskName = await input({
            message: "Enter Task name:",
            required: true,
          });
          const taskDesc = await input({
            message: "Enter Task description:",
            required: false,
          });
          await todoManager(todoHandler, [
            "addTaskInToDo",
            todo_name,
            taskName,
            taskDesc ?? "",
          ]);
          break;
        }
        case "listTasks": {
          await todoManager(todoHandler, ["listTasks", todo_name]);
          break;
        }
        case "markTaskDone": {
          const tasks = todoHandler
            .listTasks({ todo_name })
            .content.map((t) => ({ name: t.task_name, value: t.task_name }));
          if (tasks.length === 0) {
            console.log("Create a Task first");
            break;
          }
          const taskName = await select({
            message: "Select Task to mark done:",
            choices: tasks,
            required: true,
          });
          await todoManager(todoHandler, [
            "markTaskDone",
            todo_name,
            taskName,
          ]);
          break;
        }
        case "deleteTask": {
          const tasks = todoHandler
            .listTasks({ todo_name })
            .content.map((t) => ({ name: t.task_name, value: t.task_name }));
          if (tasks.length === 0) {
            console.log("Create a Task first");
            break;
          }
          const taskName = await select({
            message: "Select Task to delete:",
            choices: tasks,
            required: true,
          });
          await todoManager(todoHandler, [
            "deleteTask",
            todo_name,
            taskName,
          ]);
          break;
        }
        case "deleteTodo": {
          await todoManager(todoHandler, ["deleteTodo", todo_name]);
          return;
        }
        default:
          return;
      }
    } catch (err) {
      console.log(err.message);
    }
  }
};

export const runCli = async (todoHandler, databaseChoice, db) => {
  while (true) {
    try {
      const todosList = todoHandler.listTodo().content || [];
      const todosExist = todosList.length > 0;

      const allowedTaskOps = new Set([
        "addTaskInToDo",
        "listTasks",
        "markTaskDone",
        "deleteTask",
        "deleteTodo",
      ]);
      const choices = operations.filter((op) =>
        todosExist ? true : !allowedTaskOps.has(op.value)
      );

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
        const todos = todoHandler.listTodo().content.map((x) => ({
          name: x.todo_name,
          value: x.todo_name,
        }));

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
          message: "Select a ToDo to manage (or show all):",
          choices: todoChoiceOptions,
          loop: false,
        });

        if (chosen === "__BACK__") {
          continue;
        }
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
