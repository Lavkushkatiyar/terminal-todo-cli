# Architecture

- Main App
- interface layer
- memory

# directory Structure

/Todo

- src/
- test/

# required Files

- coverage ,
- @inquirer/prompts
- gitignore
- src directory
- test directory

# schema details

Todo List -

## todo

- todo_id primary Key autoIncrement
- todo_name Text not Null
- completed Text not null
- creation_time Default CURRENT_TIMESTAMP

## task

- task_id primary Key autoIncrement
- task_name Text not Null
- description Text not Null
- completed Text not null
- creation_time Default CURRENT_TIMESTAMP

# In memory Structure

```js
addTaskInTodo = ToDo_name , task_name,task_desc,
tables = {}

TODO{[
todos = ["todo1","todo2"];
task = ["task1","task2"];
todos = [
"todo1": {todo_id,todo_name,completed,creationTime},
"todo2": {todo_id,todo_name,completed,creationTime}
]
tasks = [
"task1": {todo_id,task_id,task_name,desc,completed,creationTime},
"task2": {todo_id,task_id,task_name,desc,completed,creationTime},
]
 
]
}
```

# dependencies

- test
- SQLite - For data persistence
- @inquirer/prompts - For building the terminal UI

```
```

# functions

- createDb = () => simple returns a database
- initializeDB (db,tables) => creates given tables in given database
- createTodo(todo_name , desc)
- createTask (todo_id,task_name,desc)
- createTask() => task_name , task_description

# task To do

- [Y] import all the dependencies (@inquirer/prompts)
- [Y] create the directory Structure
- [Y] add task to task to dev (coverage , test )
- [Y] add files in gitIgnore (Plan.md ,gitIgnore,coverage)
