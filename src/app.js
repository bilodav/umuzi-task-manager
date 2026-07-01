// Task Management Application - Starter Code with Errors

import {
  generateRandomId,
  loadFromStorage,
  saveToStorage,
  priorities,
} from "./utils.js";

// Global variables
export const taskList = []; // Added const as it will always be an array
let taskCounter = 0; // Used let

// Task class with errors
export class Task {
  constructor(title, description, priority) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.completed = false;
    this.id = generateRandomId();
  }

  getInfo() {
    // return now using template literals
    return `Task: ${this.title} - Priority: ${this.priority}`;
  }

  // Added method to toggle completion
  toggleCompletion() {
    this.completed = !this.completed;
    saveToStorage(taskList);
  }
}

// Subtask class with fixed inheritance issues
export class SubTask extends Task {
  constructor(title, description, priority, parentId) {
    // Added super() call
    super(title, description, priority);
    this.parentId = parentId;
  }
  getInfo() {
    return `Subtask: ${this.title} (parent ID: ${this.parentId}) - Priority: ${this.priority}`;
  }
}

// Functions with errors

// Function with no error handling
// export function addTask(title, description, priority) {
//   const newTask = new Task(title, description, priority); // changed to const
//   taskList.push(newTask);

//   taskCounter++;
//   console.log("New Task Added");
//   console.log(taskCounter);

//   console.log(taskList);

//   return newTask;
// }

// Added the function to TaskMAnger as central place to manage the tasks

// Used correct Loop *** can this be something more useful that printing the title to the console?
export function displayAllTasks() {
  // Used for..of loop and of by one error automatically gone
  for (let task of taskList) {
    console.log(task.title);
  }
}

// Function missing parameter
function findTaskByTitle() {
  // Missing: title parameter
  // Wrong loop construct
  var i = 0;
  while (i < taskList.length) {
    if (taskList[i].title === title) {
      // Fixed issue of using ==
      return taskList[i];
    }
    i++;
  }
  return undefined;
}

// +++++++++++++++ ADDED THIS FUNCTION TO THE TASK MANAGER +++++++++++++++++++++++
// // Function with type checking issues
// function updateTaskPriority(taskId, newPriority) {
//   // Missing: typeof check for parameters
//   // Missing: null/undefined validation

//   for (var i = 0; i < taskList.length; i++) {
//     if ((taskList[i].id = taskId)) {
//       // Wrong operator (= instead of ===)
//       taskList[i].priority = newPriority;
//       return true;
//     }
//   }
//   return false;
// }

// This is used in dom.js on load to restore saved tasks
export function loadTasks() {
  const savedTasks = loadFromStorage();
  savedTasks.forEach((item) => {
    // const task = new Task(item.title, item.description, item.priority); // convert back to task instances from the plain JS objects
    try {
      let task;
      // check if the task has a parent id property to determine if it is a subtask
      if (item.parentId !== undefined && item.parentId !== null) {
        task = new SubTask(
          item.title,
          item.description,
          item.priority,
          item.parentId,
        );
      } else {
        task = new Task(item.title, item.description, item.priority);
      }
      task.id = item.id; // set ID to old ID as opposed to generating a new one
      task.completed = item.completed;
      taskList.push(task);
    } catch (error) {
      console.error("Skipped a corruted saved task:", error.message);
    }
  });
}

// Function that should use destructuring but doesn't
function getTaskDetails(task) {
  // Should destructure task properties
  var title = task.title;
  var description = task.description;
  var priority = task.priority;
  var completed = task.completed;

  return {
    title: title,
    description: description,
    priority: priority,
    completed: completed,
  };
}

// Function missing spread/rest operators
function mergeTasks(list1, list2) {
  // Should use spread operator
  var merged = [];
  for (var i = 0; i < list1.length; i++) {
    merged.push(list1[i]);
  }
  for (var i = 0; i < list2.length; i++) {
    merged.push(list2[i]);
  }
  return merged;
}

// Recursive function with error
export function countCompletedTasks(tasks, index) {
  // Added base case check
  // Missing: null/undefined check
  if (index === tasks.length) return 0;

  if (tasks[index].completed) {
    return 1 + countCompletedTasks(tasks, index + 1);
  } else {
    return countCompletedTasks(tasks, index + 1);
  }
}

// Function with Math object issues
function calculateAveragePriority() {
  var total = 0;
  // Missing: check for empty array
  for (var i = 0; i < taskList.length; i++) {
    total = total + taskList[i].priority;
  }
  // Should use Math.round or toFixed
  return total / taskList.length;
}

// Filter function with errors
function getHighPriorityTasks(minPriority) {
  var highPriority = [];
  // Should use array methods (filter)
  for (var i = 0; i < taskList.length; i++) {
    if (taskList[i].priority > minPriority) {
      highPriority.push(taskList[i]);
    }
  }
  return highPriority;
}

// Object with missing methods
export const TaskManager = {
  tasks: taskList,

  // Missing: method to add task using functional approach
  // Missing: method using array methods (map, filter, reduce)

  addTask(title, description, priority) {
    try {
      if (typeof title !== "string" || title.trim() === "") {
        throw new Error("Task title is required and must be text");
      }
      if (typeof description !== "string") {
        throw new Error("Task description must be text");
      }
      if (!priorities[priority]) {
        throw new Error(
          `The ${priority} is invalid, It must be either low, medium or high`,
        );
      }
      const newTask = new Task(title, description, priority); // changed to const
      this.tasks.push(newTask);
      taskCounter++;
      saveToStorage(this.tasks);
      console.log(taskCounter);
      return newTask;
    } catch (error) {
      console.error("Could not add task:", error.message);
    }
  },

  removeTask(taskId) {
    // First I find where the Index of the taskList item that matches the current passed in btn's ID then save to a variable
    const taskIndex = this.tasks.findIndex(
      (task) => task.id === Number(taskId),
    );
    // Delete the index from the array using the splice method to mutate the original array
    this.tasks.splice(taskIndex, 1);
    taskCounter--;
    saveToStorage(this.tasks);
    console.log(taskCounter);
  },

  updateTaskPriority(taskId, newPriority) {
    // Missing: typeof check for parameters
    // Missing: null/undefined validation

    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === Number(taskId)) {
        // Operator fixed (=== instead of =)
        this.tasks[i].priority = newPriority;
        saveToStorage(this.tasks);
        return true;
      }
    }
    return false;
  },

  getTotalTasks() {
    return this.tasks.length;
  },

  getTotalCompletedTasks() {
    const completedList = this.tasks.filter((task) => task.completed === true);
    return completedList.length;
  },
  //Added count COmpleted tasks here in the taskManager too, waiting on clarification I think its better here, ensuring it can call itself
  countCompletedTasks(index = 0) {
    // Added base case check
    // Missing: null/undefined check
    if (index === this.tasks.length) return 0;

    if (this.tasks[index].completed) {
      return 1 + this.countCompletedTasks(index + 1);
    } else {
      return this.countCompletedTasks(index + 1);
    }
  },

  getTotalIncompleteTasks() {
    const completedList = this.tasks.filter((task) => task.completed === false);
    return completedList.length;
  },

  getFilteredTasks(filterby) {
    // Return the array as is if "all" is selected
    if (!filterby || filterby === "all") {
      return [...this.tasks]; // spread to not mutate the original array
    }

    if (filterby === "done") {
      return this.tasks.filter((task) => task.completed === true);
    }

    if (filterby === "not-done") {
      return this.tasks.filter((task) => task.completed === false);
    }

    if (filterby === "low" || filterby === "medium" || filterby === "high") {
      return this.tasks.filter((task) => task.priority === filterby);
    }

    return [...this.tasks]; //fallback incase some other filter slips through
  },

  sortTasks(tasks, sortBy) {
    // Make a copy first because sort mutates the original array
    const sorted = [...tasks];

    if (!sortBy || sortBy === "order-added") {
      return sorted; // List already in order added
    }

    if (sortBy === "done") {
      return sorted.sort((a, b) => b.completed - a.completed);
    }

    if (sortBy === "not-done") {
      return sorted.sort((a, b) => a.completed - b.completed);
    }

    if (sortBy === "high") {
      return sorted.sort(
        (a, b) => priorities[b.priority] - priorities[a.priority],
      );
    }

    if (sortBy === "low") {
      return sorted.sort(
        (a, b) => priorities[a.priority] - priorities[b.priority],
      );
    }

    return sorted;
  },

  getDisplayTasks(filterBy, sortBy) {
    const filtered = this.getFilteredTasks(filterBy);
    return this.sortTasks(filtered, sortBy);
  },

  addSubTask(title, description, priority, parentId) {
    const parentTask = this.tasks.find((task) => task.id === Number(parentId));
    if (!parentId) {
      console.log("Parent task not found");
      return null;
    }

    const newSubTask = new SubTask(
      title,
      description,
      priority,
      Number(parentId),
    );
    this.tasks.push(newSubTask);
    saveToStorage(this.tasks);
    return newSubTask;
  },
};

// Export issues - should be a module
// Missing: proper module exports
// This is app.js
