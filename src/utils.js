// Utilities - Starter Code

export const priorities = { low: 1, medium: 2, high: 3 };
/**
 * Persists an array of tasks to localStorage in JSON format.
 * @param {Array<Object>} data - The array of task objects to save.
 * @returns {void}
 */

export function saveToStorage(data) {
  // Added: validate shape before writing, so a bad call site can't silently corrupt storage
  if (!Array.isArray(data)) {
    console.error("saveToStorage: expected an array, but got", typeof data);
    return;
  }
  try {
    localStorage.setItem("tasks", JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save tasks to storage:", error.message);
  }
}

/**
 * Loads and parses the saved task array from localStorage.
 * @returns {Array<Object>} The parsed tasks, or an empty array if none exist or the parsing fails.
 */
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

/**
 * Generates a unique ID based on the current timestamp in milliseconds.
 * @returns {number}
 */
export function generateRandomId() {
  return Date.now();
}

/**
 * Capitalizes and trims a task-related label for display (e.g. priority names).
 * @param {string} name - The raw string to be formatted.
 * @returns {string} The formatted string, or "Unknown" if input is invalid.
 */
export function formatTaskName(name) {
  // Added guard so that the app won't crash the render loop on a missing/invalid value
  if (typeof name !== "string" || name.trim() === "") {
    return "Unknown";
  }
  // Fixed Bug: string methods used properly
  const result = name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
  return result; // Now Capitalizes, trim, etc.
}
