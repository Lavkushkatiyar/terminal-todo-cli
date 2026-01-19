import { before, beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { memoryInventory } from "../src/memory.js";

describe("branch of Creating memory database", () => {
  let memory;
  beforeEach(() => {
    memory = new memoryInventory();
  });
  it("simple Functions call to create A db", () => {
    const db = memory.createDB();
    assertEquals(db, { tables: {} });
  });
});
describe("Initialize branch of  memory database", () => {
  let memory;
  beforeEach(() => {
    memory = new memoryInventory();
  });
  it(" initializeDB: should initialize the db when provided table", () => {
    const dbName = memory.createDB();
    const tables = ["todos", "tasks"];
    const initializedDB = memory.initializeDB(dbName, tables);

    assertEquals(initializedDB, { tables: { todos: [], tasks: [] } });
  });
  it(" initializeDB: should throw Error if db is undefined ", () => {
    const dbName = undefined;
    const tables = ["todos", "tasks"];

    assertThrows(() => memory.initializeDB(dbName, tables));
  });
});
