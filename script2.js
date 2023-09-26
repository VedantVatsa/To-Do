// Import necessary Firebase modules and configuration
import { app } from './Firebase/firebase.js';
import { getDatabase, ref, push, onValue, set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

// Initialize Firebase using the provided configuration
const database = getDatabase(app);
let tasks = [];

document.addEventListener('DOMContentLoaded', function () {
  // Get references to DOM elements
  const taskInput = document.getElementById('task');
  const addTaskButton = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');

  // Reference to the logout button
  const logoutButton = document.getElementById('logout-button');

  // Event listener for the logout button
  logoutButton.addEventListener('click', () => {
    // Remove the user from the session storage.
    sessionStorage.removeItem("user");

    // Redirect the user to the login page.
    window.location.href = "index.html";
  });

  // Function to fetch tasks from Realtime Database
  function fetchTasks(userUid) {
    const userTasksRef = ref(database, `${userUid}/tasks`);
    onValue(userTasksRef, (snapshot) => {
      const tasksData = snapshot.val() || {};
      tasks = Object.keys(tasksData).map((taskId) => ({
        id: taskId,
        ...tasksData[taskId],
      }));
      renderTasks(tasks);
    });
  }

  // Function to save tasks to Realtime Database
  function saveTasksToDatabase(userUid, tasks) {
    const userTasksRef = ref(database, `${userUid}/tasks`);
    const tasksData = tasks.reduce((data, task) => {
      data[task.id] = { text: task.text, completed: task.completed };
      return data;
    }, {});
    set(userTasksRef, tasksData);
  }

  // Get the user's UID from session storage
  const userUid = sessionStorage.getItem("user");

  if (userUid) {
    // If the user is authenticated, initialize their tasks
    fetchTasks(userUid);
  } else {
    // If the user is not authenticated, redirect them to the login page
    window.location.href = "index.html";
  }

  function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <input type="checkbox" name="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
        <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
        <button class="delete" data-id="${task.id}">Delete</button>
      `;
      taskList.appendChild(li);
    });
  }

  addTaskButton.addEventListener('click', function () {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
      const newTaskRef = push(ref(database, `${userUid}/tasks`)); // Create a new child node
      const newTaskId = newTaskRef.key;
      const newTask = { id: newTaskId, text: taskText, completed: false };
      tasks.push(newTask);
      renderTasks(tasks);
      saveTaskToDatabase(userUid, newTask); // Save the new task
      taskInput.value = '';
    }
  });

  // Function to save a task to Realtime Database
  function saveTaskToDatabase(userUid, task) {
    const userTaskRef = ref(database, `${userUid}/tasks/${task.id}`);
    set(userTaskRef, { text: task.text, completed: task.completed });
  }

  function registerEventListeners() {
    // Event listener for the checkbox
    taskList.addEventListener('change', function (event) {
      if (event.target.classList.contains('task-checkbox')) {
        const taskId = event.target.getAttribute('data-id');
        if (taskId) {
          const task = tasks.find((t) => t.id === taskId);
          if (task) {
            task.completed = event.target.checked;
            renderTasks(tasks);

            // Update the task in the database
            saveTaskToDatabase(userUid, task);
          }
        }
      }
    });

    // Event listener for the delete button
    taskList.addEventListener('click', function (event) {
      if (event.target.classList.contains('delete')) {
        const taskId = event.target.getAttribute('data-id');
        if (taskId) {
          // Filter out the deleted task
          tasks = tasks.filter((task) => task.id !== taskId);
          renderTasks(tasks);

          // Delete the task from the database
          deleteTaskFromDatabase(userUid, taskId);
        }
      }
    });
  }

  registerEventListeners();

  // Function to delete a task from Realtime Database
  function deleteTaskFromDatabase(userUid, taskId) {
    const userTaskRef = ref(database, `${userUid}/tasks/${taskId}`);
    set(userTaskRef, null); // Setting the task to null deletes it from the database
  }
});
