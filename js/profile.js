redirectIfNotLoggedIn();
setupTheme();
setupLogout();
setupNavbarAvatar();
setupMobileMenu();

function renderProfile() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById("profileAvatar").src = user.avatar || generateAvatar(user.username);
  document.getElementById("profileUsername").textContent = user.username;
  document.getElementById("profileEmail").textContent = user.email;
  document.getElementById("profileScore").textContent = user.score;
  document.getElementById("profileStreak").textContent = user.streak;
  document.getElementById("profileBadge").textContent = user.badge;
  document.getElementById("profileCompleted").textContent = user.completedChallenges.length;
  document.getElementById("profileJoined").textContent = formatDateTime(user.joinedDate);
  document.getElementById("profileLastLogin").textContent = formatDateTime(user.lastLoginAt);
  document.getElementById("profileLastLogout").textContent = formatDateTime(user.lastLogoutAt);

  const achievements = [];

  if (user.score >= 50) achievements.push("Bronze Coder");
  if (user.score >= 100) achievements.push("Silver Coder");
  if (user.score >= 200) achievements.push("Gold Coder");
  if (user.completedChallenges.length >= 5) achievements.push("5 Challenges Completed");
  if (user.completedChallenges.length >= 10) achievements.push("10 Challenges Completed");
  if (user.streak >= 3) achievements.push("3 Day Streak");
  if (user.streak >= 7) achievements.push("7 Day Streak");

  const achievementList = document.getElementById("achievementList");
  achievementList.innerHTML = "";

  if (achievements.length === 0) {
    achievementList.innerHTML = `<p>No achievements yet. Start solving challenges.</p>`;
    return;
  }

  achievements.forEach(item => {
    const div = document.createElement("div");
    div.className = "achievement-item";
    div.textContent = item;
    achievementList.appendChild(div);
  });
}

renderProfile();
