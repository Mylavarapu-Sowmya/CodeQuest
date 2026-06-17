redirectIfNotLoggedIn();
setupTheme();
setupLogout();
setupNavbarAvatar();
setupMobileMenu();

function renderLeaderboard() {
  const users = getUsers().sort((a, b) => b.score - a.score);
  const leaderboardBody = document.getElementById("leaderboardBody");

  leaderboardBody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img class="table-avatar" src="${user.avatar || generateAvatar(user.username)}" alt="${user.username}"></td>
      <td>${user.username}</td>
      <td>${user.score}</td>
      <td>${user.badge}</td>
      <td>${user.streak}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}

renderLeaderboard();
