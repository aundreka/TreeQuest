document.addEventListener("DOMContentLoaded", () => {
    const tutorialOverlay = document.createElement("div");
    tutorialOverlay.id = "tutorial-overlay";
    tutorialOverlay.innerHTML = `
        <div id="tutorial-content">
            <h2 id="tutorial-title"></h2>
            <p id="tutorial-text"></p>
            <button id="start-level-btn">Got it! Start Tutorial</button>
        </div>
    `;
    document.body.appendChild(tutorialOverlay);

    const tutorialTitle = document.getElementById("tutorial-title");
    const tutorialText = document.getElementById("tutorial-text");
    const startLevelBtn = document.getElementById("start-level-btn");

    let tutorialSteps = [];
    let currentStep = 0;

    function displayTutorial(level) {
        tutorialOverlay.style.display = "flex";

        if (level === 1) {
            tutorialTitle.textContent = "Preorder Traversal Tutorial 🌱";
            tutorialText.innerHTML = `
                Preorder traversal follows the sequence: <strong>Root → Left → Right</strong>.<br>
                Click the nodes in this order to complete the level.
            `;
        } else if (level === 2) {
            tutorialTitle.textContent = "Inorder Traversal Tutorial 🌿";
            tutorialText.innerHTML = `
                Inorder traversal follows the sequence: <strong>Left → Root → Right</strong>.<br>
                Click the nodes in this order to complete the level.
            `;
        } else if (level === 3) {
            tutorialTitle.textContent = "Postorder Traversal Tutorial 🌳";
            tutorialText.innerHTML = `
                Postorder traversal follows the sequence: <strong>Left → Right → Root</strong>.<br>
                Click the nodes in this order to complete the level.
            `;
        }
    }

    function highlightTraversal() {
        if (!correctSequence.length) {
            console.error("No traversal sequence available!");
            return;
        }

        tutorialSteps = correctSequence;
        currentStep = 0;
        highlightNextStep();
    }

    function highlightNextStep() {
        if (currentStep >= tutorialSteps.length) {
            setTimeout(() => {
                document.dispatchEvent(new Event("tutorialComplete"));
            }, 500);
            return;
        }

        let nodeValue = tutorialSteps[currentStep];
        let nodeElement = document.querySelector(`.tree-node[data-value="${nodeValue}"]`);

        if (nodeElement) {
            nodeElement.classList.add("highlight");
            setTimeout(() => {
                nodeElement.classList.remove("highlight");
                currentStep++;
                highlightNextStep();
            }, 1000);
        } else {
            console.error("Node not found for tutorial step:", nodeValue);
        }
    }

    document.addEventListener("startTutorial", () => {
        displayTutorial(levelId);
    });

    startLevelBtn.addEventListener("click", () => {
        tutorialOverlay.style.display = "none";
        highlightTraversal();
    });
});

document.addEventListener("startTutorial", (event) => {
    levelId = event.detail.level; // Ensure levelId is retrieved correctly
    displayTutorial(levelId);
});

function highlightTraversal() {
    if (typeof correctSequence === "undefined" || !correctSequence.length) {
        console.error("Error: correctSequence is not defined!");
        return;
    }

    tutorialSteps = [...correctSequence]; // Copy correct sequence
    currentStep = 0;
    highlightNextStep();
}
