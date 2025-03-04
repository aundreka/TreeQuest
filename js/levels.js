document.addEventListener("DOMContentLoaded", () => {
    const levelsContainer = document.getElementById("levels-container");
    const achievementsList = document.getElementById("achievements-list");

    const totalLevels = 30; 
    let progress = JSON.parse(localStorage.getItem("treequest_progress")) || { 1: { score: 0, stars: 0 } };
    localStorage.setItem("treequest_progress", JSON.stringify(progress));

    const traversalTypes = ["Preorder", "Inorder", "Postorder"];

    function getTraversalForLevel(level) {
        let levelTraversal = JSON.parse(localStorage.getItem("treequest_traversals")) || {};
    
        if (!levelTraversal[level]) {
            levelTraversal[level] = traversalTypes[Math.floor(Math.random() * traversalTypes.length)];
            localStorage.setItem("treequest_traversals", JSON.stringify(levelTraversal));
        }
    
        return levelTraversal[level] || "Unknown";
    }
    

    function loadProgress() {
        console.log("Loading levels...");
        levelsContainer.innerHTML = ""; 
    
        for (let level = 1; level <= totalLevels; level++) {
            if (!progress[level]) {
                progress[level] = { score: 0, stars: 0 };
            }
    
            const isUnlocked = level === 1 || progress[level - 1]; 
            console.log(`Checking level ${level}:`, isUnlocked ? "Unlocked" : "Locked");
    
            const levelData = progress[level] || { score: 0, stars: 0 };
            addLevelButton(level, levelData.score, levelData.stars, isUnlocked);
        }
        localStorage.setItem("treequest_progress", JSON.stringify(progress));
    }
    

    function addLevelButton(level, score, stars, isUnlocked) {
        const levelButton = document.createElement("button");
        levelButton.classList.add("level-btn");
    
        levelButton.innerHTML = isUnlocked
            ? `Level ${level} - ⭐ ${stars} | Score: ${score}`
            : `Level ${level} <span class="lock-icon">🔒</span>`; 
    
        if (isUnlocked) {
            levelButton.classList.add("unlocked");
            levelButton.addEventListener("click", () => {
                window.location.href = `game.html?level=${level}`;
            });
        } else {
            levelButton.disabled = true;
            levelButton.classList.add("locked"); 
        }
    
        levelsContainer.appendChild(levelButton);
    }

    function checkAndUnlockNextLevels() {
    for (let completedLevel = 1; completedLevel <= totalLevels; completedLevel++) {
        if (progress[completedLevel]) {
            const nextLevel = completedLevel + 1;
            if (nextLevel <= totalLevels && !progress[nextLevel]) {
                progress[nextLevel] = { score: 0, stars: 0 };
                localStorage.setItem("treequest_progress", JSON.stringify(progress));
                showUnlockNotification(nextLevel);

                setTimeout(() => {
                    const nextLevelButton = document.querySelector(`button:nth-child(${nextLevel})`);
                    if (nextLevelButton) {
                        nextLevelButton.classList.add("unlocked");
                        nextLevelButton.disabled = false;
                        nextLevelButton.innerHTML = `Level ${nextLevel} (${getTraversalForLevel(nextLevel)}) - ⭐ 0 | Score: 0`;
                    }
                }, 500);
            }
        }
    }
}

    function showUnlockNotification(level) {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.textContent = `🎉 You unlocked Level ${level}!`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function addLevelCard(level, score, stars, isUnlocked) {
        const levelCard = document.createElement("div");
        levelCard.classList.add("level-card");
        levelCard.style.backgroundColor = getRandomPastelColor(); 
    
        const levelButton = document.createElement("button");
        levelButton.classList.add("level-btn");
    
        levelButton.innerHTML = isUnlocked
            ? `Level ${level} - ${getTraversalForLevel(level)}`
            : `Level ${level} <span class="lock-icon">🔒</span>`; 
    
        if (isUnlocked) {
            levelButton.classList.add("unlocked");
            levelButton.addEventListener("click", () => {
                window.location.href = `game.html?level=${level}`;
            });
        } else {
            levelButton.disabled = true;
            levelButton.classList.add("locked");
        }

        const starContainer = document.createElement("div");
        starContainer.classList.add("star-container");
        starContainer.innerHTML = `⭐ ${stars} | Score: ${score}`;

        levelCard.appendChild(levelButton);
        levelCard.appendChild(starContainer);
        levelsContainer.appendChild(levelCard);
    }

    function getRandomPastelColor() {
        const pastelColors = [
            "#FFDDC1", "#FFABAB", "#FFC3A0", "#D4A5A5", "#E4C1F9",
            "#C1E1C1", "#A0C4FF", "#BFD7EA", "#FFD6A5", "#FF9AA2"
        ];
        return pastelColors[Math.floor(Math.random() * pastelColors.length)];
    }

    function loadAchievements() {
        const achievements = JSON.parse(localStorage.getItem("treequest_achievements")) || [];
        achievementsList.innerHTML = "";
        if (achievements.length === 0) {
            achievementsList.innerHTML = "<li>No achievements unlocked yet.</li>";
        } else {
            achievements.forEach(ach => {
                let li = document.createElement("li");
                li.textContent = `🏆 ${ach}`;
                achievementsList.appendChild(li);
            });
        }
    }

    loadProgress();
    loadAchievements();

    const lastCompletedLevel = parseInt(localStorage.getItem("lastCompletedLevel")) || 0;
    checkAndUnlockNextLevel(lastCompletedLevel);
});
