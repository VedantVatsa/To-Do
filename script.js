// Import necessary Firebase modules and configuration
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { firebaseConfig, app } from './Firebase/firebase.js';

// Initialize Firebase using the provided configuration
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
const database = getDatabase(app);

// Get references to DOM elements
const loginForm = document.querySelector(".form.login");
const signupForm = document.querySelector(".form.signup");
const googleLoginButton = document.getElementById("google-login");

// Event listener for login form submission
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  let email = loginForm.querySelector(".email").value;
  let password = loginForm.querySelector(".password").value;

  // Authenticate the user with Firebase Auth
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // Handle successful login

      // Get user data
      const user = userCredential.user;
      const userUid = user.uid;
      const userEmail = user.email;

      // Determine the reference based on authentication method
      const userTasksRef = userEmail.includes('@gmail.com')
        ? ref(database, `googleUsers/${userUid}/tasks`)
        : ref(database, `emailUsers/${userUid}/tasks`);

      // Fetch the user's tasks from the database
      fetchTasks(userUid);

      // Store user information in session storage
      sessionStorage.setItem("user", userUid);
      sessionStorage.setItem("userEmail", userEmail);

      // Redirect to the desired page
      window.location.href = "to-do.html";
    })
    .catch(function(error) {
      // Handle login errors
      alert(error.message);
    });
});

// Event listener for signup form submission
signupForm.addEventListener("submit", e => {
  e.preventDefault();

  let email = signupForm.querySelector(".email").value;
  let password = signupForm.querySelector(".password").value;
  let confirmPassword = signupForm.querySelector(".password").value;

  // Check if the passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Create a new user with Firebase Auth
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user) {
      // Handle successful signup

      // Redirect to the desired page
      window.location.href = "/";
    })
    .catch(function(error) {
      // Handle signup errors
      alert(error.message);
    });
});

// Google Login using Firebase Auth
const provider = new firebase.auth.GoogleAuthProvider();

// Event listener for Google Login button
googleLoginButton.addEventListener("click", () => {
  // Authenticate with Firebase using the Google provider object
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // Handle successful Google Sign-In

      // Get user data
      const user = result.user;
      const userUid = user.uid;

      // Determine the reference based on authentication method
      const userTasksRef = ref(database, `googleUsers/${userUid}/tasks`);

      // Fetch the user's tasks from the database
      fetchTasks(userUid);

      // Store user information in session storage
      sessionStorage.setItem("user", userUid);

      // Check if the user's email is verified
      if (user.emailVerified) {
        // User's email is verified, redirect to the desired page
        window.location.href = "to-do.html";
      } else {
        // User's email is not verified, display a message or take appropriate action
        alert("Please verify your email before continuing.");
      }
    })
    .catch((error) => {
      // Handle errors if the Google Sign-In fails
      console.error("Google Sign-In error:", error);
    });
});

// Function to fetch tasks from Realtime Database
function fetchTasks(userUid) {
  const userTasksRef = ref(database, `googleUsers/${userUid}/tasks`);
  onValue(userTasksRef, (snapshot) => {
    const tasksData = snapshot.val() || {};
    const tasks = Object.keys(tasksData).map((taskId) => ({
      id: taskId,
      ...tasksData[taskId],
    }));
    renderTasks(tasks);
  });
}

// Function to toggle password visibility and switch between login and signup forms
const pwShowHide = document.querySelectorAll(".eye-icon");
const forms = document.querySelector(".forms");
const links = document.querySelectorAll(".form-link a");

pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwfields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwfields.forEach(password => {
      password.type = password.type === "password" ? "text" : "password";
    });

    eyeIcon.classList.toggle("bx-show");
    eyeIcon.classList.toggle("bx-hide");
  });
});

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    forms.classList.toggle("show-signup");
  });
});
