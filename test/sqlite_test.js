import { DatabaseSync } from "node:sqlite";
import { assertEquals, assertThrows } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { sqLiteTodoClass } from "../src/Sqlite.js";

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
describe("ADD_TODO : branch of Creating a TODO in todos table ", () => {
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
