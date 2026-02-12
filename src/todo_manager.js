import { parser } from "./parser.js";

const COMMAND_HANDLERS = {
  listTodo: (service, options) => service.listTodo(options),
  listTasks: (service, options) => service.listTasks(options),
  addTodo: (service, options) => service.addTodo(options),
  addTaskInTodo: (service, options) => service.addTaskInTodo(options),
  markTaskDone: (service, options) => service.markTaskDone(options),
  deleteTask: (service, options) => service.deleteTask(options),
  deleteTodo: (service, options) => service.deleteTodo(options),
};

const printTodos = (result) => {
  if (!result.success) {
    console.error(result.error);
    return;
  }

  if (!result.content) {
    console.table([]);
    return;
  }

  const rows = result.content.map(({ id, todo_name, todo_desc }) => {
    return {
      id,
      todo_name,
      todo_desc,
    };
  });

  console.table(rows);
};

const printList = (result) => {
  if (!result.success) {
    console.error(result.error);
    return;
  }

  if (!result.content) {
    console.table([]);
    return;
  }

  console.table(result.content);
};

export const todoManager = (service, cliArgs) => {
  const { command, ...options } = parser(cliArgs);

  const action = COMMAND_HANDLERS[command];

  if (!action) {
    throw new Error("Invalid command");
  }

  const result = action(service, options);

  if (!result.success) {
    throw new Error(result.error);
  }

  if (command === "listTodo") {
    printTodos(result);
    return;
  }

  if (command === "listTasks") {
    printList(result);
    return;
  }
};
