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
export class Subtask extends Task {
  constructor(title, description, priority, parentId) {
    // Added super() call
    super(title, description, priority);
    this.parentId = parentId;
  }
  getInfo() {
    return `Subtask: ${this.title} (parent ID: ${this.parentId}) - Priority: ${this.priority}`;
  }
}

// Used correct Loop
export function displayAllTasks() {
  // Used for..of loop and of by one error automatically gone
  for (let task of taskList) {
    console.log(task.title);
  }
}

// This is used in dom.js on load to restore saved tasks
export function loadTasks() {
  const savedTasks = loadFromStorage();
  // destructure for ease of use
  savedTasks.forEach(
    ({ title, description, priority, completed, id, parentId }) => {
      try {
        let task;
        // check if the task has a parent id property to determine if it is a subtask
        if (parentId !== undefined && parentId !== null) {
          task = new Subtask(title, description, priority, parentId);
        } else {
          task = new Task(title, description, priority);
        }
        task.id = id; // set ID to old ID as opposed to generating a new one
        task.completed = completed;
        taskList.push(task);
      } catch (error) {
        console.error("Skipped a corruted saved task:", error.message);
      }
    },
  );
}

export function calculateAveragePriority(tasks) {
  //Ensure that tasks is actually an array and that it is greater than 0
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;
  const total = tasks.reduce((sum, task) => sum + priorities[task.priority], 0);
  return Number(total / tasks.length).toFixed(2);
}

function createPriorityFilter(priority) {
  return (task) => task.priority === priority;
}

export const TaskManager = {
  tasks: taskList,

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

  addMultipleTasks(...tasksData) {
    return tasksData.map(([title, description, priority]) =>
      this.addTask(title, description, priority),
    );
  },

  removeTask(taskId) {
    // First I find all the ids I need to remove
    const idsToRemove = this.tasks
      .filter(
        (task) =>
          task.id === Number(taskId) || task.parentId === Number(taskId),
      )
      .map((task) => task.id);

    // loop over the tasks array and remove the matching tasks in place, preserving the array reference
    for (let i = this.tasks.length - 1; i >= 0; i--) {
      if (idsToRemove.includes(this.tasks[i].id)) {
        this.tasks.splice(i, 1);
      }
    }
    taskCounter--;
    saveToStorage(this.tasks);
  },

  updateTaskPriority(taskId, newPriority) {
    // Added typeof check for parameters
    // Added null/undefined validation

    if (typeof newPriority !== "string" || !priorities[newPriority]) {
      console.error("Invalid property value");
      return false;
    }
    for (let task of this.tasks) {
      if (task.id === Number(taskId)) {
        task.priority = newPriority;
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
  countCompletedTasks(index = 0) {
    // Added base case check
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

  getSearchTask(filterby) {
    if (!filterby || filterby === "") {
      return [...this.tasks]; // spread to not mutate the original array
    }

    return this.tasks.filter((task) =>
      task.title.toLowerCase().includes(filterby.toLowerCase()),
    );
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
      return this.tasks.filter(createPriorityFilter(filterby));
    }

    return [...this.tasks]; //fallback incase some other filter slips through
  },

  getHighestPriorityTask() {
    if (this.tasks.length === 0) return null;
    const sorted = this.sortTasks(this.tasks, "high").filter(
      (task) => !task.parentId && !task.completed,
    );
    const [topTask] = sorted;
    return topTask;
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

  addSubtask(title, description, priority, parentId) {
    const parentTask = this.tasks.find((task) => task.id === Number(parentId));
    if (!parentTask) {
      console.log("Parent task not found");
      return null;
    }

    if (!title.trim()) {
      console.log("No title added");

      return null;
    }

    const newSubtask = new Subtask(
      title,
      description,
      priority,
      Number(parentId),
    );
    this.tasks.push(newSubtask);
    saveToStorage(this.tasks);
    return newSubtask;
  },
};

// This is app.js
