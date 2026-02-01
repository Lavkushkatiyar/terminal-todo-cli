const handleTodoAdd = (args, parser) => {
  parser.todo_name = args[0];
  parser.todo_desc = args[1];
};
const handleAddTask = (args, parser) => {
  parser.todo_name = args[0];
  parser.task_name = args[1];
  parser.task_desc = args[2];
};
const handleListTodo = () => true;
const handleListingTask = (args, parser) => {
  parser.todo_name = args[0];
};
const handleMarkingDone = (args, parser) => {
  parser.todo_name = args[0];
  parser.task_name = args[1];
};
const handleDelete = (args, parser) => {
  parser.todo_name = args[0];
  parser.task_name = args[1];
};
const handleDeleteTodo = (args, parser) => {
  parser.todo_name = args[0];
};

const options = {
  "addToDo": handleTodoAdd,
  "addTaskInToDo": handleAddTask,
  "listTodo": handleListTodo,
  "listTasks": handleListingTask,
  "markTaskDone": handleMarkingDone,
  "deleteTask": handleDelete,
  "deleteTodo": handleDeleteTodo,
};

export const parser = (args) => {
  const parsed = {
    command: "",
    todo_name: "",
    todo_desc: "",
    task_name: "",
    task_desc: "",
  };
  parsed.command = args[0];
  if (!options[parsed.command]) {
    throw new Error("command not found");
  }
  options[parsed.command](args.slice(1), parsed);

  return parsed;
};
