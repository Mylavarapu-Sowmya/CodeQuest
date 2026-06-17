redirectIfNotLoggedIn();
setupTheme();
setupLogout();
setupNavbarAvatar();
setupMobileMenu();

function renderUserStats() {
  const user = getCurrentUser();
  const challenges = getChallenges();
  if (!user) return;
  
  saveProgressToUser(user);
  const freshUser = getCurrentUser();
  const navAvatar = document.getElementById("navUserAvatar");

if (freshUser.avatar) {
    navAvatar.src = freshUser.avatar;
} else {
    navAvatar.src =
      "https://api.dicebear.com/7.x/adventurer/svg?seed=" +
      freshUser.username;
}
  
  document.getElementById("welcomeUser").textContent = `Welcome, ${freshUser.username}`;
  document.getElementById("scoreValue").textContent = freshUser.score;
  document.getElementById("completedValue").textContent = freshUser.completedChallenges.length;
  document.getElementById("streakValue").textContent = freshUser.streak;
  document.getElementById("badgeValue").textContent = freshUser.badge;
  document.getElementById("lastLoginText").textContent = formatDateTime(freshUser.lastLoginAt);
  document.getElementById("lastLogoutText").textContent = formatDateTime(freshUser.lastLogoutAt);
  
  const progress = freshUser.progress || calculateProgress(freshUser, challenges);
  document.getElementById("overallProgressBar").style.width = `${progress.overall}%`;
  document.getElementById("overallProgressText").textContent = `${progress.overall}%`;
  document.getElementById("easyProgressBar").style.width = `${progress.easy}%`;
  document.getElementById("easyProgressText").textContent = `${progress.easy}%`;
  document.getElementById("mediumProgressBar").style.width = `${progress.medium}%`;
  document.getElementById("mediumProgressText").textContent = `${progress.medium}%`;
  document.getElementById("hardProgressBar").style.width = `${progress.hard}%`;
  document.getElementById("hardProgressText").textContent = `${progress.hard}%`;
}

function renderChallenges(filteredChallenges = null) {
  const challengeList = document.getElementById("challengeList");
  const user = getCurrentUser();
  const challenges = filteredChallenges || getChallenges();
  if (!user) return;
  
  challengeList.innerHTML = "";
  
  challenges.forEach(challenge => {
    const isCompleted = user.completedChallenges.includes(challenge.id);
    const card = document.createElement("div");
    card.className = "challenge-card";
    
    // Fallback quiz database arrays if specific keys don't exist in your storage layer
    const finalQuestion = challenge.question || `What is the primary technical focus area for the "${challenge.title}" assignment?`;
    
    // Notice how we remove object keys (A, B, C, D) and convert them directly into plain strings
    const finalOptions = challenge.options ? Object.values(challenge.options) : [
      "Logic Optimization",
      "String Manipulation and Formatting",
      "Data Architecture and Variables",
      "Control Flow Analysis"
    ];
    
    // Fallback answer string matching an exact entry from above
    const finalCorrectAnswer = challenge.correctAnswerText || challenge.correctAnswer || "String Manipulation and Formatting";

    let optionsHTML = `<div class="quiz-options" style="margin: 15px 0; display: flex; flex-direction: column; gap: 8px;">`;
    finalOptions.forEach((optionValue) => {
      const cleanOption = String(optionValue).trim();
      const cleanCorrect = String(finalCorrectAnswer).trim();
      
      if (isCompleted) {
        const isCorrect = cleanOption.toLowerCase() === cleanCorrect.toLowerCase();
        optionsHTML += `
          <div class="quiz-option-item static-view" style="color: ${isCorrect ? 'var(--success)' : 'var(--subtext)'}; font-weight: ${isCorrect ? '700' : '500'}; border-color: ${isCorrect ? 'var(--success)' : 'var(--border)'};">
            ${cleanOption} ${isCorrect ? '✓ (Correct)' : ''}
          </div>`;
      } else {
        optionsHTML += `
          <label class="quiz-option-item">
            <input type="radio" name="challenge-${challenge.id}" value="${cleanOption}">
            <span>${cleanOption}</span>
          </label>`;
      }
    });
    optionsHTML += `</div>`;
    
    card.innerHTML = `
      <span class="badge ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span>
      <h3>${challenge.title}</h3>
      <p>${challenge.description}</p>
      <p><strong>Points:</strong> ${challenge.points}</p>
      
      <div id="quiz-area-${challenge.id}" style="display: ${isCompleted ? 'block' : 'none'}; border-top: 1px dashed var(--border); margin-top: 15px; padding-top: 15px;">
        <p style="color: var(--text); font-weight: 600;"><strong>Question:</strong> ${finalQuestion}</p>
        ${optionsHTML}
        ${
          !isCompleted 
            ? `<button class="submit-answer-btn" data-id="${challenge.id}" data-correct="${finalCorrectAnswer}">Submit Answer</button>` 
            : ""
        }
      </div>

      <div class="action-zone-${challenge.id}" style="margin-top: 15px;">
        ${
          isCompleted
            ? `<p class="completed-text">✓ Challenge Completed</p>`
            : `<button class="solve-btn" id="solve-btn-${challenge.id}" data-id="${challenge.id}">Solve Challenge</button>`
        }
      </div>
    `;
    challengeList.appendChild(card);
  });
  
  const solveButtons = document.querySelectorAll(".solve-btn");
  solveButtons.forEach(button => {
    button.addEventListener("click", () => {
      const challengeId = button.getAttribute("data-id");
      document.getElementById(`quiz-area-${challengeId}`).style.display = "block";
      button.style.display = "none"; 
    });
  });

  const submitButtons = document.querySelectorAll(".submit-answer-btn");
  submitButtons.forEach(button => {
    button.addEventListener("click", () => {
      const challengeId = Number(button.getAttribute("data-id"));
      const fallbackAns = button.getAttribute("data-correct");
      verifySelection(challengeId, fallbackAns);
    });
  });
}

function verifySelection(challengeId, fallbackAns) {
  const user = getCurrentUser();
  const challenges = getChallenges();
  if (!user) return;
  
  if (user.completedChallenges.includes(challengeId)) return;
  
  const challenge = challenges.find(item => item.id === challengeId);
  if (!challenge) return;

  const selectedOption = document.querySelector(`input[name="challenge-${challengeId}"]:checked`);
  
  if (!selectedOption) {
    alert("Please select an answer before submitting!");
    return;
  }

  const userAnswer = selectedOption.value.trim().toLowerCase();
  
  // Find correct answer target string directly
  let targetAnswer = challenge.correctAnswerText || challenge.correctAnswer || fallbackAns;
  // If your challenge database passes down an option identifier key like "B", we map to it gracefully
  if (challenge.options && challenge.options[targetAnswer]) {
    targetAnswer = challenge.options[targetAnswer];
  }
  targetAnswer = String(targetAnswer).trim().toLowerCase();

  if (userAnswer === targetAnswer) {
    user.completedChallenges.push(challengeId);
    user.score += challenge.points;
    user.streak += 1;
    user.badge = updateBadge(user.score);
    
    saveProgressToUser(user);
    renderUserStats();
    renderChallenges(getFilteredChallenges());
    
    alert("Correct answer! Progress bar saved.");
  } else {
    alert("Incorrect answer. Please review and try again!");
  }
}

function getFilteredChallenges() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const difficultyValue = document.getElementById("difficultyFilter").value;
  const challenges = getChallenges();
  
  return challenges.filter(challenge => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchValue) ||
      challenge.description.toLowerCase().includes(searchValue);
    const matchesDifficulty =
      difficultyValue === "All" || challenge.difficulty === difficultyValue;
    return matchesSearch && matchesDifficulty;
  });
}

function setupFilters() {
  const searchInput = document.getElementById("searchInput");
  const difficultyFilter = document.getElementById("difficultyFilter");
  
  function applyFilters() {
    renderChallenges(getFilteredChallenges());
  }
  
  searchInput.addEventListener("input", applyFilters);
  difficultyFilter.addEventListener("change", applyFilters);
}

renderUserStats();
renderChallenges();
setupFilters();