// Jest Tests - Starter Code with Errors and Missing Tests

import {
  Task,
  taskList,
  TaskManager,
  countCompletedTasks,
} from "../src/app.js";

// Added the imports

//Mocking utilis.js by using fake versions of the the required functions
jest.mock("../src/utils.js", () => ({
  generateRandomId: () => Date.now(),
  loadFromStorage: () => [],
  saveToStorage: () => {}, // Empty function because we dont need real storage in the test
}));

describe("Task Class", () => {
  test("should create a task with the correct properties", () => {
    const task = new Task("Test Task", "Description", 3);
    expect(task.title).toBe("Test Task");
    expect(task.description).toBe("Description");
    expect(task.priority).toBe(3);
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

  test("setCompleted should toggle completion", () => {
    const task = new Task("Test Task", "Description", 3);
    expect(task.completed).toBe(false);
    task.setCompleted();
    expect(task.completed).toBe(true);
    task.setCompleted();
    expect(task.completed).toBe(false);
  });

  // Missing: test for toggle completion
});

// describe("Task Functions", () => {
// Missing: beforeEach to reset taskList

// test("should add task", () => {
// var task = addTask("New Task", "Test", 2);
// Wrong assertion - should check taskList
// expect(task).toBeDefined();
// });

// Missing: test for findTaskByTitle
// Missing: test for updateTaskPriority
// Missing: test for calculateAveragePriority
// Missing: test for error handling
// });

// describe("Array Operations", () => {
// Missing: tests for mergeTasks
// Missing: tests for getHighPriorityTasks
// Missing: tests for recursive function
// });

// Missing: describe blocks for:
// - SubTask class and inheritance
// - Destructuring functions
// - Spread/rest operator functions
// - Module exports/imports
