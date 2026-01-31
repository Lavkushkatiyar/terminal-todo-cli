import { DatabaseSync } from "node:sqlite";
import { assertEquals, assertThrows } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { SqliteTodoStore } from "../src/sqlite-class.js";

describe("CreateTABLE : branch of Creating a table in the ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
  });
  it("CreateTodoTable:  creating the todos table", () => {
    memory.createToDoTable(mockDb);
    const result = mockDb.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    ).get("todos");
    assertEquals(!!result, true);
  });
  it("CreateToDoTable:  creating the todos table and referenced tasks table ", () => {
    memory.createToDoTable();
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
  it("CreateTaskTable:  creating tasks table without todos should throw error ", () => {
    assertThrows(() => memory.createTasksTable(mockDb));
  });
  it("CreateTODOTable:  should throw error provided undefined table ", () => {
    memory = new SqliteTodoStore(undefined);
    assertThrows(() => memory.createToDoTable());
  });
});
describe("ADD_TODO : branch of Adding a TODO in todos table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createToDoTable();
  });
  it("Create_todo:  creating a todo in todos table", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addToDo(todo);
    const result = mockDb.prepare(
      "SELECT * FROM todos WHERE todo_name = ?",
    ).get("Morning");

    assertEquals(!!result, true);
  });
  it("CreateTable:  creating the multiple todos table and tasks ", () => {
    const todo1 = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    const todo2 = {
      todo_name: "Evening",
      todo_desc: "thingsTO do in evening",
    };
    memory.addToDo(todo1);
    memory.addToDo(todo2);

    const morningToDo = mockDb.prepare(
      "SELECT * FROM todos WHERE todo_name = ?",
    ).get("Morning");
    const EveningTodo = mockDb.prepare(
      "SELECT * FROM todos WHERE todo_name = ?",
    ).get("Evening");
    assertEquals(!!morningToDo, true);
    assertEquals(!!EveningTodo, true);
  });
  it("CreateTable:  should throw error If todo already exist ", () => {
    const todo1 = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };

    memory.addToDo(todo1);
    assertThrows(() => memory.addToDo(todo1));
  });
  it("CreateTable:  should throw error provided undefined table ", () => {
    assertThrows(() => memory.addToDo(undefined, {}));
  });
  it("CreateTable:  should throw error provided undefined todo_name ", () => {
    assertThrows(() => memory.addToDo({ todo_name: undefined, todo_desc: "" }));
  });
});

describe("ListTodo : branch of Listing todos table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createToDoTable();
  });
  it("List_todo:  should List todos table (1 todo added)", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addToDo(todo);
    const todoTable = memory.listTodo().content;
    assertEquals(todoTable, [{
      id: 1,
      todo_desc: "thingsTO do in morning",
      todo_name: "Morning",
    }]);
  });
  it("List_todo:  should List todos table (multiple todo added)", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addToDo(todo);
    const todoTable = memory.listTodo(mockDb).content;
    assertEquals(todoTable, [{
      id: 1,
      todo_desc: "thingsTO do in morning",
      todo_name: "Morning",
    }]);
  });
  it("List_todo:  should List todos table (1 todo)", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    const todo1 = {
      todo_name: "evening",
      todo_desc: "thingsTO do in evening",
    };
    memory.addToDo(todo);
    memory.addToDo(todo1);
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

  it("List_todo:  should throw error provided undefined table ", () => {
    memory = new SqliteTodoStore(undefined);
    assertThrows(() => memory.listTodo({}));
  });
});
describe("DELETE_TODO : branch of DELETING todos table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mockDb);
    memory.createToDoTable();
  });
  it("Delete_Todo:  should delete todos table given the todo_name", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addToDo(todo);
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
    memory.addToDo(todo);
    memory.addToDo(todo1);

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
    memory.addToDo(todo);
    memory.addToDo(todo1);
    memory.deleteTodo({ todo_name: todo.todo_name });
    memory.deleteTodo({ todo_name: todo1.todo_name });
    const todoTable = memory.listTodo(mockDb).content;
    assertEquals(todoTable, []);
  });

  it("Delete_todo:  should throw error provided undefined table ", () => {
    assertThrows(() => memory.deleteTodo(undefined, {}));
  });
});

describe("addTaskInToDo : branch of adding task in  tasks table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    mockDb = new DatabaseSync(":memory:");
    memory = new SqliteTodoStore(mock);
    memory.createToDoTable();
    memory.createTasksTable();
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.addToDo(todo);
  });
  it("addTaskInToDo : should add a task in todo given todo_name task_name", () => {
    const task = {
      todo_name: "Morning",
      task_name: "brush",
      task_desc: "do brush for 5 mintues",
    };

    memory.addTaskInTodo(task);

    const taskData = mockDb.prepare(`SELECT * FROM task`).all();
    console.log();

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
  it("addTaskInToDo : should add two  task in todo given todo_name task_name", () => {
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
  // it("addTaskInToDo : adding one task  in two different todo  ", () => {
  //   const todo = {
  //     todo_name: "Evening",
  //     todo_desc: "Do something in Evening",
  //   };
  //   const task = {
  //     todo_name: "Morning",
  //     task_name: "brush",
  //     task_desc: "do brush for 5 mintues",
  //   };
  //   const task2 = {
  //     todo_name: "Evening",
  //     task_name: "bath",
  //     task_desc: "bath with cold water",
  //   };
  //   memory.addToDo(todo);
  //   memory.addTaskInTodo(task);
  //   memory.addTaskInTodo(task2);

  //   const taskData = mockDb.prepare(`SELECT * FROM task`).all();

  //   assertEquals(taskData, [{
  //     complete: "false",
  //     id: 1,
  //     task_desc: "do brush for 5 mintues",
  //     task_name: "brush",
  //     todo_id: 1,
  //   }, {
  //     complete: "false",
  //     id: 2,
  //     task_desc: "bath with cold water",
  //     task_name: "bath",
  //     todo_id: 2,
  //   }]);
  // });

  // it("addTaskInToDo:  should throw error provided todo is not exist in the table ", () => {
  //   assertThrows(() =>
  //     memory.addTaskInTodo(undefined, {
  //       todo_name: "dosen't exist",
  //       task_name: "nothing",
  //       task_desc: "nothing",
  //     })
  //   );
  // });
  // it("addTaskInToDo:  should throw error provided undefined table ", () => {
  //   assertThrows(() => memory.addTaskInTodo(undefined, {}));
  // });
  // it("addTaskInToDo:  should throw error provided undefined todo_name to add task  ", () => {
  //   assertThrows(() => memory.addTaskInTodo({ todo_name: undefined }));
  // });
});

// describe("listTasks : branch of listing task  ", () => {
//   let memory;
//   let mockDb;
//   beforeEach(() => {
//     memory = new SqliteTodoStore();
//     mockDb = new DatabaseSync(":memory:");
//     memory.createToDoTable(mockDb);
//     memory.createTasksTable(mockDb);
//     const todo = {
//       todo_name: "Morning",
//       todo_desc: "thingsTO do in morning",
//     };
//     memory.addToDo(todo);
//     const task = {
//       todo_name: "Morning",
//       task_name: "brush",
//       task_desc: "do brush for 5 mintues",
//     };

//     memory.addTaskInTodo( task);
//   });

//   it("listTasks:  listing all task of a todo ", () => {
//     const listTasks =
//       memory.listTasks(mockDb, { todo_name: "Morning" }).content;
//     const taskData = mockDb.prepare(`SELECT * FROM task`).all();

//     assertEquals(listTasks, taskData);
//   });
// });

// describe("markTaskDone : branch of marking task as done in task table  ", () => {
//   let memory;
//   let mockDb;
//   beforeEach(() => {
//     memory = new SqliteTodoStore();
//     mockDb = new DatabaseSync(":memory:");
//     memory.createToDoTable(mockDb);
//     memory.createTasksTable(mockDb);
//     const todo = {
//       todo_name: "Morning",
//       todo_desc: "thingsTO do in morning",
//     };
//     memory.addToDo(todo);
//     const task = {
//       todo_name: "Morning",
//       task_name: "brush",
//       task_desc: "do brush for 5 mintues",
//     };

//     memory.addTaskInTodo( task);
//   });
//   it("markTaskDone:  marking one task done in the task  ", () => {
//     const task1 = {
//       todo_name: "Morning",
//       task_name: "bath",
//       task_desc: "do brush for 5 mintues",
//     };

//     memory.addTaskInTodo( task1);

//     memory.markTaskDone(mockDb, { todo_name: "Morning", task_name: "brush" });
//     memory.markTaskDone(mockDb, { todo_name: "Morning", task_name: "bath" });

//     const taskData = memory.listTasks(mockDb, { todo_name: "Morning" }).content;

//     assertEquals(taskData, [
//       {
//         complete: "done",
//         id: 1,
//         task_desc: "do brush for 5 mintues",
//         task_name: "brush",
//         todo_id: 1,
//       },

//       {
//         complete: "done",
//         id: 2,
//         task_desc: "do brush for 5 mintues",
//         task_name: "bath",
//         todo_id: 1,
//       },
//     ]);
//   });
//   it("markTaskDone:  marking multiple of marking task as done in task table ", () => {
//     memory.markTaskDone(mockDb, { todo_name: "Morning", task_name: "brush" });

//     const taskData = mockDb.prepare(`SELECT * FROM task`).all();

//     assertEquals(taskData, [{
//       complete: "done",
//       id: 1,
//       task_desc: "do brush for 5 mintues",
//       task_name: "brush",
//       todo_id: 1,
//     }]);
//   });

//   it("markTaskDone:  should throw error provided undefined table ", () => {
//     assertThrows(() => memory.mark(undefined, {}));
//   });
// });
// describe("deleteTask : branch of deleting  task from task table  ", () => {
//   let memory;
//   let mockDb;
//   beforeEach(() => {
//     memory = new SqliteTodoStore();
//     mockDb = new DatabaseSync(":memory:");
//     memory.createToDoTable(mockDb);
//     memory.createTasksTable(mockDb);
//     const todo = {
//       todo_name: "Morning",
//       todo_desc: "thingsTO do in morning",
//     };
//     memory.addToDo(todo);
//     const task = {
//       todo_name: "Morning",
//       task_name: "brush",
//       task_desc: "do brush for 5 mintues",
//     };

//     memory.addTaskInTodo(mockDb, task);
//   });
//   it("deleteTask:  deleting one task  ", () => {
//     const task1 = {
//       todo_name: "Morning",
//       task_name: "bath",
//       task_desc: "do brush for 5 mintues",
//     };

//     memory.addTaskInTodo(mockDb, task1);
//     memory.deleteTask(mockDb, { todo_name: "Morning", task_name: "bath" });
//     const taskContent =
//       memory.listTasks(mockDb, { todo_name: "Morning" }).content;
//     assertEquals(taskContent, [
//       {
//         complete: "false",
//         id: 1,
//         task_desc: "do brush for 5 mintues",
//         task_name: "brush",
//         todo_id: 1,
//       },
//     ]);
//   });
// });
