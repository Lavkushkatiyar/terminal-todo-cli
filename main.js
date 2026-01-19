import { input, select } from "npm:@inquirer/prompts";
const database = await select({
  message: "Select Database",
  choices: [
    {
      name: "memoryDataBase",
      value: "inMemory",
      description: "UsesInMemory",
    },
    {
      name: "SQLite 3",
      value: "sqlite",
      description: "Use sqlite Database",
      disabled: "will implement soon",
    },
  ],
});

let selectChoice;

if (database === "inMemory") {
  selectChoice = await select({
    message: "operations To Perform",
    choices: [
      {
        name: "Initialize DB",
        value: "initializeDB",
        description: "Creates todos table",
      },
      {
        name: "Add Todo",
        value: "addToDo",
        description: "Add a new todo (todo_name, todo_desc)",
      },
      {
        name: "List Todos",
        value: "listTodo",
        description: "List all todos",
      },
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
    ],
  });
}
export const userChoice = [database, selectChoice];
if (selectChoice !== "initializeDB") {
  const args = await input({ message: "enter the values separated by space" });
  userChoice.push(...args.split(" "));
}
console.log({ userChoice });
