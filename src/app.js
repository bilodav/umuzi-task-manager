// Task Management Application - Starter Code with Errors

import {
  generateRandomId,
  loadFromStorage,
  saveToStorage,
  priorities,
} from "./utils.js";

// Global variables
export const taskList = []; // Added const as it will always be an array

/**
 * Represents a single task with a title, id, description, priority, and completion state.
 */
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
  }
}

/**
 * A Task that belongs to a parent Task, identified by the parentId.
 */
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
        // Added validation: reject corrupted saved tasks witha bad priority
        if (!priorities[priority]) {
          {
            throw new Error(`Invalid saved priority: ${priority}`);
          }
        }
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
  const total = tasks.reduce(
    (sum, task) => sum + (priorities[task.priority] ?? 0),
    0,
  );
  return Number(total / tasks.length).toFixed(2);
}

function createPriorityFilter(priority) {
  return (task) => task.priority === priority;
}

function createSearchMatch(searchTerm) {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return (task) => task.title.toLowerCase().includes(lowerCaseSearchTerm);
}

export const TaskManager = {
  tasks: taskList,
  /**
   * Creates and stores a new Task after validating all its fields.
   * @param {string} title - The task title (required, non-empty).
   * @param {string} description - The task description.
   * @param {string} priority - One of "low" | "medium" | "high".
   * @returns {Task|undefined} The created Task, or undefined if validation failed.
   */
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
      saveToStorage(this.tasks);
      return newTask;
    } catch (error) {
      console.error("Could not add task:", error.message);
    }
  },

  addMultipleTasks(...tasksData) {
    // Added a /every check to validate the whole batch up front
    const allValid = tasksData.every(
      ([title, description, priority]) =>
        typeof title === "string" &&
        title.trim() !== "" &&
        typeof description === "string" &&
        !!priorities[priority],
    );

    if (!allValid) {
      console.error(
        "addMultipleTasks: one or more tasks in the batch are invalid",
      );
      return [];
    }

    return tasksData.map(([title, description, priority]) =>
      this.addTask(title, description, priority),
    );
  },

  removeTask(taskId) {
    // Added the type/shape validation as per feedback: taskId must resolve to a real number
    if (
      taskId === undefined ||
      taskId === null ||
      Number.isNaN(Number(taskId))
    ) {
      console.error("Invalid tasked id passed to removeTask");
      return false;
    }

    // First I find all the ids I need to remove
    const idsToRemove = this.tasks
      .filter(
        (task) =>
          task.id === Number(taskId) || task.parentId === Number(taskId),
      )
      .map((task) => task.id);

    // loop over the tasks array and remove the matching tasks in place, preserving the array reference
    idsToRemove.forEach((id) => {
      const index = this.tasks.findIndex((task) => task.id === id);
      if (index !== -1) this.tasks.splice(index, 1);
    });
    saveToStorage(this.tasks);
    return true;
  },

  removeMultipleTasks(...taskIds) {
    return taskIds.map((id) => this.removeTask(id));
  },
  toggleTaskCompletion(taskId) {
    const task = this.tasks.find((task) => task.id === Number(taskId));
    if (!task) {
      console.error(`toggleTaskCompletion: no task found for id ${taskId}`);
      return false;
    }
    task.toggleCompletion();
    saveToStorage(this.tasks);
    return true;
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
  /**
   * Recursively counts completed tasks starting at the given index.
   * @param {number} [index=0] - The index to start counting from.
   * @returns {number} The count of completed tasks from index to the end.
   */
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

    return this.tasks.filter(createSearchMatch(filterby));
  },

  /**
   * Filters the task list by priority or completion status.
   * @param {string} filterby - One of "all" | "done" | "not-done" | "low" | "medium" | "high".
   * @returns {Array<Task>} A new filtered array.
   */
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
  /**
   * Returns a sorted copy of the given tasks array without mutating it.
   * @param {Array<Task>} tasks - Tasks to sort.
   * @param {string} sortBy - One of "order-added" | "high" | "low" | "done" | "not-done".
   * @returns {Array<Task>} A new sorted array.
   */
  sortTasks(tasks, sortBy) {
    if (!Array.isArray(tasks)) {
      console.error("sortTasks: expected an array of tasks");
      return [];
    }
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
    //Added type/shape validation to match addTask's guards as per the feedback recieved
    if (typeof title !== "string" || title.trim() === "") {
      console.error("Subtask title is required and must be text");
      return null;
    }
    if (!priorities[priority]) {
      console.error(
        `The ${priority} is invalid, It must be either low, medium or high`,
      );
      return null;
    }

    const parentTask = this.tasks.find((task) => task.id === Number(parentId));
    if (!parentTask) {
      console.error(`addSubtask: no parent task found for id ${parentId}`);
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
