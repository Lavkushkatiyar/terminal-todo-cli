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

## task

- task_id primary Key autoIncrement
- task_name Text not Null
- description Text not Null
- completed Text not null
- creation_time Default CURRENT_TIMESTAMP

# In memory Structure

```js
TODO{[

## tasks = {task_id ,name , description , completed , creation_time}
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
- [] create the directory Structure
- [] add task to task to dev (coverage , test )
- [] add files in gitIgnore (Plan.md ,gitIgnore,coverage)
