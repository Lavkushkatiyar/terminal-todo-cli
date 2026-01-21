import { parser } from "./parser.js";

export const todoManager = (db, todoService, cliArgs) => {
  const { command, ...options } = parser(cliArgs);
  let list;
  switch (command) {
    case "listTodo":
      list = todoService.listTodo(db, options);
      break;
    case "listTasks":
      list = todoService.listTasks(db, options);
      break;
    case "addToDo":
      todoService.addToDo(db, options);
      break;
    case "addTaskInToDo":
      todoService.addTaskInToDo(db, options);
      break;
    case "markTaskDone":
      todoService.markTaskDone(db, options);
      break;
    case "deleteTask":
      todoService.deleteTask(db, options);
      break;
    case "deleteTodo":
      todoService.deleteTodo(db, options);
      break;

    default:
      throw new Error("command is Invalid");
  }
  if (list && command === "listTodo") {
    const todos = list.content.map((
      { todo_id, todo_name, todo_desc },
    ) => ({
      todo_id,
      todo_name,
      todo_desc,
    }));
    console.table(todos);
    return;
  }
  if (list) console.table(list.content);
};
