document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const taskList = document.getElementById("task-list");
  const addTaskForm = document.getElementById("add-task-form");
  const taskInput = document.getElementById("task-input");
  const selectedDateEl = document.getElementById("selected-date");
  const statsTotalTasks = document.getElementById("total-tasks");
  const statsCompletedTasks = document.getElementById("completed-tasks");

  let selectedDate = new Date().toISOString().split("T")[0]; // Default to today

  // Initialize FullCalendar
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: true,
    dateClick: function (info) {
      selectedDate = info.dateStr;
      loadTasksForDate(selectedDate);
    },
  });

  calendar.render();

  // Load tasks for a specific date
  function loadTasksForDate(date) {
    selectedDateEl.textContent = `Tasks for: ${date}`;

    // Get tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem(date)) || [];

    // Clear the current task list
    taskList.innerHTML = "";

    // Render tasks with checkboxes and delete buttons
    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = "task-item";
      if (task.completed) {
        taskItem.classList.add("completed");
      }

      // Checkbox for marking as completed
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => toggleTaskCompletion(date, index));

      // Task text
      const taskText = document.createElement("span");
      taskText.textContent = task.text;
      taskText.className = "task-text";

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete";
      deleteButton.addEventListener("click", () => deleteTask(date, index));

      taskItem.appendChild(checkbox);
      taskItem.appendChild(taskText);
      taskItem.appendChild(deleteButton);

      taskList.appendChild(taskItem);
    });

    // Update stats
    updateStats(tasks);
  }

  // Add a new task
  addTaskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newTask = taskInput.value.trim();
    if (!newTask) return;

    // Get tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem(selectedDate)) || [];
    tasks.push({ text: newTask, completed: false });

    // Save updated tasks back to localStorage
    localStorage.setItem(selectedDate, JSON.stringify(tasks));

    // Reload the task list
    loadTasksForDate(selectedDate);

    // Clear the input field
    taskInput.value = "";
  });

  // Toggle task completion
  function toggleTaskCompletion(date, taskIndex) {
    const tasks = JSON.parse(localStorage.getItem(date)) || [];
    tasks[taskIndex].completed = !tasks[taskIndex].completed; // Toggle the completed status

    // Save updated tasks back to localStorage
    localStorage.setItem(date, JSON.stringify(tasks));

    // Reload the task list
    loadTasksForDate(date);
  }

  // Delete a task
  function deleteTask(date, taskIndex) {
    const tasks = JSON.parse(localStorage.getItem(date)) || [];
    tasks.splice(taskIndex, 1); // Remove the task at the given index

    // Save updated tasks back to localStorage
    localStorage.setItem(date, JSON.stringify(tasks));

    // Reload the task list
    loadTasksForDate(date);
  }

  // Update stats (total tasks and completed tasks)
  function updateStats(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    statsTotalTasks.textContent = totalTasks;
    statsCompletedTasks.textContent = completedTasks;
  }

  // Load tasks for today by default
  loadTasksForDate(selectedDate);
});
