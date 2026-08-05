import {
  taskList,
  TaskManager,
  loadTasks,
  calculateAveragePriority,
} from "./app.js";
import { formatTaskName, priorities } from "./utils.js";
// DOM Manipulation - Starter Code with Errors

// Added the proper DOM selectors
function setupEventListeners() {
  loadTasks();
  displayTasks();
  // Corrected selector method
  const addButton = document.querySelector(".add-task-btn"); // Changed to querySelector
  const prioritySelect = document.getElementById("priority");
  const taskListContainer = document.getElementById("task-list");

  // Added null checks before adding listeners

  if (!addButton || !prioritySelect || !taskListContainer) {
    console.error("setupEventListeners: required DOM elements not found");
    return;
  }

  // Adding the options dynamically using the single source of truth [priorities] located in utilis.js

  Object.keys(priorities).forEach((priority) => {
    prioritySelect.insertAdjacentHTML(
      "beforeend",
      `
      <option value=${priority}>${formatTaskName(priority)}</option>
      `,
    );
  });

  addButton.addEventListener("click", handleAddTask);
  taskListContainer.addEventListener("click", handleTaskClick);

  // Close modals when clicking outside of the modal
  // Add listener on document to listen for a click
  document.addEventListener("click", (event) => {
    const openModals = document.querySelectorAll(
      ".task-card-modal-select:not(.hidden)",
    );
    if (openModals.length === 0) return; // no open modals, then exit the function

    openModals.forEach((modal) => {
      // check if user is not clicking the modal & the change status button
      if (
        !modal.contains(event.target) &&
        !event.target.classList.contains("change-status-btn")
      ) {
        modal.classList.add("hidden");
      }
    });
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "search-by-title") {
      currentSearch = event.target.value;
      displayTasks();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.id === "filter-by") {
      currentFilter = event.target.value;
      displayTasks();
    }

    if (event.target.id === "sort-by") {
      currentSort = event.target.value;
      displayTasks();
    }
  });
}

function handleAddTask(e) {
  e.preventDefault();
  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const prioritySelect = document.getElementById("priority");

  const title = titleInput.value;
  const description = descInput.value;
  const priority = prioritySelect.value;
  // Added priority input

  TaskManager.addTask(title, description, priority);
  displayTasks();

  // Added clearing inputs after adding values

  titleInput.value = "";
  descInput.value = "";
  prioritySelect.value = "low";
}

let currentFilter = "all";
let currentSort = "order-added";
let currentSearch = "";

function displayTasks() {
  const filterListContainer = document.querySelector(".filter-task-section");
  const taskListContainer = document.getElementById("task-list");
  const statisticsContainer = document.querySelector(".statistics");

  // Added null check
  if (!taskListContainer || !statisticsContainer || !filterListContainer)
    return;

  //Check if there are any tasks , and if so display the filter section
  if (TaskManager.tasks.length) {
    filterListContainer.classList.remove("hidden");
  } else {
    filterListContainer.classList.add("hidden");
  }

  // Clearing existing content first

  taskListContainer.innerHTML = ``;
  statisticsContainer.innerHTML = ``;

  // Filtering the main list to ensure only top level is rendering or else subtasks ends up being rendered too
  let tasksToRender;

  if (currentSearch) {
    tasksToRender = TaskManager.getSearchTask(currentSearch).filter(
      (task) => !task.parentId,
    );
  } else {
    tasksToRender = TaskManager.getDisplayTasks(
      currentFilter,
      currentSort,
    ).filter((task) => !task.parentId);
  }

  // using a for of loop
  for (const task of tasksToRender) {
    const { id, title, description, priority, completed } = task; //destructure the task object for simplicity of adding in

    // FIlter out to see if there is a subtask in the array that matches the id
    const subtasks = TaskManager.tasks.filter(
      (subtask) => subtask.parentId === id,
    );
    // Get all the subtask items into a list
    const subtaskItems = subtasks
      .map(
        (item) => `
    <li class=${item.completed ? "completed-task" : ""} data-id=${item.id}>
    <span class="subtask-title">${item.title}</span>
    <div>
    <span title="Toggle Completion" class="complete-subtask" data-id=${item.id}>✔</span>
    <span title="Delete Subtask" class="rmv-subtask" data-id=${item.id}>×</span>
    </div>
    </li>
    `,
      )
      .join("");

    taskListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="task-card task-card-${completed ? "completed" : priority}">
        <div class="task-card-heading">
        <h3> ${title}</h3>
        <p>ID: ${id} </p>
        </div>
        <p> ${description}</p>
        <div class="task-card-status">
          <p class="${completed ? "green" : null}"> 
          <span>Status:</span> ${completed ? "Done" : "Still Busy"}
          </p>
          <div class="priority-status-wrapper">
            <p class="priority-${priority}"> 
            <span>Priority:</span> ${formatTaskName(priority)} 
            </p>
            <div class="status-btn-wrapper">
              <span class="change-status-btn" title="Change Status">⌄</span>
              <div class="task-card-modal-select hidden ">
                <ol>
                  <li class="priority-option" data-id=${id} data-value="low">Low</li>
                  <li class="priority-option" data-id=${id} data-value="medium">Medium</li>
                  <li class="priority-option" data-id=${id} data-value="high">High</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div>
    
        <button class="${completed ? "active" : "non"}-completed-btn completed-btn" data-id=${id}>${completed ? "Mark as not done" : "Mark as Done"}</button>
        <span class="red-message d-hidden">All subtasks must be marked as completed</span>
        <button class="delete-btn" data-id=${id}>Delete</button>
        </div>
        ${
          completed
            ? ""
            : `<button class="add-subtask-btn" data-id=${id}>
        Add Subtask
        </button>`
        }
        
        <form class="subtask-input hidden" data-parent-id=${id}>
          <input type="text" class="subtask-title-input" placeholder="Enter a Subtask here" >
          <button type="submit" class="add-subtask-submit">Add</button>
        </form>
        <ol class="subtask-list">
        ${completed ? "" : subtaskItems}
        </ol>

      </div>
      `,
    );
  }

  const topTask = TaskManager.getHighestPriorityTask();

  if (TaskManager.getTotalTasks() === 0) {
    statisticsContainer.innerHTML = ``;
  } else {
    statisticsContainer.insertAdjacentHTML(
      "beforeend",
      `
    <h2>Stats: </h2>
    ${
      topTask
        ? `<div class="stat-card">
                    <p>Next Highest Priority:</p>
                    <p>${topTask.title}</p>
                  </div>`
        : ""
    }
    
    <div class="stat-card">
      <p>Total Tasks: </p>
      <p>${TaskManager.getTotalTasks()}</p>
    </div>
    <div class="stat-card">
      <p>Total Tasks Completed: </p>
      <p>${TaskManager.countCompletedTasks(0)}</p>
    </div>
    <div class="stat-card">
      <p>Total Tasks Remaining: </p>
      <p>${TaskManager.getTotalIncompleteTasks()}</p>
    </div>
    <div class="stat-card">
      <p>Average Task Priority: </p>
      <p>${calculateAveragePriority(taskList.filter((task) => !task.parentId && !task.completed))}</p>
    </div>
    `,
    );
    // After The DOM Rebuilds I keep losing the current state of my select buttons. In order to fix it I am restoring the values
    const filterSelect = document.getElementById("filter-by");
    const sortSelect = document.getElementById("sort-by");

    if (filterSelect) filterSelect.value = currentFilter; // if the filter exist in the DOM set it to the curr value
    if (sortSelect) sortSelect.value = currentSort; //if the sort option exists in the DOM set it to the curr value
  }
}

// A helper function t o centralize the "perform an action then re render" pattern so displayTasks() is not repeated everytime state changes as per the feedback recieved
function rerenderAfter(action) {
  action();
  displayTasks();
}

function handleTaskClick(event) {
  const { id: taskId } = event.target.dataset; // Getting the task id per button as set using Object Destructuring

  if (event.target.classList.contains("completed-btn")) {
    //Search if a subtask belonging to this task isnt completed yet
    const hasIncompletedSubtask = TaskManager.tasks.some(
      (t) => t.parentId === Number(taskId) && !t.completed,
    );

    if (hasIncompletedSubtask) {
      //Added a defensive null check using optional chaining, as nextElementSibling is not guaranteed to exist
      event.target.nextElementSibling?.classList.remove("d-hidden");
      setTimeout(() => {
        event.target.nextElementSibling?.classList.add("d-hidden");
      }, 5000);
      return;
    }

    rerenderAfter(() => TaskManager.toggleTaskCompletion(taskId));
    return;
  }

  if (event.target.classList.contains("delete-btn")) {
    rerenderAfter(() => TaskManager.removeTask(taskId));
    return;
  }

  // Check to see if status button is clicked, and then toggle hidden class the next sibling on the parent element
  if (event.target.classList.contains("change-status-btn")) {
    event.target.nextElementSibling.classList.toggle("hidden");
    return;
  }

  // Fixed this so that it is scoped by class and not tagName, subtask <li> elements share the same tag and were incorrectly matching this branch too
  if (event.target.classList.contains("priority-option")) {
    rerenderAfter(() => {
      TaskManager.updateTaskPriority(taskId, event.target.dataset.value);
      event.target.parentElement.classList.toggle("hidden");
    });
    return;
  }

  //Check if I am clicking add subtask unhide the form and add the task
  if (event.target.classList.contains("add-subtask-btn")) {
    //Added a defensive null check using optional chaining, as nextElementSibling is not guaranteed to exist
    event.target.nextElementSibling?.classList.toggle("hidden");
    return;
  }

  if (event.target.classList.contains("add-subtask-submit")) {
    event.preventDefault();
    const form = event.target.closest("form");
    const input = form.querySelector(".subtask-title-input");

    // Added defensive null check to bail out cleanly if the expected form/input aren't found
    if (!form || !input) {
      console.error("Could not find the subtask form or input");
      return;
    }

    const parentId = form.dataset.parentId;
    const parentTask = TaskManager.tasks.find(
      (task) => task.id === Number(parentId),
    );

    rerenderAfter(() => {
      TaskManager.addSubtask(input.value, "", parentTask?.priority, parentId);
      form.classList.add("hidden");
    });

    return;
  }

  if (event.target.classList.contains("complete-subtask")) {
    const subtaskId = event.target.dataset.id;

    rerenderAfter(() => TaskManager.toggleTaskCompletion(subtaskId));
    return;
  }

  if (event.target.classList.contains("rmv-subtask")) {
    const subtaskId = event.target.dataset.id;
    rerenderAfter(() => TaskManager.removeTask(subtaskId));
    return;
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", setupEventListeners);
