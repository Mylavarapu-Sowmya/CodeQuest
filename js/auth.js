const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showLogin = document.getElementById("showLogin");
const showSignup = document.getElementById("showSignup");
const loginMessage = document.getElementById("loginMessage");
const signupMessage = document.getElementById("signupMessage");
const signupUsername = document.getElementById("signupUsername");
const signupAvatar = document.getElementById("signupAvatar");
const avatarPreview = document.getElementById("avatarPreview");

showLogin.addEventListener("click", () => {
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
  showLogin.classList.add("active");
  showSignup.classList.remove("active");
  loginMessage.textContent = "";
  signupMessage.textContent = "";
});

showSignup.addEventListener("click", () => {
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
  showSignup.classList.add("active");
  showLogin.classList.remove("active");
  loginMessage.textContent = "";
  signupMessage.textContent = "";
});

signupUsername.addEventListener("input", () => {
  avatarPreview.src = generateAvatar(signupUsername.value.trim() || "CodeQuest");
});

signupAvatar.addEventListener("change", async () => {
  const file = signupAvatar.files[0];
  if (!file) return;
  const base64 = await fileToBase64(file);
  avatarPreview.src = base64;
});

signupForm.addEventListener("submit", async event => {
  event.preventDefault();

  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value.trim();
  const avatarFile = signupAvatar.files[0];
  if (!avatarFile) {
  signupMessage.style.color = "#ef4444";
  signupMessage.textContent = "Please upload a profile image.";
  return;
}

  const users = getUsers();
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    signupMessage.style.color = "#ef4444";
    signupMessage.textContent = "User already exists with this email.";
    return;
  }
const uploadedAvatar = await fileToBase64(avatarFile);

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    avatar: uploadedAvatar,
    score: 0,
    streak: 0,
    badge: "Beginner",
    completedChallenges: [],
    joinedDate: new Date().toISOString(),
    lastLoginAt: null,
    lastLogoutAt: null,
    progress: {
      overall: 0,
      easy: 0,
      medium: 0,
      hard: 0
    }
  };

  users.push(newUser);
  saveUsers(users);

  signupMessage.style.color = "#22c55e";
  signupMessage.textContent = "Signup successful. Please login.";
  signupForm.reset();
  avatarPreview.src = generateAvatar("CodeQuest");
});

loginForm.addEventListener("submit", event => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();

  const users = getUsers();
  const user = users.find(item => item.email === email && item.password === password);

  if (!user) {
    loginMessage.style.color = "#ef4444";
    loginMessage.textContent = "Invalid email or password.";
    return;
  }

  user.lastLoginAt = new Date().toISOString();

  if (!user.progress) {
    user.progress = {
      overall: 0,
      easy: 0,
      medium: 0,
      hard: 0
    };
  }

  if (!user.avatar) {
    user.avatar = generateAvatar(user.username);
  }

  updateCurrentUser(user);
  setCurrentUserId(user.id);

  window.location.href = "dashboard.html";
});
