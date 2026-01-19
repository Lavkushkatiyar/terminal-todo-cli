# Terminal Todo App

A command-line todo list manager with support for multiple todo lists. 

## Features

### Todo Management
- **Create a todo** - Start a new todo list
- **List multiple todos** - View all your todo lists
- **Delete a todo** - Remove a todo list

### Task Management
- **List tasks** - View all tasks in a todo list
- **Create a task** - Add a new task to a todo list
- **Mark task done/undone** - Toggle task completion status
- **Delete a task** - Remove a task from a todo list

## Technical Requirements

### Dependencies
- **SQLite** - For data persistence
- **@inquirer/prompts** - For building the terminal UI

### Testing
Your code should be thoroughly tested.

## Important Note
**This is a substantial assignment.** You cannot succeed by jumping straight into coding.

### Before You Start Coding

This assignment requires careful thought about:
- How data should be structured in the database
- How the user will navigate through menus
- How different operations will interact with each other

### Breaking Down the Problem

Your success depends on breaking this into **small, manageable chunks**. Here's how to approach it:

1. **Create an Implementation Plan**
   - List every feature you need to build
   - Break each feature into smaller steps
   - Identify dependencies between features
   - Plan the database schema first

2. **Work Incrementally**
   - Start with the simplest feature (e.g., create and list todos)
   - Get it working completely before moving on
   - Test each piece before adding the next
   - Commit working code frequently

3. **Example of Breaking Down "Create a Task"**
   - Start with in-memory data structure (array of tasks)
   - Create a data layer abstraction (functions like `addTask()`, `getTasks()`)
   - Build the UI prompt to get task details
   - Make it work end-to-end with in-memory storage
   - Test the complete flow
   - Design the database table for tasks
   - Replace in-memory implementation with database calls (keeping the same abstraction)
   - Handle errors (what if the todo doesn't exist?)
