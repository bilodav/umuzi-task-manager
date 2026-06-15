// Utilities - Starter Code (WITH ERRORS AND MISSING FEATURES)

// Bug: Not using proper data structures
const priorities = ["low", "medium", "high"];

// Bug: Missing JSON operations
function saveToStorage(data) {
  // Bug: Not converting to JSON
  localStorage.setItem("tasks", data);
}

function loadFromStorage() {
  // Bug: Not parsing JSON
  var data = localStorage.getItem("tasks");
  return data;
}

// Bug: Incorrect Math object usage
// function generateRandomId() {
//   return Math.floor(Math.random() * 10000); // FIXED - Bug: Returns decimal, not integer
// }
// Better way for edge cases where app gets bigger than the fixed amount or getting the same random number twice

function generateRandomId() {
  return Date.now();
}

// Bug: Poor string manipulation
function formatTaskName(name) {
  // Fixed Bug: string methods used properly
  const result = name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
  return result; // Now Capitalizes, trim, etc.
}

// Bug: Incorrect boolean logic
function isHighPriority(task) {
  if (task.priority == "high") {
    // Bug: Using ==
    return "yes"; // Bug: Should return boolean
  }
  return "no";
}

// Missing: Class definitions
// Missing: Inheritance example
// Missing: Module exports
// Missing: Proper use of operators (logical, comparison)
// Missing: Recursion
// Missing: Functional programming patterns
// Missing: Proper scope demonstration

//this is utils.js
