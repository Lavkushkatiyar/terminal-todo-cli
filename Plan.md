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
tables = {}

TODO{[
todos = ["todo1","todo2"];
task = ["task1","task2"];
todos = [
"todo1": {todo_id,todo_name,completed,creationTime},
"todo2": {todo_id,todo_name,completed,creationTime}
]
tasks = [
"task1": {task_id,task_name,desc,completed,creationTime},
"task2": {task_id,task_name,desc,completed,creationTime},
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

- createTask() => task_name , task_description

# task To do

- [] import all the dependencies (@inquirer/prompts)
- [Y] create the directory Structure
- [] add task to task to dev (coverage , test )
- [] add files in gitIgnore (Plan.md ,gitIgnore,coverage)
