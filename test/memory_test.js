import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { inMemoryTodoStore } from "../src/memory.js";

describe("branch of Creating memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new inMemoryTodoStore();
  });
  it("simple Functions call to create A db", () => {
    const db = memory.createDb();
    assertEquals(db, { tables: {} });
  });
});

describe("Initialize branch of  memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new inMemoryTodoStore();
  });
  it(" initializeDb: should initialize the db when provided table", () => {
    const dbName = memory.createDb();
    const initializedDB = memory.initializeDb(dbName);

    assertEquals(initializedDB, { tables: { todos: [] } });
  });
  it(" initializeDb: should throw Error if db is undefined ", () => {
    assertThrows(() => memory.initializeDb(undefined));
  });
});

describe("AddTODO: branch of  memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new inMemoryTodoStore();
  });
  it(" addTODO: should add a todo in the db", () => {
    const dbName = memory.createDb();
    memory.initializeDb(dbName);

    memory.addToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );

    assertEquals(memory.listTodos(dbName).content, [
      {
        tasks: [],
        todo_desc: "things To do in morning",
        todo_id: 1,
        todo_name: "Morning Routine",
      },
    ]);
  });
  it(" addTODO: Multiple todo added add a todo in the db", () => {
    const dbName = memory.createDb();
    const tables = ["todos", "tasks"];
    memory.initializeDb(dbName, tables);
    memory.addToDo(
      dbName,
      { todo_name: "Morning Routine", todo_desc: "things To do in morning" },
    );
    memory.addToDo(
      dbName,
      {
        todo_name: "Evening Routine",
        todo_desc: "things To do in evening",
      },
    );

    assertEquals(memory.listTodos(dbName).content, [
      {
        tasks: [],
        todo_desc: "things To do in morning",
        todo_id: 1,
        todo_name: "Morning Routine",
      },
      {
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
        {
          todo_name: "Morning Routine",
          todo_desc: "things To do in morning",
        },
      )
    );
  });
});

describe("DeleteTODO: branch of  memory ", () => {
  let memory;
  let dbName;
  beforeEach(() => {
    memory = new inMemoryTodoStore();
    dbName = memory.createDb();
    memory.initializeDb(dbName);

    memory.addToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );
  });
  it(" DELETE TODO: should delete a todo in the db", () => {
    memory.deleteTodo(dbName, "Morning Routine ");

    assertEquals(memory.listTodos(dbName).content, []);
  });
  it(" DeleteTODO: Deleted one of todo one remains", () => {
    const dbName = memory.createDb();
    const tables = ["todos", "tasks"];
    memory.initializeDb(dbName, tables);
    memory.addToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );
    memory.addToDo(
      dbName,
      {
        todo_name: "Evening Routine",
        todo_desc: "things To do in evening",
      },
    );

    memory.deleteTodo(dbName, "Morning Routine");
    assertEquals(memory.listTodos(dbName).content, [
      {
        tasks: [],
        todo_desc: "things To do in morning",
        todo_id: 2,
        todo_name: "Morning Routine",
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
    memory = new inMemoryTodoStore();
  });
  it(" listToDo: should add a todo in the db", () => {
    const dbName = memory.createDb();
    memory.initializeDb(dbName);
    memory.addToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );

    assertEquals(memory.listTodos(dbName), {
      success: true,
      content: [
        {
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
    assertThrows(() => memory.listTodos(dbName));
  });
});
describe("addTaskInToDo: branch of  memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new inMemoryTodoStore();
  });
  it(" addTaskInToDo: should add a task in  todo", () => {
    const dbName = memory.createDb();
    memory.initializeDb(dbName);

    const addedItemDb = memory.addToDo(
      dbName,
      { todo_name: "Morning Routine", todo_desc: "things To do in morning" },
    );
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );

    assertEquals(addedItemDb, [
      {
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
    const dbName = memory.createDb();
    memory.initializeDb(dbName);

    const addedItemDb = memory.addToDo(
      dbName,
      { todo_name: "Morning Routine", todo_desc: "things To do in morning" },
    );
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "bath",
        task_desc: "take A bath with cold water",
      },
    );

    assertEquals(addedItemDb, [
      {
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
    memory = new inMemoryTodoStore();
  });
  it(" listTasks: should list task of a todo", () => {
    const dbName = memory.createDb();
    memory.initializeDb(dbName);

    memory.addToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );

    assertEquals(
      memory.listTasks(dbName, { todo_name: "Morning Routine" }).content,
      [{
        completed: false,
        task_desc: "Brush Teeth for 5 mintues",
        task_name: "brush",
      }],
    );
  });

  it(" listToDo: should throw Error if db is undefined ", () => {
    const dbName = undefined;
    assertThrows(() =>
      memory.listTasks(dbName, { todo_name: "Morning Routine" }).content
    );
  });
});
describe("MarkTaskDone: branch of marking Task done of given todo ", () => {
  let memory;
  let dbName;
  beforeEach(() => {
    memory = new inMemoryTodoStore();
    dbName = memory.createDb();
    memory.initializeDb(dbName);

    memory.addToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );
  });
  it(" MarkTaskDone: should list complete a task in a todo", () => {
    memory.markTaskDone(dbName, {
      todo_name: "Morning Routine",
      task_name: "brush",
    });

    assertEquals(
      memory.listTasks(dbName, { todo_name: "Morning Routine" }).content,
      [{
        completed: true,
        task_desc: "Brush Teeth for 5 mintues",
        task_name: "brush",
      }],
    );
  });
  it(" MarkTaskDone: should mark complete task of a todo", () => {
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "bath",
        task_desc: "bath with cold water",
      },
    );
    memory.markTaskDone(dbName, {
      todo_name: "Morning Routine",
      task_name: "brush",
    });
    memory.markTaskDone(dbName, {
      todo_name: "Morning Routine",
      task_name: "bath",
    });

    assertEquals(
      memory.listTasks(dbName, { todo_name: "Morning Routine" }).content,
      [{
        completed: true,
        task_desc: "Brush Teeth for 5 mintues",
        task_name: "brush",
      }, {
        completed: true,
        task_desc: "bath with cold water",
        task_name: "bath",
      }],
    );
  });
  it(" MarkTaskDone: should throw error provided undefined db ", () => {
    assertThrows(() =>
      memory.markTaskDone(undefined, {
        todo_name: "Morning Routine",
        task_name: "bath",
      })
    );
  });
});
describe("DeleteTask: branch of deleting the task of given todo ", () => {
  let memory;
  let dbName;
  beforeEach(() => {
    memory = new inMemoryTodoStore();
    dbName = memory.createDb();
    memory.initializeDb(dbName);

    memory.addToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );
  });

  it(" DeleteTask: should delete one  task in a todo", () => {
    memory.deleteTask(dbName, {
      todo_name: "Morning Routine",
      task_name: "brush",
    });

    assertEquals(
      memory.listTasks(dbName, { todo_name: "Morning Routine" }).content,
      [],
    );
  });

  it(" DeleteTask: should delete both  task of a todo", () => {
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "bath",
        task_desc: "bath with cold water",
      },
    );
    memory.deleteTask(dbName, {
      todo_name: "Morning Routine",
      task_name: "brush",
    });
    memory.deleteTask(dbName, {
      todo_name: "Morning Routine",
      todo_desc: "bath",
    });

    assertEquals(
      memory.listTasks(dbName, { todo_name: "Morning Routine" }).content,
      [],
    );
  });
  it(" DeleteTask: delete one tasks", () => {
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "bath",
        task_desc: "bath with cold water",
      },
    );
    memory.deleteTask(dbName, {
      todo_name: "Morning Routine",
      task_name: "brush",
    });

    assertEquals(
      memory.listTasks(dbName, { todo_name: "Morning Routine" }).content,
      [{
        completed: false,
        task_desc: "bath with cold water",
        task_name: "bath",
      }],
    );
  });
  it(" DeleteTask: should throw error if the db is empty", () => {
    memory.addTaskInToDo(
      dbName,
      {
        todo_name: "Morning Routine",
        task_name: "bath",
        task_desc: "bath with cold water",
      },
    );
    assertThrows(() =>
      memory.deleteTask(undefined, "Morning Routine", "brush")
    );
  });
});
