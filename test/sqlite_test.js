import { DatabaseSync } from "node:sqlite";
import { assertEquals, assertThrows } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { SqliteTodoStore } from "../src/sqlite_class.js";

describe("CreateTABLE : branch of Creating a table in the ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
  });

  it("CreateTodoTable:  creating the todos table", () => {
    memory.createTodoTable(mockDb);
    const result = mockDb.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    ).get("todos");
    assertEquals(!!result, true);
  });

  it("CreateTodoTable:  creating the todos table and referenced tasks table ", () => {
    memory.createTodoTable();
    memory.createTasksTable();
    const todosPresent = mockDb.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    ).get("todos");
    const tasksPresent = mockDb.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    ).get("todos");
    assertEquals(!!todosPresent, true);
    assertEquals(!!tasksPresent, true);
  });

  it("CreateTaskTable:  creating tasks table without todos should return error ", () => {
    assertEquals(memory.createTasksTable(mockDb), {
      error: "todos is not present",
      success: false,
    });
  });

  it("CreateTodoTable:  should return error provided undefined table ", () => {
    memory = new SqliteTodoStore(undefined);
    assertEquals(memory.createTodoTable(), {
      error: "failed to create todo table",
      success: false,
    });
  });
});

describe("Add_Todo : adding todos into todos table", () => {
  let memory;
  let mockDb;

  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createTodoTable();
  });

  it("Add_Todo: should insert a todo into todos table", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };

    const response = memory.addTodo(todo);

    const result = mockDb.prepare(
      "SELECT * FROM todos WHERE todo_name = ?",
    ).get("Morning");

    assertEquals(response.success, true);
    assertEquals(!!result, true);
  });

  it("Add_Todo: should allow inserting multiple todos", () => {
    const todo1 = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };

    const todo2 = {
      todo_name: "Evening",
      todo_desc: "thingsTO do in evening",
    };

    const res1 = memory.addTodo(todo1);
    const res2 = memory.addTodo(todo2);

    const morningTodo = mockDb.prepare(
      "SELECT * FROM todos WHERE todo_name = ?",
    ).get("Morning");

    const eveningTodo = mockDb.prepare(
      "SELECT * FROM todos WHERE todo_name = ?",
    ).get("Evening");

    assertEquals(res1.success, true);
    assertEquals(res2.success, true);
    assertEquals(!!morningTodo, true);
    assertEquals(!!eveningTodo, true);
  });

  it("Add_Todo: should fail if todo already exists", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };

    memory.addTodo(todo);
    const response = memory.addTodo(todo);

    assertEquals(response.success, false);
    assertEquals(response.error, "TODO is Already Exist");
  });

  it("Add_Todo: should fail if todo_name is undefined", () => {
    const response = memory.addTodo({
      todo_name: undefined,
      todo_desc: "",
    });

    assertEquals(response.success, false);
    assertEquals(response.error, "todo is undefined");
  });
});

describe("List_Todo : branch of Listing todos table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createTodoTable();
  });
  it("List_Todo:  should List todos table (1 todo added)", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addTodo(todo);
    const todoTable = memory.listTodo().content;
    assertEquals(todoTable, [{
      id: 1,
      todo_desc: "thingsTO do in morning",
      todo_name: "Morning",
    }]);
  });
  it("List_Todo:  should List todos table (multiple todo added)", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addTodo(todo);
    const todoTable = memory.listTodo(mockDb).content;
    assertEquals(todoTable, [{
      id: 1,
      todo_desc: "thingsTO do in morning",
      todo_name: "Morning",
    }]);
  });
  it("List_Todo:  should List todos table (1 todo)", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    const todo1 = {
      todo_name: "evening",
      todo_desc: "thingsTO do in evening",
    };
    memory.addTodo(todo);
    memory.addTodo(todo1);
    const todoTable = memory.listTodo(mockDb).content;
    assertEquals(todoTable, [{
      id: 1,
      todo_desc: "thingsTO do in morning",
      todo_name: "Morning",
    }, {
      id: 2,
      todo_desc: "thingsTO do in evening",
      todo_name: "evening",
    }]);
  });

  it("List_Todo:  should return error provided undefined table ", () => {
    memory = new SqliteTodoStore(undefined);
    assertEquals(memory.listTodo(), {
      error: "failed to list todos",
      success: false,
    });
  });
});

describe("DELETE_Todo : branch of DELETING todos table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createTodoTable();
  });
  it("Delete_Todo:  should delete todos table given the todo_name", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addTodo(todo);
    memory.deleteTodo({ todo_name: todo.todo_name });
    const todoTable = memory.listTodo(mockDb).content;
    assertEquals(todoTable, []);
  });
  it("Delete_todo:  deleting the first todo only ", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    const todo1 = {
      todo_name: "evening",
      todo_desc: "thingsTO do in evening",
    };
    memory.addTodo(todo);
    memory.addTodo(todo1);

    memory.deleteTodo({ todo_name: todo.todo_name });

    const todoTable = memory.listTodo(mockDb).content;
    assertEquals(todoTable, [{
      id: 2,
      todo_desc: "thingsTO do in evening",
      todo_name: "evening",
    }]);
  });
  it("Delete_todo:  deleting multiple todos in the table", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    const todo1 = {
      todo_name: "evening",
      todo_desc: "thingsTO do in evening",
    };
    memory.addTodo(todo);
    memory.addTodo(todo1);
    memory.deleteTodo({ todo_name: todo.todo_name });
    memory.deleteTodo({ todo_name: todo1.todo_name });
    const todoTable = memory.listTodo(mockDb).content;
    assertEquals(todoTable, []);
  });

  it("Delete_todo:  should return error provided undefined table ", () => {
    assertThrows(() => memory.deleteTodo(undefined, {}));
  });
});

describe("addTaskInTodo : branch of adding task in  tasks table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createTodoTable();
    memory.createTasksTable();
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addTodo(todo);
  });
  it("addTaskInTodo : should add a task in todo given todo_name task_name", () => {
    const task = {
      todo_name: "Morning",
      task_name: "brush",
      task_desc: "do brush for 5 mintues",
    };

    memory.addTaskInTodo(task);

    const taskData = mockDb.prepare(`SELECT * FROM task`).all();

    assertEquals(taskData, [{
      complete: "false",
      id: 1,
      task_desc: "do brush for 5 mintues",
      task_name: "brush",
      todo_id: 1,
    }]);
    assertEquals(taskData.length, 1);
    assertEquals(taskData[0].task_name, "brush");
    assertEquals(taskData[0].task_desc, "do brush for 5 mintues");
  });
  it("addTaskInTodo : should add two  task in todo given todo_name task_name", () => {
    const task = {
      todo_name: "Morning",
      task_name: "brush",
      task_desc: "do brush for 5 mintues",
    };
    const task2 = {
      todo_name: "Morning",
      task_name: "bath",
      task_desc: "bath with cold water",
    };

    memory.addTaskInTodo(task);
    memory.addTaskInTodo(task2);

    const taskData = mockDb.prepare(`SELECT * FROM task`).all();

    assertEquals(taskData, [{
      complete: "false",
      id: 1,
      task_desc: "do brush for 5 mintues",
      task_name: "brush",
      todo_id: 1,
    }, {
      complete: "false",
      id: 2,
      task_desc: "bath with cold water",
      task_name: "bath",
      todo_id: 1,
    }]);
  });
  it("addTaskInTodo : adding one task  in two different todo  ", () => {
    const todo = {
      todo_name: "Evening",
      todo_desc: "Do something in Evening",
    };
    const task = {
      todo_name: "Morning",
      task_name: "brush",
      task_desc: "do brush for 5 mintues",
    };
    const task2 = {
      todo_name: "Evening",
      task_name: "bath",
      task_desc: "bath with cold water",
    };
    memory.addTodo(todo);
    memory.addTaskInTodo(task);
    memory.addTaskInTodo(task2);

    const taskData = mockDb.prepare(`SELECT * FROM task`).all();

    assertEquals(taskData, [{
      complete: "false",
      id: 1,
      task_desc: "do brush for 5 mintues",
      task_name: "brush",
      todo_id: 1,
    }, {
      complete: "false",
      id: 2,
      task_desc: "bath with cold water",
      task_name: "bath",
      todo_id: 2,
    }]);
  });

  it("addTaskInTodo:  should return error provided todo is not exist in the table ", () => {
    assertThrows(() =>
      memory.addTaskInTodo(undefined, {
        todo_name: "dosen't exist",
        task_name: "nothing",
        task_desc: "nothing",
      })
    );
  });
  it("addTaskInTodo:  should return error provided undefined table ", () => {
    assertThrows(() => memory.addTaskInTodo(undefined, {}));
  });
});

describe("listTasks : branch of listing task  ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createTodoTable(mockDb);
    memory.createTasksTable(mockDb);
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addTodo(todo);
    const task = {
      todo_name: "Morning",
      task_name: "brush",
      task_desc: "do brush for 5 mintues",
    };

    memory.addTaskInTodo(task);
  });

  it("listTasks:  listing all task of a todo ", () => {
    const listTasks = memory.listTasks({ todo_name: "Morning" }).content;
    const taskData = mockDb.prepare(`SELECT * FROM task`).all();

    assertEquals(listTasks, taskData);
  });
});

describe("markTaskDone : branch of marking task as done in task table  ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createTodoTable(mockDb);
    memory.createTasksTable(mockDb);
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addTodo(todo);
    const task = {
      todo_name: "Morning",
      task_name: "brush",
      task_desc: "do brush for 5 mintues",
    };

    memory.addTaskInTodo(task);
  });
  it("markTaskDone:  marking one task done in the task  ", () => {
    const task1 = {
      todo_name: "Morning",
      task_name: "bath",
      task_desc: "do brush for 5 mintues",
    };

    memory.addTaskInTodo(task1);

    memory.markTaskDone({ todo_name: "Morning", task_name: "brush" });
    memory.markTaskDone({ todo_name: "Morning", task_name: "bath" });

    const taskData = memory.listTasks({ todo_name: "Morning" }).content;

    assertEquals(taskData, [
      {
        complete: "done",
        id: 1,
        task_desc: "do brush for 5 mintues",
        task_name: "brush",
        todo_id: 1,
      },

      {
        complete: "done",
        id: 2,
        task_desc: "do brush for 5 mintues",
        task_name: "bath",
        todo_id: 1,
      },
    ]);
  });
  it("markTaskDone:  marking multiple of marking task as done in task table ", () => {
    memory.markTaskDone({ todo_name: "Morning", task_name: "brush" });

    const taskData = mockDb.prepare(`SELECT * FROM task`).all();

    assertEquals(taskData, [{
      complete: "done",
      id: 1,
      task_desc: "do brush for 5 mintues",
      task_name: "brush",
      todo_id: 1,
    }]);
  });

  it("markTaskDone:  should return error provided undefined table ", () => {
    assertThrows(() => memory.mark(undefined, {}));
  });
});

describe("deleteTask : branch of deleting  task from task table  ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createTodoTable(mockDb);
    memory.createTasksTable(mockDb);
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addTodo(todo);
    const task = {
      todo_name: "Morning",
      task_name: "brush",
      task_desc: "do brush for 5 mintues",
    };

    memory.addTaskInTodo(task);
  });
  it("deleteTask:  deleting one task  ", () => {
    const task1 = {
      todo_name: "Morning",
      task_name: "bath",
      task_desc: "do brush for 5 mintues",
    };

    memory.addTaskInTodo(task1);
    memory.deleteTask({ todo_name: "Morning", task_name: "bath" });
    const taskContent = memory.listTasks({ todo_name: "Morning" }).content;
    assertEquals(taskContent, [
      {
        complete: "false",
        id: 1,
        task_desc: "do brush for 5 mintues",
        task_name: "brush",
        todo_id: 1,
      },
    ]);
  });
});
