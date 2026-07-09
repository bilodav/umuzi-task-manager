// Jest Tests - Starter Code with Errors and Missing Tests

import {
  Task,
  Subtask,
  TaskManager,
  taskList,
  calculateAveragePriority,
} from "../src/app.js";
import { priorities } from "../src/utils.js";

// Added the imports

let mockIdCounter = 0;

//Mocking utilis.js by using fake versions of the the required functions
jest.mock("../src/utils.js", () => ({
  generateRandomId: () => mockIdCounter++,
  loadFromStorage: () => [],
  saveToStorage: () => {}, // Empty function because we dont need real storage in the test
  priorities: { low: 1, medium: 2, high: 3 },
}));

//taskList is a module-level array that TaskManager.tasks references in memory. Every test that adds taks mutates the same array, so without resetting later tests will see leftover tasks from the earlier oness. Because it is exported as a const, the best way to clear it would be to use splice

beforeEach(() => {
  taskList.splice(0, taskList.length);
  mockIdCounter = 0;
});

// -------------------------------
// Task Class
// -------------------------------

describe("Task Class", () => {
  test("should create a task with the correct properties", () => {
    const task = new Task("Test Task", "Description", "low");
    expect(task.title).toBe("Test Task");
    expect(task.description).toBe("Description");
    expect(task.priority).toBe("low");
    expect(task.completed).toBe(false);

    expect(task.id).toBeDefined(); // Since I do not know the exact number I am going to see if the id exists and is a number
    expect(typeof task.id).toBe("number");
    // Added all property checks
  });

  test("getInfo should return correct string", () => {
    const task = new Task("Test Task", "Description", 3);
    expect(task.getInfo()).toBe("Task: Test Task - Priority: 3");
  });
  // Added test for getInfo method

  test("toggleCompletion() should toggle completion", () => {
    const task = new Task("Test Task", "Description", "low");
    expect(task.completed).toBe(false);
    task.toggleCompletion();
    expect(task.completed).toBe(true);
    task.toggleCompletion();
    expect(task.completed).toBe(false);
  });

  // Added test for toggle completion
});

// -------------------------------
// SubTask inheritance
// -------------------------------

// Added test block for the SubTask inheritance
describe("SubTask inheritance", () => {
  test("SubTask should inherit Task properties via super()", () => {
    const parent = new Task("Parent", "Description", "low");
    const sub = new Subtask("Child", "Sub description", "low", parent.id);

    expect(sub.title).toBe("Child");
    expect(sub.priority).toBe("low");
    expect(sub.completed).toBe(false);
    expect(sub.parentId).toBe(parent.id);
    expect(sub instanceof Task).toBe(true);
  });

  test("SubTask should inherit methods from Task", () => {
    const parent = new Task("Parent", "Description", 2);
    const sub = new Subtask("Child", "Sub description", 1, parent.id);

    expect(sub.getInfo()).toBe(
      `Subtask: Child (parent ID: ${parent.id}) - Priority: 1`,
    );
    expect(typeof sub.toggleCompletion).toBe("function");
  });
});

// -------------------------------
// TaskManager.addTask
// -------------------------------

describe("TaskManager.addTask", () => {
  test("should add a valid task to the list", () => {
    const task = TaskManager.addTask("Buy Groceries", "Order online", "low");
    expect(TaskManager.tasks).toHaveLength(1);
    expect(task.title).toBe("Buy Groceries");
  });

  //Test that an edge case where an empty title is added should be rejected.
  test("should reject an empty title and does not add a task", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {}); // watches the console to inspect what was printed
    const result = TaskManager.addTask("", "Some description", "low");
    expect(result).toBeUndefined();
    expect(TaskManager.tasks).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore(); // Restores the original console.error()
  });

  //Test that should an invalid priority string be added must be rejected
  test("Should reject an invalid priority value", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = TaskManager.addTask(
      "some title",
      "some description",
      "super-low",
    );
    expect(result).toBeUndefined();
    expect(TaskManager.tasks).toHaveLength(0);
    consoleSpy.mockRestore();
  });
});

// -------------------------------
// TaskManager.removeTask
// -------------------------------

describe("TaskManager.removeTask", () => {
  test("Should remove a task by its id", () => {
    const task = TaskManager.addTask("Task 1", "Some description", "medium");
    TaskManager.removeTask(task.id);
    expect(TaskManager.tasks).toHaveLength(0);
  });

  test("When removing a parent task all children should also be removed", () => {
    const parentTask = TaskManager.addTask(
      "Parent title",
      "Parents Description",
      "medium",
    );
    TaskManager.addSubtask(
      "Child Title",
      "Childs description",
      "low",
      parentTask.id,
    );

    expect(TaskManager.tasks).toHaveLength(2);
    TaskManager.removeTask(parentTask.id);
    expect(TaskManager.tasks).toHaveLength(0);
  });
});

// -------------------------------
// TaskManager.updateTaskPriority
// -------------------------------

describe("TaskManager.updateTaskPriority", () => {
  test("SHould have the priority for a task to be updated", () => {
    const task = TaskManager.addTask("Task A", "The Description", "low");
    const result = TaskManager.updateTaskPriority(task.id, "high");
    expect(result).toBe(true);
    expect(task.priority).toBe("high");
  });

  // A test to check the edge case where an ivalid string is assigned and should be rejected and leave the task unchanged
  test("Should reject an invalid priority and the task must be unchanged", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const task = TaskManager.addTask("Task Title", "Some description", "low");
    const result = TaskManager.updateTaskPriority(task.id, "highly-urgent");
    expect(result).toBe(false);
    expect(task.priority).toBe("low");
    consoleSpy.mockRestore();
  });

  test("should return false for a task id thst does not exist", () => {
    const result = TaskManager.updateTaskPriority(6969, "high");
    expect(result).toBe(false);
  });
});

// -------------------------------
// Counting helper functions in TaskManger
// -------------------------------

describe("TaskManager counting methods", () => {
  test("getTotalTasks should show the number of tasks added", () => {
    TaskManager.addTask("Task 1", "Description 1", "low");
    TaskManager.addTask("B", "d", "medium");
    expect(TaskManager.getTotalTasks()).toBe(2);
  });

  //Edge case: base case of the recursion with zero tasks
  test("countCompletedTasks should return 0 on an empty task list", () => {
    expect(TaskManager.countCompletedTasks()).toBe(0);
  });

  test("countCompletedTasks must only recursively count completed tasks", () => {
    const a = TaskManager.addTask("Title A", "description", "low");
    TaskManager.addTask("Title B", "description 2", "low");
    const c = TaskManager.addTask("Title C ", "description C", "medium");
    a.toggleCompletion();
    c.toggleCompletion();
    expect(TaskManager.countCompletedTasks()).toBe(2);
  });

  test("getTotalIncompleteTasks should count all the tasks that are not completed", () => {
    const a = TaskManager.addTask("Title A", "Description A", "low");
    TaskManager.addTask("Title B", "description 2", "low");
    a.toggleCompletion();
    expect(TaskManager.getTotalCompletedTasks()).toBe(1);
  });
});

// -------------------------------
// Filtering and sorting methods
// -------------------------------

describe("TaskManager.getFilteredTasks", () => {
  test("The 'all' filter should return every task in the array", () => {
    TaskManager.addTask("Title A", "Description A", "low");
    TaskManager.addTask("Title B", "Description B", "medium");
    expect(TaskManager.getFilteredTasks("all")).toHaveLength(2);
  });

  test("The 'done' filter should return all completed tasks", () => {
    const taskA = TaskManager.addTask("Title A", "Description A", "low");
    TaskManager.addTask("Title B", "Description B", "medium");
    taskA.toggleCompletion();
    const done = TaskManager.getFilteredTasks("done");
    expect(done).toHaveLength(1);
    expect(done[0].title).toBe("Title A");
  });

  test("The priority filter should only return the tasks matching the priority", () => {
    TaskManager.addTask("Title A", "Description A", "low");
    TaskManager.addTask("Title B", "Description B", "high");
    TaskManager.addTask("Title C", "Description C", "high");

    const highOnly = TaskManager.getFilteredTasks("high");
    expect(highOnly).toHaveLength(2);
    expect(highOnly[0].title).toBe("Title B");
  });
});

describe("TaskManager.sortTasks", () => {
  test("The 'high' sort option should order tasks from high to low", () => {
    const all = [
      new Task("Low Task", "description", "low"),
      new Task("High Task", "description", "high"),
      new Task("Medium Task", "description", "medium"),
    ];
    const sorted = TaskManager.sortTasks(all, "high");
    expect(sorted.map((test) => test.priority)).toEqual([
      "high",
      "medium",
      "low",
    ]);
  });

  test("The sortTasks method should not mutate the original array", () => {
    const all = [
      new Task("Low Task", "description", "low"),
      new Task("High Task", "description", "high"),
    ];
    const originalOrder = all.map((task) => task.title);
    TaskManager.sortTasks(all, "high");
    expect(all.map((task) => task.title)).toEqual(originalOrder);
  });
});

// -------------------------------
// calculateAveragePriority
// -------------------------------

describe("calculateAveragePriority", () => {
  // Test for the edge case against an empty array on non array input
  test("Should return 0 for an emty array", () => {
    expect(calculateAveragePriority([])).toBe(0);
  });

  test("Should return 0 when given a non-array value", () => {
    expect(calculateAveragePriority(null)).toBe(0);
    expect(calculateAveragePriority(undefined)).toBe(0);
  });

  test("Should calcualte the average priority weight of a task list", () => {
    const tasks = [
      new Task("Low Task", "description", "low"),
      new Task("High Task", "description", "high"),
    ];

    expect(calculateAveragePriority(tasks)).toBe("2.00");
  });
});
