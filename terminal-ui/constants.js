export const dbChoices = [
  { name: "In-Memory", value: "inMemory", description: "Uses in-memory DB" },
  { name: "SQLite 3", value: "sqlite", description: "Use sqlite Database" },
];

export const operations = [
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

export const manageActions = [
  { name: "Create Task", value: "addTaskInToDo" },
  { name: "List Tasks", value: "listTasks" },
  { name: "Mark Task Done", value: "markTaskDone" },
  { name: "Delete Task", value: "deleteTask" },
  { name: "Delete Todo", value: "deleteTodo" },
  { name: "Back", value: "back" },
];
