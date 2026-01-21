import { DatabaseSync } from "node:sqlite";
import { assertEquals, assertThrows } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { sqLiteTodoClass } from "../src/Sqlite.js";
import { mock } from "node:test";

describe("CreateTABLE : branch of Creating a table in the ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    memory = new sqLiteTodoClass();
    mockDb = new DatabaseSync(":memory:");
  });
  it("CreateTable:  creating the todos table", () => {
    memory.createToDoTable(mockDb);
    const result = mockDb.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    ).get("todos");
    assertEquals(!!result, true);
  });
  it("CreateTable:  creating the todos table and referenced tasks table ", () => {
    memory.createToDoTable(mockDb);
    memory.createTasksTable(mockDb);
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
    assertThrows(() => memory.createToDoTable(undefined));
  });
});
describe("ADD_TODO : branch of Adding a TODO in todos table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    memory = new sqLiteTodoClass();
    mockDb = new DatabaseSync(":memory:");
    memory.createToDoTable(mockDb);
  });
  it("Create_todo:  creating a todo in todos table", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.createToDo(mockDb, todo);
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
    memory.createToDo(mockDb, todo1);
    memory.createToDo(mockDb, todo2);

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

    memory.createToDo(mockDb, todo1);
    assertThrows(() => memory.createToDo(mockDb, todo1));
  });
  it("CreateTable:  should throw error provided undefined table ", () => {
    assertThrows(() => memory.createToDo(undefined, {}));
  });
  it("CreateTable:  should throw error provided undefined todo_name ", () => {
    assertThrows(() =>
      memory.createToDo(mockDb, { todo_name: undefined, todo_desc: "" })
    );
  });
});

describe("ListTodo : branch of Listing todos table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    memory = new sqLiteTodoClass();
    mockDb = new DatabaseSync(":memory:");
    memory.createToDoTable(mockDb);
  });
  it("List_todo:  should List todos table (1 todo added)", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.createToDo(mockDb, todo);
    const todoTable = memory.listTodo(mockDb);
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
    memory.createToDo(mockDb, todo);
    const todoTable = memory.listTodo(mockDb);
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
    memory.createToDo(mockDb, todo);
    memory.createToDo(mockDb, todo1);
    const todoTable = memory.listTodo(mockDb);
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
    assertThrows(() => memory.listTodo(undefined, {}));
  });
});
describe("DELETE_TODO : branch of DELETING todos table ", () => {
  let memory;
  let mockDb;
  beforeEach(() => {
    memory = new sqLiteTodoClass();
    mockDb = new DatabaseSync(":memory:");
    memory.createToDoTable(mockDb);
  });
  it("Delete_Todo:  should delete todos table given the todo_name", () => {
    const todo = {
      todo_name: "Morning",
      todo_desc: "thingsTO do in morning",
    };
    memory.createToDo(mockDb, todo);
    memory.deleteTodo(mockDb, { todo_name: todo.todo_name });
    const todoTable = memory.listTodo(mockDb);
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
    memory.createToDo(mockDb, todo);
    memory.createToDo(mockDb, todo1);

    memory.deleteTodo(mockDb, { todo_name: todo.todo_name });

    const todoTable = memory.listTodo(mockDb);
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
    memory.createToDo(mockDb, todo);
    memory.createToDo(mockDb, todo1);
    memory.deleteTodo(mockDb, { todo_name: todo.todo_name });
    memory.deleteTodo(mockDb, { todo_name: todo1.todo_name });
    const todoTable = memory.listTodo(mockDb);
    assertEquals(todoTable, []);
  });

  it("Delete_todo:  should throw error provided undefined table ", () => {
    assertThrows(() => memory.deleteTodo(undefined, {}));
  });
});
