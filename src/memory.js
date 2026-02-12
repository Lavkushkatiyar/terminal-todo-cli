export class InMemoryTodoStore {
  #db;
  #nextId = 1;

  constructor() {
    this.#db = { tables: { todos: [] } };
  }

  findTodoIndex(todoList, todo_name) {
    const index = todoList.findIndex(
      (x) => x.todo_name === todo_name,
    );

    if (index === -1) {
      throw new Error("Todo not found");
    }

    return index;
  }

  findTaskIndex(taskList, task_name) {
    const index = taskList.findIndex(
      (x) => x.task_name === task_name,
    );

    if (index === -1) {
      throw new Error("Task not found");
    }

    return index;
  }

  addTodo({ todo_name, todo_desc }) {
    this.#db.tables.todos.push({
      id: this.#nextId++,
      todo_name,
      todo_desc,
      tasks: [],
    });

    return { success: true };
  }

  listTodo() {
    return {
      success: true,
      content: this.#db.tables.todos,
    };
  }

  addTaskInTodo({ todo_name, task_name, task_desc }) {
    const todoIndex = this.findTodoIndex(
      this.#db.tables.todos,
      todo_name,
    );

    this.#db.tables.todos[todoIndex].tasks.push({
      task_name,
      task_desc,
      completed: false,
    });

    return { success: true };
  }

  listTasks({ todo_name }) {
    const todoIndex = this.findTodoIndex(
      this.#db.tables.todos,
      todo_name,
    );

    return {
      success: true,
      content: this.#db.tables.todos[todoIndex].tasks,
    };
  }

  markTaskDone({ todo_name, task_name }) {
    const todoIndex = this.findTodoIndex(
      this.#db.tables.todos,
      todo_name,
    );

    const taskList = this.#db.tables.todos[todoIndex].tasks;
    const taskIndex = this.findTaskIndex(taskList, task_name);

    taskList[taskIndex].completed = true;

    return { success: true };
  }

  deleteTask({ todo_name, task_name }) {
    const todoIndex = this.findTodoIndex(
      this.#db.tables.todos,
      todo_name,
    );

    const taskList = this.#db.tables.todos[todoIndex].tasks;
    const taskIndex = this.findTaskIndex(taskList, task_name);

    taskList.splice(taskIndex, 1);

    return { success: true };
  }

  deleteTodo({ todo_name }) {
    const todoIndex = this.findTodoIndex(
      this.#db.tables.todos,
      todo_name,
    );

    this.#db.tables.todos.splice(todoIndex, 1);

    return { success: true };
  }
}
