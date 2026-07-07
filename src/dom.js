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
  console.log("LOADED THE DOM");
  loadTasks();
  displayTasks();
  // Corrected selector method
  const addButton = document.querySelector(".add-task-btn"); // Changed to querySelector
  const taskInput = document.querySelector("#task-input"); // Added # ************************* DOES NOT EXIT IN DOM
  const prioritySelect = document.getElementById("priority");
  const taskListContainer = document.getElementById("task-list");

  // Added null checks before adding listeners

  if (!addButton || !prioritySelect) {
    console.log("missing button");
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
  console.log("I Clicked Add Task");
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

function displayTasks() {
  const taskListContainer = document.getElementById("task-list");
  const statisticsContainer = document.querySelector(".statistics");

  // Added null check
  if (!taskListContainer || !statisticsContainer) return;

  // Clearing existing content first

  taskListContainer.innerHTML = ``;
  statisticsContainer.innerHTML = ``;

  // Filtering the main list to ensure only top level is rendering or else subtasks ends up being rendered too
  const tasksToRender = TaskManager.getDisplayTasks(
    currentFilter,
    currentSort,
  ).filter((task) => !task.parentId);

  // using a for of loop
  for (const task of tasksToRender) {
    const { id, title, description, priority, completed } = task; //destructure the task object for simplicity of adding in

    // FIlter out to see if there is a subTask in the array that matches the id
    const subTasks = TaskManager.tasks.filter(
      (subTask) => subTask.parentId === id,
    );
    // Get all the subtask items into a list
    const subTaskItems = subTasks
      .map(
        (item) => `
    <li data-id=${item.id}>
    ${item.title}
    <span class="rmv-subTask" data-id=${item.id}>X</span>
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
                  <li data-id=${id} data-value="low">Low</li>
                  <li data-id=${id} data-value="medium">Medium</li>
                  <li data-id=${id} data-value="high">High</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div>
    
        <button class="${completed ? "active" : "non"}-completed-btn completed-btn" data-id=${id}>${completed ? "Mark as not done" : "Mark as Done"}</button>
        <button class="delete-btn" data-id=${id}>Delete</button>
        </div>
        ${
          completed
            ? ""
            : `<button class="add-subTask-btn" data-id=${id}>
        Add Subtask
        </button>`
        }
        
        <form class="subtask-input hidden" data-parent-id=${id}>
          <input type="text" class="subTask-title-input" placeholder="Enter a Subtask here" >
          <button type="submit" class="add-subTask-submit">Add</button>
        </form>
        <ol class="subtask-list">
        ${completed ? "" : subTaskItems}
        </ol>

      </div>
      `,
    );
  }

  if (TaskManager.getTotalTasks() === 0) {
    statisticsContainer.innerHTML = ``;
  } else {
    statisticsContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="stat-card">
      <p>Total Tasks:</p>
      <p>${TaskManager.getTotalTasks()}</p>
    </div>
    <div class="stat-card">
      <p>Total Tasks Completed :</p>
      <p>${TaskManager.countCompletedTasks(0)}</p>
    </div>
    <div class="stat-card">
      <p>Total Tasks Remaining :</p>
      <p>${TaskManager.getTotalIncompleteTasks()}</p>
    </div>
    <div class="stat-card">
      <p>Average Task Priority:</p>
      <p>${calculateAveragePriority(taskList)}</p>
    </div>
    <div class="filter-task-section">
      <fieldset>
      <label>Sort By:</label>
        <select id="sort-by">
          <option value="order-added">Order Added</option>
          <option value="high">Highest Priority First</option>
          <option value="low">Lowest Priority First</option>
          <option value="done">Completed Tasks</option>
          <option value="not-done">Uncompleted Tasks</option>
        </select>
      </fieldset>   
      <fieldset>
        <label>Filter By: </label>
        <select id="filter-by">
          <option value="all">All</option>
          <option value="high">Highest Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Lowest Priority</option>
          <option value="done">Completed Tasks</option>
          <option value="not-done">Uncompleted Tasks</option>
        </select>
      </fieldset>
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

function handleTaskClick(event) {
  const { id: taskId } = event.target.dataset; // Getting the task id per button as set using Object Destructuring

  if (event.target.classList.contains("completed-btn")) {
    // First I find where the taskList item matches the current btn's ID then save to a variable
    const task = TaskManager.tasks.find(
      (task) => task.id === Number(taskId), // converting to Number because HTML only saves strings
    );
    task.toggleCompletion(); // class handles the logic here of setting the completion status
    displayTasks(); //re-render my screen
  }

  if (event.target.classList.contains("delete-btn")) {
    TaskManager.removeTask(taskId);
    displayTasks(); //re-render my screen
  }

  // Check to see if status button is clicked, and then toggle hidden class the next sibling on the parent element
  if (event.target.classList.contains("change-status-btn")) {
    event.target.nextElementSibling.classList.toggle("hidden");
  }

  // Check if I am clicking the li element in my modal
  if (event.target.tagName === "LI") {
    console.log("clicked");
    TaskManager.updateTaskPriority(taskId, event.target.dataset.value);
    event.target.parentElement.classList.toggle("hidden");
    displayTasks();
  }

  //Check if I am clicking add subtas unhide the form and add the task
  if (event.target.classList.contains("add-subTask-btn")) {
    console.log("come back here");
    event.target.nextElementSibling.classList.toggle("hidden");
  }

  if (event.target.classList.contains("add-subTask-submit")) {
    event.preventDefault();
    const form = event.target.closest("form");
    const input = form.querySelector(".subTask-title-input");
    const parentId = form.dataset.parentId;
    const parentTask = TaskManager.tasks.find(
      (task) => task.id === Number(parentId),
    );

    TaskManager.addSubTask(input.value, "", parentTask.priority, parentId);

    form.classList.add("hidden");
    displayTasks();
  }

  if (event.target.classList.contains("rmv-subTask")) {
    const subTaskId = event.target.dataset.id;
    TaskManager.removeTask(subTaskId);
    displayTasks();
  }

  console.log(`Task clicked: ${taskId}`);
}

// Initialize (wrong placement - should use DOMContentLoaded)
document.addEventListener("DOMContentLoaded", setupEventListeners);

// this is dom.js
