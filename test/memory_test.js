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

describe("DeleteTODO: branch of  memory ", () => {
  let memory;
  let dbName;
  beforeEach(() => {
    memory = new memoryInventory();
    dbName = memory.createDB();
    memory.initializeDB(dbName);

    memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );
  });
  it(" DELETE TODO: should delete a todo in the db", () => {
    memory.deleteTodo(dbName, "Morning Routine ");

    assertEquals(memory.listTodo(dbName).content, []);
  });
  it(" DeleteTODO: Deleted one of todo one remains", () => {
    const dbName = memory.createDB();
    const tables = ["todos", "tasks"];
    memory.initializeDB(dbName, tables);
    memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );
    memory.addToDo(
      dbName,
      "Evening Routine",
      "things To do in evening",
    );

    memory.deleteTodo(dbName, "Morning Routine");
    assertEquals(memory.listTodo(dbName).content, [
      {
        completed: "❌",
        tasks: [],
        todo_desc: "things To do in evening",
        todo_id: 3,
        todo_name: "Evening Routine",
      },
    ]);
  });
  it(" DeleteTODO: should throw Error if db is undefined ", () => {
    assertThrows(() =>
      memory.deleteTodo(
        undefined,
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
  it(" listToDo: should add a todo in the db", () => {
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
describe("addTaskInToDo: branch of  memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new memoryInventory();
  });
  it(" addTaskInToDo: should add a task in  todo", () => {
    const dbName = memory.createDB();
    memory.initializeDB(dbName);

    const addedItemDb = memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "brush",
      "Brush Teeth for 5 mintues",
    );

    assertEquals(addedItemDb, [
      {
        completed: "❌",
        tasks: [{
          completed: false,
          task_desc: "Brush Teeth for 5 mintues",
          task_name: "brush",
        }],
        todo_desc: "things To do in morning",
        todo_id: 1,
        todo_name: "Morning Routine",
      },
    ]);
  });
  it(" addTaskInToDo: should add two  task in  one todo", () => {
    const dbName = memory.createDB();
    memory.initializeDB(dbName);

    const addedItemDb = memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "brush",
      "Brush Teeth for 5 mintues",
    );
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "bath",
      "take A bath with cold water",
    );

    assertEquals(addedItemDb, [
      {
        completed: "❌",
        tasks: [{
          completed: false,
          task_desc: "Brush Teeth for 5 mintues",
          task_name: "brush",
        }, {
          completed: false,
          task_desc: "take A bath with cold water",
          task_name: "bath",
        }],
        todo_desc: "things To do in morning",
        todo_id: 1,
        todo_name: "Morning Routine",
      },
    ]);
  });

  it(" addTODO: should throw Error if db is undefined ", () => {
    const dbName = undefined;
    assertThrows(() =>
      memory.addTaskInToDo(
        dbName,
        "Morning Routine",
        "things To do in morning",
      )
    );
  });
});

describe("listTasks: branch of listing the task of given todo ", () => {
  let memory;
  beforeEach(() => {
    memory = new memoryInventory();
  });
  it(" listTasks: should list task of a todo", () => {
    const dbName = memory.createDB();
    memory.initializeDB(dbName);

    memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "brush",
      "Brush Teeth for 5 mintues",
    );

    assertEquals(memory.listTasks(dbName, "Morning Routine"), [{
      completed: false,
      task_desc: "Brush Teeth for 5 mintues",
      task_name: "brush",
    }]);
  });

  it(" listToDo: should throw Error if db is undefined ", () => {
    const dbName = undefined;
    assertThrows(() => memory.listTasks(dbName, "Morning Routine"));
  });
});
describe("MarkTaskDone: branch of marking Task done of given todo ", () => {
  let memory;
  let dbName;
  beforeEach(() => {
    memory = new memoryInventory();
    dbName = memory.createDB();
    memory.initializeDB(dbName);

    memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "brush",
      "Brush Teeth for 5 mintues",
    );
  });
  it(" MarkTaskDone: should list complete a task in a todo", () => {
    memory.markTaskDone(dbName, "Morning Routine", "brush");

    assertEquals(memory.listTasks(dbName, "Morning Routine"), [{
      completed: true,
      task_desc: "Brush Teeth for 5 mintues",
      task_name: "brush",
    }]);
  });
  it(" MarkTaskDone: should mark complete task of a todo", () => {
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "bath",
      "bath with cold water",
    );
    memory.markTaskDone(dbName, "Morning Routine", "brush");
    memory.markTaskDone(dbName, "Morning Routine", "bath");

    assertEquals(memory.listTasks(dbName, "Morning Routine"), [{
      completed: true,
      task_desc: "Brush Teeth for 5 mintues",
      task_name: "brush",
    }, {
      completed: true,
      task_desc: "bath with cold water",
      task_name: "bath",
    }]);
  });
});
describe("DeleteTask: branch of deleting the task of given todo ", () => {
  let memory;
  let dbName;
  beforeEach(() => {
    memory = new memoryInventory();
    dbName = memory.createDB();
    memory.initializeDB(dbName);

    memory.addToDo(
      dbName,
      "Morning Routine",
      "things To do in morning",
    );
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "brush",
      "Brush Teeth for 5 mintues",
    );
  });
  it(" DeleteTask: should delete one  task in a todo", () => {
    memory.deleteTask(dbName, "Morning Routine", "brush");

    assertEquals(memory.listTasks(dbName, "Morning Routine"), []);
  });
  it(" DeleteTask: should delete both  task of a todo", () => {
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "bath",
      "bath with cold water",
    );
    memory.deleteTask(dbName, "Morning Routine", "brush");
    memory.deleteTask(dbName, "Morning Routine", "bath");

    assertEquals(memory.listTasks(dbName, "Morning Routine"), []);
  });
  it(" DeleteTask: delete one tasks", () => {
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "bath",
      "bath with cold water",
    );
    memory.deleteTask(dbName, "Morning Routine", "brush");

    assertEquals(memory.listTasks(dbName, "Morning Routine"), [{
      completed: false,
      task_desc: "bath with cold water",
      task_name: "bath",
    }]);
  });
  it(" DeleteTask: should throw error if the db is empty", () => {
    memory.addTaskInToDo(
      dbName,
      "Morning Routine",
      "bath",
      "bath with cold water",
    );
    assertThrows(() =>
      memory.deleteTask(undefined, "Morning Routine", "brush")
    );
  });
});
