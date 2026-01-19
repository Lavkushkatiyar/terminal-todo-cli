import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { memoryInventory } from "../src/memory.js";

describe("branch of Creating memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new memoryInventory();
  });
  it("simple Functions call to create A db", () => {
    const db = memory.createDB();
    assertEquals(db, { tables: {} });
  });
});
describe("Initialize branch of  memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new memoryInventory();
  });
  it(" initializeDB: should initialize the db when provided table", () => {
    const dbName = memory.createDB();
    const initializedDB = memory.initializeDB(dbName);

    assertEquals(initializedDB, { tables: { todos: [] } });
  });
  it(" initializeDB: should throw Error if db is undefined ", () => {
    const dbName = undefined;

    assertThrows(() => memory.initializeDB(dbName, tables));
  });
});
describe("AddTODO: branch of  memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new memoryInventory();
  });
  it(" addTODO: should add a todo in the db", () => {
    const dbName = memory.createDB();
    memory.initializeDB(dbName);

    const addedItemDb = memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );

    assertEquals(addedItemDb, [
      {
        completed: "❌",
        tasks: [],
        todo_desc: "things To do in morning",
        todo_id: 1,
        todo_name: "Morning Routine",
      },
    ]);
  });
  it(" addTODO: Multiple todo added add a todo in the db", () => {
    const dbName = memory.createDB();
    const tables = ["todos", "tasks"];
    memory.initializeDB(dbName, tables);
    memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );
    const addedItems = memory.addToDo(
      dbName,
      "Evening Routine",
      "things To do in evening",
    );

    assertEquals(addedItems, [
      {
        completed: "❌",
        tasks: [],
        todo_desc: "things To do in morning",
        todo_id: 1,
        todo_name: "Morning Routine",
      },
      {
        completed: "❌",
        tasks: [],
        todo_desc: "things To do in evening",
        todo_id: 2,
        todo_name: "Evening Routine",
      },
    ]);
  });
  it(" addTODO: should throw Error if db is undefined ", () => {
    const dbName = undefined;
    assertThrows(() =>
      memory.addToDo(
        dbName,
        "Morning Routine",
        "things To do in morning",
      )
    );
  });
});
describe("ListTODO: branch of listing the todo in   memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new memoryInventory();
  });
  it(" addTODO: should add a todo in the db", () => {
    const dbName = memory.createDB();
    memory.initializeDB(dbName);
    memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );

    assertEquals(memory.listTodo(dbName), {
      success: true,
      content: [
        {
          completed: "❌",
          tasks: [],
          todo_desc: "things To do in morning",
          todo_id: 1,
          todo_name: "Morning Routine",
        },
      ],
    });
  });

  it(" listToDo: should throw Error if db is undefined ", () => {
    const dbName = undefined;
    assertThrows(() => memory.listTodo(dbName));
  });
});
