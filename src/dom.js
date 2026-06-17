import { taskList, TaskManager, countCompletedTasks } from "./app.js";
import { formatTaskName, priorities } from "./utils.js";
// DOM Manipulation - Starter Code with Errors

// Added the proper DOM selectors
function setupEventListeners() {
  console.log("LOADED THE DOM");

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
  priorities.forEach((priority) => {
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

  // Missing: other event listeners for form submission, etc. ************************************** DOES this form need to be here
}

// Function with DOM manipulation errors
function handleAddTask() {
  console.log("I Clicked Add Task");

  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const prioritySelect = document.getElementById("priority");

  // No validation
  // Should use event.preventDefault() if form *********************************************

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

// Function that should use better selectors
function displayTasks() {
  const taskListContainer = document.getElementById("task-list");
  const statisticsContainer = document.querySelector(".statistics");

  // Added null check
  if (!taskListContainer || !statisticsContainer) return;

  // Clearing existing content first

  taskListContainer.innerHTML = ``;
  statisticsContainer.innerHTML = ``;

  // Inefficient - should use template literals and insertAdjacentHTML ***********MAybe Gonna use a foreach here?
  for (let i = 0; i < taskList.length; i++) {
    // const div = document.createElement("div");
    // div.innerHTML = `<h3> ${taskList[i].title} </h3>`;
    // div.innerHTML = div.innerHTML + "<p>" + taskList[i].description + "</p>";
    // container.appendChild(div);

    taskListContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="task-card task-card-${taskList[i].completed ? "completed" : taskList[i].priority}">
        <div class="task-card-heading">
        <h3> ${taskList[i].title}</h3>
        <p>ID: ${taskList[i].id} </p>
        </div>
        <p> ${taskList[i].description}</p>
        <div class="task-card-status">
          <p class="${taskList[i].completed ? "green" : null}"> 
          <span>Status:</span> ${taskList[i].completed ? "Done" : "Still Busy"}
          </p>
          <div class="priority-status-wrapper">
            <p class="priority-${taskList[i].priority}"> 
            <span>Priority:</span> ${formatTaskName(taskList[i].priority)} 
            </p>
            <div class="status-btn-wrapper">
              <span class="change-status-btn" title="Change Status">⌄</span>
              <div class="task-card-modal-select hidden ">
                <ol>
                  <li data-id=${taskList[i].id} data-value="low">Low</li>
                  <li data-id=${taskList[i].id} data-value="medium">Medium</li>
                  <li data-id=${taskList[i].id} data-value="high">High</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div>
        <button class="${taskList[i].completed ? "active" : "non"}-completed-btn completed-btn" data-id=${taskList[i].id}>${taskList[i].completed ? "Mark as not done" : "Mark as Done"}</button> 
        <button class="delete-btn" data-id=${taskList[i].id}>Delete</button>
        </div>


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
      <p>${countCompletedTasks(taskList, 0)}</p>
    </div>
    <div class="stat-card">
      <p>Total Tasks Remaining :</p>
      <p>${TaskManager.getTotalIncompleteTasks()}</p>
    </div>
    <div class="filter-task-section">
      <fieldset>
      <label>Sort By:</label>
        <select id="sort-by">
          <option default value="order-added">Order Added</option>
          <option value="high-priority">Highest Priority</option>
          <option value="medium-priority">Medium Priority</option>
          <option value="low-priority">Lowest Priority</option>
          <option value="done">Completed Tasks</option>
          <option value="not-done">Uncompleted Tasks</option>
        </select>
      </fieldset>   
      <fieldset>
        <label>Filter By: </label>
        <select id="filter-by">
          <option default value="all">All</option>
          <option value="high-priority">Highest Priority</option>
          <option value="medium-priority">Medium Priority</option>
          <option value="low-priority">Lowest Priority</option>
          <option value="done">Completed Tasks</option>
          <option value="not-done">Uncompleted Tasks</option>
        </select>
      </fieldset>
      </div>
    `,
    );
  }

  // Missing: task ID, completion status, event handlers for delete/complete

  // const completedButtons = document.querySelectorAll(".completed-btn");
  // const deletedButtons = document.querySelectorAll(".deleted-btn");

  // completedButtons.forEach((btn) => {
  //   btn.addEventListener("click", () => {
  //     // First I find where the taskList item matches the current btn's ID then save to a variable
  //     const task = taskList.find(
  //       (task) => task.id === Number(btn.dataset.id), // converting to Number because HTML only saves strings
  //     );
  //     task.setCompleted(); // class handles the logic here of setting the completion status
  //     displayTasks(); // re-render my screen
  //   });
  // });

  // deletedButtons.forEach((btn) => {
  //   btn.addEventListener("click", () => {
  //     TaskManager.removeTask(btn.dataset.id);
  //     displayTasks(); //re-render my screen
  //   });
  // });
}

// Function with event handling issues
function handleTaskClick(event) {
  const taskId = event.target.dataset.id; // Getting the task id per button as set

  // Missing: event.target check
  if (event.target.classList.contains("completed-btn")) {
    // First I find where the taskList item matches the current btn's ID then save to a variable
    const task = TaskManager.tasks.find(
      (task) => task.id === Number(taskId), // converting to Number because HTML only saves strings
    );
    task.setCompleted(); // class handles the logic here of setting the completion status
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

  // Missing: proper event delegation

  // Should toggle task completion
  console.log("Task clicked: " + taskId);
}

// Missing: JSON conversion functions

// Missing: functions to save/load tasks from localStorage

// Initialize (wrong placement - should use DOMContentLoaded)
document.addEventListener("DOMContentLoaded", setupEventListeners);

// this is dom.js
