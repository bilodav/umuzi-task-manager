# Task Manager

A vanilla JavaScript task management app built to demonstrate ES6+ fundamentals: classes and inheritance, functional array methods, destructuring/spread/rest, DOM manipulation with event delegation, localStorage persistence, and Jest testing.

## Overview

Users can add tasks with a title, description, and priority; toggle completion; add subtasks under a parent task; filter/sort/search the list; and see live stats (total, completed, remaining, average priority). All state is persisted to `localStorage` and reloaded on page load.

## Errors Found (by category)

- **Variables/Operators (8):** implicit global `taskList`, `var` instead of `let`/`const`, `==` instead of `===`, `=` instead of `===` in a conditional, missing `typeof` guards.
- **Control Flow (7):** off-by-one `for` loop (`<=` instead of `<`), infinite `while` loop (missing increment), imperative loops used where `for...of` fit better.
- **Functions (10):** `findTaskByTitle` missing its parameter entirely, recursive `countCompletedTasks` missing a base case, no pure functions, no higher-order function, no rest parameters.
- **OOP (6):** `Task` missing `id` and `toggleCompletion()`, `Subtask` calling `this` before `super()`, `TaskManager` missing required methods.
- **Modern JS (6):** no destructuring, no template literals (string concatenation instead), no spread/rest usage.
- **DOM (8):** wrong selector syntax (`getElementById(".add-task-btn")`), no null checks, listeners attached before `DOMContentLoaded`, missing `preventDefault()`, no event delegation for dynamically-added elements.
- **Testing (4):** no imports in the test file, no `beforeEach` reset, fewer than the required test count.
- **Error Handling/Quality (3):** no `try/catch` anywhere, no input validation, `JSON.stringify`/`JSON.parse` missing from storage functions.

## Fixes Implemented

- Converted every `var` to `let`/`const`; replaced all `==`/`=` misuse with `===`.
- Fixed the off-by-one loop and the missing-increment infinite loop; introduced `for...of` loops in task iteration.
- Added the missing parameter to `findTaskByTitle`, rewritten with `Array.prototype.find`.
- Added a base case to `countCompletedTasks` so the recursion terminates on an empty list.
- Added `id` and `toggleCompletion()` to `Task`; fixed `Subtask` to call `super()` first.
- Rebuilt `TaskManager` with additional methods: filtering, sorting, searching, subtask handling, and stats.
- Replaced concatenation with template literals throughout `dom.js` and `app.js`.
- Added object and array destructuring, spread (`[...this.tasks]` for non-mutating copies), and rest parameters (`mergeTaskLists(...taskArrays)`).
- Corrected DOM selectors, added null checks before every DOM operation, moved initialization inside `DOMContentLoaded`, and delegated click handling on the task list container instead of binding listeners per task.
- Implemented `JSON.stringify`/`JSON.parse` in `saveToStorage`/`loadFromStorage`, wrapped in `try/catch`.

## Features Added

- ES6 classes with inheritance (`Task` → `Subtask`)
- Functional array methods: `map`, `filter`, `reduce`, `find`
- A custom higher-order function (`withValidation`) and pure functions (`calculateAveragePriority`, `formatTaskName`, `isHighPriority`)
- Recursive completed-task counter with a proper base case
- Destructuring (object, array, and function-parameter forms), spread, and rest operators
- Event delegation for all task-card interactions (complete, delete, change priority, add subtask)
- `localStorage` persistence via `JSON.stringify`/`JSON.parse`
- 3 ES6 modules (`app.js`, `dom.js`, `utils.js`) with `import`/`export`

## Running the Application

1. Clone the repository and open `index.html` in a browser (or serve it with a local static server, e.g. `npx serve`).
2. Add a task using the form; toggle, filter, sort, search, and delete tasks from the list.

## Running the Tests

```bash
npm install
npm test
```

**Latest test run:** `Test Suites: 1 passed, 1 total` · `Tests: 25 passed, 25 total`

Test coverage includes: `Task` creation and methods, `Subtask` inheritance, `TaskManager` CRUD operations, recursive counting (including the empty-list edge case), filtering/sorting, and `calculateAveragePriority` (including empty-array and non-array edge cases).

## Screenshots

> Add your own screenshots to `screenshots/` and reference them here before submitting:

- `app-running.png` — application running in the browser
- `console-no-errors.png` — browser console with no errors
- `tests-passing.png` — `npm test` output showing 25/25 passing
- `dom-features.png` — filtering/sorting/subtasks working live

## Reflection

The trickiest bug was the recursive `countCompletedTasks` function — without a base case it would recurse past the end of the array and throw, so tracing the stack to find where `this.tasks[index]` became `undefined` was the key debugging step. The second challenge was untangling `TaskManager.tasks` as an alias for the exported `taskList` array: mutating one had to reliably mutate the other, which shaped how `removeTask` and the Jest `beforeEach` reset (`taskList.splice(0, taskList.length)`) were written.
