// Utilities - Starter Code

export const priorities = { low: 1, medium: 2, high: 3 };

export function saveToStorage(data) {
  // Fixed now converting to JSON
  try {
    localStorage.setItem("tasks", JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save tasks to storage:", error.message);
  }
}

export function loadFromStorage() {
  // Fixed now parsing JSON
  try {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : []; // if data is available in storage parse it, if not use an empty array so as to not break the app
  } catch (error) {
    console.error("Failed to load tasks from storage:", error.message);
    return []; // if Bad JSON is parsed the app should still start with an empty list now
  }
}

// function generateRandomId() {
//   return Math.floor(Math.random() * 10000); // FIXED - Bug: Returns decimal, not integer
// }
// Better way for edge cases where app gets bigger than the fixed amount or getting the same random number twice

export function generateRandomId() {
  return Date.now();
}

export function formatTaskName(name) {
  // Fixed Bug: string methods used properly
  const result = name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
  return result; // Now Capitalizes, trim, etc.
}

export function isHighPriority(task) {
  if (task.priority === "high") {
    // Fixed now Using ===
    return true; // Fixed now returns boolean
  }
  return false;
}
