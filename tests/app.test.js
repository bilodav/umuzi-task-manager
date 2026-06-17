// Jest Tests - Starter Code with Errors and Missing Tests

import {
  Task,
  taskList,
  TaskManager,
  countCompletedTasks,
} from "../src/app.js";

// Missing: proper imports/requires

describe("Task Class", () => {
  test("should create a task", () => {
    const task = new Task("Test Task", "Description", 3);
    expect(task.title).toBe("Test Task");
    // expect(task.description).toBe("Description");
    // expect(task.priority).toBe(3);
    // expect(task.completed).toBe(false);
    // Missing: other property checks
  });

  // Missing: test for getInfo method
  // Missing: test for toggle completion
});
