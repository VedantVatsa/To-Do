//firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"; // Import the 'getDatabase' function

const firebaseConfig = {
  apiKey: "AIzaSyDLFv2hRlQeBBc9UsSJrtQiL4hrLyCU2fQ",
  authDomain: "tasks-5925d.firebaseapp.com",
  databaseURL: "https://tasks-5925d-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "tasks-5925d",
  storageBucket: "tasks-5925d.appspot.com",
  messagingSenderId: "85200890286",
  appId: "1:85200890286:web:1d2633afb820219211003f"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, firebaseConfig };