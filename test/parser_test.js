import { beforeEach, describe, it } from "@std/testing/bdd";
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
});
