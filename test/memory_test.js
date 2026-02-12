import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { InMemoryTodoStore } from "../src/memory.js";

describe("AddTODO: branch of  memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new InMemoryTodoStore();
  });
  it(" addTODO: should add a todo in the db", () => {
    memory.addTodo(
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );

    assertEquals(memory.listTodo().content, [
      {
        tasks: [],
        todo_desc: "things To do in morning",
        id: 1,
        todo_name: "Morning Routine",
      },
    ]);
  });
  it(" addTODO: Multiple todo added add a todo in the db", () => {
    const tables = ["todos", "tasks"];

    memory.addTodo(
      { todo_name: "Morning Routine", todo_desc: "things To do in morning" },
    );
    memory.addTodo(
      {
        todo_name: "Evening Routine",
        todo_desc: "things To do in evening",
      },
    );

    assertEquals(memory.listTodo().content, [
      {
        tasks: [],
        todo_desc: "things To do in morning",
        id: 1,
        todo_name: "Morning Routine",
      },
      {
        tasks: [],
        todo_desc: "things To do in evening",
        id: 2,
        todo_name: "Evening Routine",
      },
    ]);
  });
});

describe("DeleteTODO: branch of  memory ", () => {
  let memory;

  beforeEach(() => {
    memory = new InMemoryTodoStore();

    memory.addTodo(
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );
  });
  it("DELETE TODO: should delete a todo in the db", () => {
    memory.deleteTodo({ todo_name: "Morning Routine" });

    assertEquals(memory.listTodo().content, []);
  });

  it("DeleteTODO: Deleted one of todo one remains", () => {
    memory.addTodo({
      todo_name: "Evening Routine",
      todo_desc: "things To do in evening",
    });

    memory.deleteTodo({ todo_name: "Morning Routine" });

    assertEquals(memory.listTodo().content, [
      {
        tasks: [],
        todo_desc: "things To do in evening",
        id: 2,
        todo_name: "Evening Routine",
      },
    ]);
  });
});
describe("ListTODO: branch of listing the todo in   memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new InMemoryTodoStore();
  });
  it(" listTodo: should add a todo in the db", () => {
    memory.addTodo(
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );

    assertEquals(memory.listTodo(), {
      success: true,
      content: [
        {
          tasks: [],
          todo_desc: "things To do in morning",
          id: 1,
          todo_name: "Morning Routine",
        },
      ],
    });
  });
});
describe("addTaskInTodo: branch of  memory ", () => {
  let memory;
  beforeEach(() => {
    memory = new InMemoryTodoStore();
  });
  it(" addTaskInTodo: should add a task in  todo", () => {
    const addedItemDb = memory.addTodo(
      { todo_name: "Morning Routine", todo_desc: "things To do in morning" },
    );
    memory.addTaskInTodo(
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );

    assertEquals(memory.listTodo().content, [
      {
        id: 1,
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
        tasks: [
          {
            task_name: "brush",
            task_desc: "Brush Teeth for 5 mintues",
            completed: false,
          },
        ],
      },
    ]);
  });
  it(" addTaskInTodo: should add two  task in  one todo", () => {
    memory.addTodo(
      { todo_name: "Morning Routine", todo_desc: "things To do in morning" },
    );
    memory.addTaskInTodo(
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );
    memory.addTaskInTodo(
      {
        todo_name: "Morning Routine",
        task_name: "bath",
        task_desc: "take A bath with cold water",
      },
    );

    assertEquals(memory.listTodo().content, [
      {
        id: 1,
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
        tasks: [
          {
            task_name: "brush",
            task_desc: "Brush Teeth for 5 mintues",
            completed: false,
          },
          {
            task_name: "bath",
            task_desc: "take A bath with cold water",
            completed: false,
          },
        ],
      },
    ]);
  });
});

describe("listTasks: branch of listing the task of given todo ", () => {
  let memory;
  beforeEach(() => {
    memory = new InMemoryTodoStore();
  });
  it(" listTasks: should list task of a todo", () => {
    memory.addTodo(
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );
    memory.addTaskInTodo(
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );

    assertEquals(
      memory.listTasks({ todo_name: "Morning Routine" }).content,
      [{
        completed: false,
        task_desc: "Brush Teeth for 5 mintues",
        task_name: "brush",
      }],
    );
  });

  it(" listTodo: should throw Error if db is undefined ", () => {
    assertThrows(() =>
      memory.listTasks({ todo_name: "Morning Routine" }).content
    );
  });
});
describe("MarkTaskDone: branch of marking Task done of given todo ", () => {
  let memory;

  beforeEach(() => {
    memory = new InMemoryTodoStore();

    memory.addTodo(
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );
    memory.addTaskInTodo(
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );
  });
  it(" MarkTaskDone: should list complete a task in a todo", () => {
    memory.markTaskDone({
      todo_name: "Morning Routine",
      task_name: "brush",
    });

    assertEquals(
      memory.listTasks({ todo_name: "Morning Routine" }).content,
      [{
        completed: true,
        task_desc: "Brush Teeth for 5 mintues",
        task_name: "brush",
      }],
    );
  });
  it(" MarkTaskDone: should mark complete task of a todo", () => {
    memory.addTaskInTodo(
      {
        todo_name: "Morning Routine",
        task_name: "bath",
        task_desc: "bath with cold water",
      },
    );
    memory.markTaskDone({
      todo_name: "Morning Routine",
      task_name: "brush",
    });
    memory.markTaskDone({
      todo_name: "Morning Routine",
      task_name: "bath",
    });

    assertEquals(
      memory.listTasks({ todo_name: "Morning Routine" }).content,
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

  beforeEach(() => {
    memory = new InMemoryTodoStore();

    memory.addTodo(
      {
        todo_name: "Morning Routine",
        todo_desc: "things To do in morning",
      },
    );
    memory.addTaskInTodo(
      {
        todo_name: "Morning Routine",
        task_name: "brush",
        task_desc: "Brush Teeth for 5 mintues",
      },
    );
  });

  it(" DeleteTask: should delete one  task in a todo", () => {
    memory.deleteTask({
      todo_name: "Morning Routine",
      task_name: "brush",
    });

    assertEquals(
      memory.listTasks({ todo_name: "Morning Routine" }).content,
      [],
    );
  });

  it(" DeleteTask: should delete both  task of a todo", () => {
    memory.addTaskInTodo(
      {
        todo_name: "Morning Routine",
        task_name: "bath",
        task_desc: "bath with cold water",
      },
    );
    memory.deleteTask({
      todo_name: "Morning Routine",
      task_name: "brush",
    });
    memory.deleteTask({
      todo_name: "Morning Routine",
      task_name: "bath",
    });

    assertEquals(
      memory.listTasks({ todo_name: "Morning Routine" }).content,
      [],
    );
  });
  it(" DeleteTask: delete one tasks", () => {
    memory.addTaskInTodo(
      {
        todo_name: "Morning Routine",
        task_name: "bath",
        task_desc: "bath with cold water",
      },
    );
    memory.deleteTask({
      todo_name: "Morning Routine",
      task_name: "brush",
    });

    assertEquals(
      memory.listTasks({ todo_name: "Morning Routine" }).content,
      [{
        completed: false,
        task_desc: "bath with cold water",
        task_name: "bath",
      }],
    );
  });
  it(" DeleteTask: should throw error if the db is empty", () => {
    memory.addTaskInTodo(
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
