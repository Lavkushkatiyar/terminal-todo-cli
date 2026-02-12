- Refactoring the code -> we can remove the parser [hard]
- naming could be better .[medium]
- we can have a constructor that will initialize the db for us [easy]
- i have to fix the inconsistency in the code ,
  1. sqlite-class.js
  2. ----- i have to make all the functions declaration consistent
  3. ---- all the variable name meaningful and consistent.

  4. memory-class.js

  ```js
  [✅] 5 . i have to fix the test cases description to increase consistency
  [✅] 5 . i have to fix the all  test cases to accept the db initialization
  ```

```js
parser .js

  [✅] addToDo — ensure command is set to "addToDo" and todo_name / todo_desc are parsed from the args (extra fields remain unchanged).

  [✅]addTaskInToDo — ensure todo_name, task_name, task_desc are parsed in order.

  [✅]listTodo — command is set and handler doesn't mutate parser fields .

  [✅] listTasks — todo_name parsed from args.

  [✅] markTaskDone — todo_name and task_name parsed from args.

  [✅] deleteTask — todo_name and task_name parsed.

  [✅] deleteTodo — todo_name parsed.


  [✅] extra args — extra arguments beyond what's used by a handler are ignored (only the expected positions get consumed).
```

[✅] i have to divide the file of cli-input for better readability .

[done] i need to fix the memory.js to accept the changes of the database .

[] i have to fix the consistency in the sending response of the object
