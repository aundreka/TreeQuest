document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded.");
    loadTheme();
    addEventListeners();
});

function loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "classic-light";
    document.body.className = savedTheme;
}

function addEventListeners() {
    const observer = new MutationObserver((mutations, obs) => {
        const startButton = document.getElementById("start-game");
        if (startButton) {
            console.log("Found #start-game! Adding event listener...");
            startButton.addEventListener("click", () => {
                window.location.href = "levels.html";
            });
            obs.disconnect(); 
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function setTheme(theme) {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
}
