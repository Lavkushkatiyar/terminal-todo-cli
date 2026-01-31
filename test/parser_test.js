import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { parser } from "../src/parser.js";
describe("Parser ", () => {
  describe("addToDo", () => {
    it("should parse todo_name and todo_desc", () => {
      const result = parser(["addToDo", "Shopping", "Buy milk"]);
      assertEquals(result.command, "addToDo");
      assertEquals(result.todo_name, "Shopping");
      assertEquals(result.todo_desc, "Buy milk");
      assertEquals(result.task_name, "");
      assertEquals(result.task_desc, "");
    });

    it("should ignore extra args", () => {
      const result = parser(["addToDo", "Work", "Deploy", "EXTRA"]);
      assertEquals(result.todo_name, "Work");
      assertEquals(result.todo_desc, "Deploy");
      assertEquals(result.task_name, "");
    });
  });
  describe(" addTaskInToDo", () => {
    it("should parse todo_name, task_name, task_desc", () => {
      const result = parser(["addTaskInToDo", "Work", "API", "Build routes"]);
      assertEquals(result.command, "addTaskInToDo");
      assertEquals(result.todo_name, "Work");
      assertEquals(result.task_name, "API");
      assertEquals(result.task_desc, "Build routes");
    });

    it("should set undefined for missing args", () => {
      const result = parser(["addTaskInToDo", "Work"]);
      assertEquals(result.todo_name, "Work");
      assertEquals(result.task_name, undefined);
      assertEquals(result.task_desc, undefined);
    });
  });

  describe(" listTodo", () => {
    it("should set only command", () => {
      const result = parser(["listTodo"]);
      assertEquals(result.command, "listTodo");
      assertEquals(result.todo_name, "");
      assertEquals(result.task_name, "");
    });
  });

  describe(" listTasks", () => {
    it("should parse todo_name only", () => {
      const result = parser(["listTasks", "Shopping"]);
      assertEquals(result.command, "listTasks");
      assertEquals(result.todo_name, "Shopping");
      assertEquals(result.task_name, "");
    });
  });

  describe(" markTaskDone", () => {
    it("should parse todo_name and task_name", () => {
      const result = parser(["markTaskDone", "Work", "API"]);
      assertEquals(result.command, "markTaskDone");
      assertEquals(result.todo_name, "Work");
      assertEquals(result.task_name, "API");
    });
  });

  describe(" deleteTask", () => {
    it("should parse todo_name and task_name", () => {
      const result = parser(["deleteTask", "Work", "API"]);
      assertEquals(result.command, "deleteTask");
      assertEquals(result.todo_name, "Work");
      assertEquals(result.task_name, "API");
    });
  });

  describe(" deleteTodo", () => {
    it("should parse todo_name only", () => {
      const result = parser(["deleteTodo", "Work"]);
      assertEquals(result.command, "deleteTodo");
      assertEquals(result.todo_name, "Work");
      assertEquals(result.task_name, "");
    });
  });

  describe(" error handling", () => {
    it("should throw on unknown command", () => {
      assertThrows(() => parser(["unknownCmd", "x"]));
    });
  });
});
