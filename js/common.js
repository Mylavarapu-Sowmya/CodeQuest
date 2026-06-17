const defaultChallenges = [
  { id: 1, title: "Reverse a String", difficulty: "Easy", points: 10, description: "Write a function to reverse a string." },
  { id: 2, title: "Palindrome Checker", difficulty: "Easy", points: 10, description: "Check whether a string is a palindrome." },
  { id: 3, title: "Find Maximum Number", difficulty: "Easy", points: 10, description: "Find the largest number in an array." },
  { id: 4, title: "FizzBuzz", difficulty: "Easy", points: 10, description: "Print numbers with Fizz/Buzz rules." },
  { id: 5, title: "Count Vowels", difficulty: "Easy", points: 10, description: "Count vowels in a given string." },
  { id: 6, title: "Two Sum Problem", difficulty: "Medium", points: 20, description: "Find two indices whose values add up to target." },
  { id: 7, title: "Anagram Checker", difficulty: "Medium", points: 20, description: "Check if two strings are anagrams." },
  { id: 8, title: "Remove Duplicates", difficulty: "Medium", points: 20, description: "Remove duplicate values from an array." },
  { id: 9, title: "Character Frequency", difficulty: "Medium", points: 20, description: "Count frequency of each character." },
  { id: 10, title: "Array Rotation", difficulty: "Medium", points: 20, description: "Rotate array by k positions." },
  { id: 11, title: "Merge Sorted Arrays", difficulty: "Hard", points: 30, description: "Merge two sorted arrays efficiently." },
  { id: 12, title: "Longest Substring", difficulty: "Hard", points: 30, description: "Find longest substring without repeating characters." },
  { id: 13, title: "Binary Search", difficulty: "Hard", points: 30, description: "Implement binary search algorithm." },
  { id: 14, title: "Valid Parentheses", difficulty: "Hard", points: 30, description: "Check if parentheses are valid." },
  { id: 15, title: "Flatten Nested Array", difficulty: "Hard", points: 30, description: "Flatten a deeply nested array." }
];

function initAppData() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
  }

  if (!localStorage.getItem("challenges")) {
    localStorage.setItem("challenges", JSON.stringify(defaultChallenges));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getChallenges() {
  return JSON.parse(localStorage.getItem("challenges")) || [];
}

function getCurrentUserId() {
  return localStorage.getItem("currentUserId");
}

function setCurrentUserId(userId) {
  localStorage.setItem("currentUserId", String(userId));
}

function clearCurrentUserId() {
  localStorage.removeItem("currentUserId");
}

function getCurrentUser() {
  const currentUserId = Number(getCurrentUserId());
  if (!currentUserId) return null;
  return getUsers().find(user => user.id === currentUserId) || null;
}

function updateCurrentUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
}

function redirectIfNotLoggedIn() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
  }
}

function updateBadge(score) {
  if (score >= 200) return "Gold Coder";
  if (score >= 100) return "Silver Coder";
  if (score >= 50) return "Bronze Coder";
  return "Beginner";
}

function formatDateTime(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString();
}

function calculateProgress(user, challenges) {
  const total = challenges.length;
  const completed = user.completedChallenges.length;

  const easyTotal = challenges.filter(ch => ch.difficulty === "Easy").length;
  const mediumTotal = challenges.filter(ch => ch.difficulty === "Medium").length;
  const hardTotal = challenges.filter(ch => ch.difficulty === "Hard").length;

  const easyCompleted = challenges.filter(ch => ch.difficulty === "Easy" && user.completedChallenges.includes(ch.id)).length;
  const mediumCompleted = challenges.filter(ch => ch.difficulty === "Medium" && user.completedChallenges.includes(ch.id)).length;
  const hardCompleted = challenges.filter(ch => ch.difficulty === "Hard" && user.completedChallenges.includes(ch.id)).length;

  return {
    overall: total ? Math.round((completed / total) * 100) : 0,
    easy: easyTotal ? Math.round((easyCompleted / easyTotal) * 100) : 0,
    medium: mediumTotal ? Math.round((mediumCompleted / mediumTotal) * 100) : 0,
    hard: hardTotal ? Math.round((hardCompleted / hardTotal) * 100) : 0
  };
}

function saveProgressToUser(user) {
  user.progress = calculateProgress(user, getChallenges());
  updateCurrentUser(user);
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

function setupTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  applySavedTheme();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    const user = getCurrentUser();
    if (user) {
      user.lastLogoutAt = new Date().toISOString();
      updateCurrentUser(user);
    }
    clearCurrentUserId();
    window.location.href = "index.html";
  });
}

function setupNavbarAvatar() {
  const user = getCurrentUser();
  const navAvatar = document.getElementById("navUserAvatar");
  if (user && navAvatar) {
    navAvatar.src = user.avatar;
  }
}

function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (!mobileMenuBtn || !navLinks) return;

  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function generateAvatar(username) {
  const seed = encodeURIComponent(username || "CodeQuest");
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
}

initAppData();
applySavedTheme();
