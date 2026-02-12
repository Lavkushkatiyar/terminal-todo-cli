import { parser } from "./parser.js";

export const todoManager = (todoService, cliArgs) => {
  const { command, ...options } = parser(cliArgs);
  let list;
  switch (command) {
    case "listTodo":
      list = todoService.listTodo(options);
      break;
    case "listTasks":
      list = todoService.listTasks(options);
      break;
    case "addTodo":
      todoService.addTodo(options);
      break;
    case "addTaskInTodo":
      todoService.addTaskInTodo(options);
      break;
    case "markTaskDone":
      todoService.markTaskDone(options);
      break;
    case "deleteTask":
      todoService.deleteTask(options);
      break;
    case "deleteTodo":
      todoService.deleteTodo(options);
      break;

    default:
      throw new Error("command is Invalid");
  }
  if (list && command === "listTodo") {
    const todos = list.content.map((
      { id, todo_name, todo_desc },
    ) => ({
      id,
      todo_name,
      todo_desc,
    }));
    console.table(todos);
    return;
  }
  if (list) console.table(list.content);
};
