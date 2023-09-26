import { getDatabase, ref, push, onValue, set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { firebaseConfig, app } from './Firebase/firebase';
// Initialize Firebase using the provided configuration
firebase.initializeApp(firebaseConfig);
const database = getDatabase(app);

const loginForm = document.querySelector(".form.login");
const signupForm = document.querySelector(".form.signup");
const userUid = sessionStorage.getItem("user");
const userTasksRef = ref(database, `${userUid}/tasks`);

// Login form submission
// Login form submission
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  let email = loginForm.querySelector(".email").value;
  let password = loginForm.querySelector(".password").value;

  // Authenticate the user with Firebase Auth
  // Inside script.js (for email/password sign-in)

// After successful login
// ...

  // After successful login
firebase.auth().signInWithEmailAndPassword(email, password)
.then(function(userCredential) {
    // Get the user's UID
    const userUid = userCredential.user.uid;
    // Get the user's email
    const userEmail = userCredential.user.email;

    // Determine the reference based on authentication method
    const userTasksRef = userEmail.includes('@gmail.com')
        ? ref(database, `googleUsers/${userUid}/tasks`)
        : ref(database, `emailUsers/${userUid}/tasks`);

    // Fetch the existing tasks from the database
    fetchTasks(userUid);

    // Store the user's UID in session storage
    sessionStorage.setItem("user", userUid); // Set the same key "user" for both login methods
    sessionStorage.setItem("userEmail", userEmail);

    // Redirect to the desired page
    window.location.href = "to-do.html";
})
.catch(function(error) {
    // Handle login errors
    alert(error.message);
});



});


// Signup form submission
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
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    // The user has been created successfully
    window.location.href = "/";
  }).catch(function(error) {
    // The signup failed
    alert(error.message);
  });
});


const provider = new firebase.auth.GoogleAuthProvider();

// Assuming you have a Google Login button with the ID "google-login"
// Assuming you have a Google Login button with the ID "google-login"
// Assuming you have a Google Login button with the ID "google-login"
const googleLoginButton = document.getElementById("google-login");

// Attach a click event listener to the Google Login button

// ...
// Function to fetch tasks from Realtime Database
function fetchTasks(userUid) {
  const userTasksRef = ref(database, `googleUsers/${userUid}/tasks`); // Adjust the reference path as needed
  onValue(userTasksRef, (snapshot) => {
      const tasksData = snapshot.val() || {};
      const tasks = Object.keys(tasksData).map((taskId) => ({
          id: taskId,
          ...tasksData[taskId],
      }));
      renderTasks(tasks);
  });
}


  googleLoginButton.addEventListener("click", () => {
    // Authenticate with Firebase using the Google provider object
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // The user has successfully signed in with Google
            // You can access user data from the "result" object
            const user = result.user;
            console.log("Google Sign-In successful:", user);

            // Determine the reference based on authentication method
            const userUid = user.uid;
            const userTasksRef = ref(database, `googleUsers/${userUid}/tasks`);

            // Fetch the existing tasks from the database
            fetchTasks(userUid);

            // Store the user's UID in session storage
            sessionStorage.setItem("user", userUid);

            // Now you can customize the behavior after signing in with Google
            // For example, you can check if the user's email is verified:
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

  // ...




const forms = document.querySelector(".forms"),
      pwShowHide = document.querySelectorAll(".eye-icon"),
      links = document.querySelectorAll(".form-link a");

pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click",() => {
    let pwfields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwfields.forEach(password =>{
      if (password.type === "password"){
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bx-show", "bx-hide");
    });
  });  
});

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    forms.classList.toggle("show-signup");
  });
});