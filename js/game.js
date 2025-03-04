document.addEventListener("DOMContentLoaded", () => {
    const levelTitle = document.getElementById("level-title");
    const traversalIndicator = document.getElementById("traversal-indicator"); // Added traversal indicator
    const treeContainer = document.getElementById("tree-container");
    const treeLines = document.getElementById("tree-lines");
    const feedback = document.getElementById("feedback");
    const restartBtn = document.getElementById("restart-btn");
    const timerDisplay = document.getElementById("timer");
    console.log("game.js is loaded and running...");


    const urlParams = new URLSearchParams(window.location.search);
    const levelId = parseInt(urlParams.get("level")) || 1;

    const traversalTypes = ["preorder", "inorder", "postorder"];

    const difficultySettings = {
        1: { name: "Preorder Tutorial", traversal: "preorder", size: 7, timeLimit: 60 },
        2: { name: "Inorder Tutorial", traversal: "inorder", size: 7, timeLimit: 60 },
        3: { name: "Postorder Tutorial", traversal: "postorder", size: 7, timeLimit: 60 },
        4: { name: "Level 4", traversal: "random", size: 10, timeLimit: 60 },
        5: { name: "Level 5", traversal: "random", size: 12, timeLimit: 60 },
        6: { name: "Level 6", traversal: "random", size: 15, timeLimit: 60 },
        7: { name: "Level 7", traversal: "preorder", size: 18, timeLimit: 60 },
        8: { name: "Level 8", traversal: "inorder", size: 18, timeLimit: 60 },
        9: { name: "Level 9", traversal: "postorder", size: 20, timeLimit: 60 },
        10: { name: "🌲 Forest Guardian", traversal: "random", size: 22, timeLimit: 60 }, // Themed Level
        11: { name: "Level 11", traversal: "random", size: 24, timeLimit: 60 },
        12: { name: "Level 12", traversal: "preorder", size: 26, timeLimit: 60 },
        13: { name: "Level 13", traversal: "inorder", size: 28, timeLimit: 60 },
        14: { name: "Level 14", traversal: "postorder", size: 30, timeLimit: 60 },
        15: { name: "Level 15", traversal: "random", size: 32, timeLimit: 60 },
        16: { name: "Level 16", traversal: "preorder", size: 35, timeLimit: 60 },
        17: { name: "Level 17", traversal: "inorder", size: 38, timeLimit: 60 },
        18: { name: "Level 18", traversal: "postorder", size: 40, timeLimit: 60 },
        19: { name: "Level 19", traversal: "random", size: 42, timeLimit: 60 },
        20: { name: "🌿 Mystic Grove", traversal: "random", size: 45, timeLimit: 60 }, // Themed Level
        21: { name: "Level 21", traversal: "preorder", size: 48, timeLimit: 60 },
        22: { name: "Level 22", traversal: "inorder", size: 50, timeLimit: 60 },
        23: { name: "Level 23", traversal: "postorder", size: 52, timeLimit: 60 },
        24: { name: "Level 24", traversal: "random", size: 55, timeLimit: 60 },
        25: { name: "Level 25", traversal: "random", size: 58, timeLimit: 60 },
        26: { name: "Level 26", traversal: "preorder", size: 60, timeLimit: 60 },
        27: { name: "Level 27", traversal: "inorder", size: 63, timeLimit: 60 },
        28: { name: "Level 28", traversal: "postorder", size: 65, timeLimit: 60 },
        29: { name: "Level 29", traversal: "random", size: 68, timeLimit: 60 },
        30: { name: "🌌 The Eternal Tree", traversal: "random", size: 70, timeLimit: 60 } // Final Boss Level
    };
    

    const currentLevel = difficultySettings[levelId] || difficultySettings[1];

    if (currentLevel.traversal === "random") {
        currentLevel.traversal = traversalTypes[Math.floor(Math.random() * traversalTypes.length)];
    }

    levelTitle.textContent = currentLevel.name;
    traversalIndicator.textContent = `Traversal: ${currentLevel.traversal.toUpperCase()}`; // Display traversal type


    let score = 0;
    let comboMultiplier = 1;
    let mistakes = 0;
    let userSequence = [];
    let correctSequence = [];
    let timeRemaining = currentLevel.timeLimit;
    let timerInterval;

    function generateRandomTree(size) {
        let values = Array.from({ length: size }, (_, i) => i + 1);
        values = shuffleArray(values);
    
        function buildTree(arr) {
            if (arr.length === 0) return null;
            let mid = Math.floor(arr.length / 2);
            return {
                value: arr[mid],
                left: buildTree(arr.slice(0, mid)),
                right: buildTree(arr.slice(mid + 1))
            };
        }
    
        return buildTree(values);
    }
    
    
    let tree = generateRandomTree(currentLevel.size);
console.log("Generated Tree:", JSON.stringify(tree, null, 2));


    function getTraversalOrder(tree, type) {
        let result = [];
        function traverse(node) {
            if (!node) return;
            if (type === "preorder") result.push(node.value);
            traverse(node.left);
            if (type === "inorder") result.push(node.value);
            traverse(node.right);
            if (type === "postorder") result.push(node.value);
        }
        traverse(tree);

        console.log(`Generated ${type} traversal:`, result); // Debugging
        return result;
    }


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startTimer() {
        timerDisplay.textContent = `Time: ${timeRemaining}s`;
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `Time: ${timeRemaining}s`;
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                feedback.textContent = "Time's up! ⏳ Level failed.";
                restartBtn.style.display = "block";
            }
        }, 1000);
    }

    function initLevel() {
        clearInterval(timerInterval);
        timeRemaining = currentLevel.timeLimit;
        startTimer();

        let tree = generateRandomTree(currentLevel.size);
        correctSequence = getTraversalOrder(tree, currentLevel.traversal);
        if (!treeContainer) {
            console.error("Tree container not found!");
            return;
        }
        generateTreeUI(tree, treeContainer);;
    }

    function drawLine(parentNode, childNode) {
        let svg = document.getElementById("tree-lines");
    
        let parentRect = parentNode.getBoundingClientRect();
        let childRect = childNode.getBoundingClientRect();
        let svgRect = svg.getBoundingClientRect();  // Get SVG's position
    
        let parentX = parentRect.left + parentRect.width / 2 - svgRect.left;
        let parentY = parentRect.top + parentRect.height / 2 - svgRect.top;
        let childX = childRect.left + childRect.width / 2 - svgRect.left;
        let childY = childRect.top + childRect.height / 2 - svgRect.top;
    
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", parentX);
        line.setAttribute("y1", parentY);
        line.setAttribute("x2", childX);
        line.setAttribute("y2", childY);
        line.setAttribute("stroke", "#aaa");
        line.setAttribute("stroke-width", "2");
    
        svg.appendChild(line);
    }
    
    
    function calculateWidths(tree) {
        if (!tree) return 0;
    
        let leftWidth = calculateWidths(tree.left);
        let rightWidth = calculateWidths(tree.right);
    
        // Minimum spacing between siblings
        let minSpacing = 100;
    
        if (!tree.left && !tree.right) {
            tree.width = minSpacing; // Leaf nodes get the minimum width
        } else {
            tree.width = Math.max(leftWidth + rightWidth, minSpacing);
        }
    
        return tree.width;
    }
    
    function generateTreeUI(tree, container, parentNode = null, x = null, y = 50, depth = 0) {
        if (!tree) return;
    
        // **First, calculate subtree widths**
        if (depth === 0) {
            calculateWidths(tree);
            x = container.clientWidth / 2;
        }
    
        let nodeDiv = document.createElement("div");
        nodeDiv.classList.add("tree-node");
        nodeDiv.style.left = `${x}px`;
        nodeDiv.style.top = `${y}px`;
        nodeDiv.innerText = tree.value;
    
        nodeDiv.addEventListener("click", () => handleNodeClick(tree.value, nodeDiv));
        container.appendChild(nodeDiv);
    
        if (parentNode) {
            drawLine(parentNode, nodeDiv);
        }
    
        let leftWidth = tree.left ? tree.left.width : 0;
        let rightWidth = tree.right ? tree.right.width : 0;
    
        // **Child positioning logic**
        if (tree.left && tree.right) {
            // Both children: Use calculated spacing
            generateTreeUI(tree.left, container, nodeDiv, x - leftWidth / 2, y + 80, depth + 1);
            generateTreeUI(tree.right, container, nodeDiv, x + rightWidth / 2, y + 80, depth + 1);
        } else if (tree.left || tree.right) {
            // Only one child: Position directly below
            let childNode = tree.left ? tree.left : tree.right;
            generateTreeUI(childNode, container, nodeDiv, x, y + 80, depth + 1);
        }
    }

    



    console.log("Generated tree sequence:", correctSequence);
console.log("Tree container:", treeContainer);
console.log("Inner HTML after generation:", treeContainer.innerHTML);


    function createTreeNode(value, x, y) {
        let node = document.createElement("div");
        node.classList.add("tree-node");
        node.textContent = value;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.addEventListener("click", () => handleNodeClick(value, node));
        return node;
    }

    function handleNodeClick(value, node) {
        // Reset previous incorrect nodes
        document.querySelectorAll(".tree-node.wrong").forEach(n => n.classList.remove("wrong"));
    
        if (userSequence.length < correctSequence.length) {
            if (value === correctSequence[userSequence.length]) {
                node.classList.add("correct");
                userSequence.push(value);
                score += 10 * comboMultiplier;
                comboMultiplier++;
                feedback.textContent = `✅ Good choice! +${10 * comboMultiplier} points`;
            } else {
                node.classList.add("wrong");
                let penalty = 5;
                score = Math.max(0, score - penalty); // Deduct points, but never below 0
                comboMultiplier = 1;
                mistakes++;
                feedback.textContent = `❌ Incorrect! -${penalty} points. Try again.`;
            }
    
            // Check if level is complete
            if (userSequence.length === correctSequence.length) {
                clearInterval(timerInterval);
                feedback.textContent = "🎉 Level Complete!";
                saveProgress();
                setTimeout(() => alert(`You finished the level with ${score} points!`), 500);
            }
        }
    }
    
    

    function saveProgress() {
        let savedData = JSON.parse(localStorage.getItem("treequest_progress")) || {};
        let stars = calculateStars();
        savedData[levelId] = {
            score: Math.max(score, savedData[levelId]?.score || 0),
            stars: Math.max(stars, savedData[levelId]?.stars || 0)
        };

        if (mistakes === 0) unlockAchievement("Flawless Victory");
        if (timeRemaining > 10) unlockAchievement("Speed Runner");

        localStorage.setItem("treequest_progress", JSON.stringify(savedData));
    }

    function calculateStars() {
        let stars = 1;
        if (mistakes === 0) stars = 3;
        else if (mistakes <= 2) stars = 2;
        return stars;
    }

    function unlockAchievement(name) {
        let achievements = JSON.parse(localStorage.getItem("treequest_achievements")) || [];
        if (!achievements.includes(name)) {
            achievements.push(name);
            localStorage.setItem("treequest_achievements", JSON.stringify(achievements));
            alert(`🎉 Achievement Unlocked: ${name}!`);
        }
    }

    console.log("Rendering tree structure:", JSON.stringify(tree, null, 2));


    restartBtn.addEventListener("click", () => {
        userSequence = [];
        score = 0;
        mistakes = 0;
        comboMultiplier = 1;
        feedback.textContent = "";
        restartBtn.style.display = "none";
        initLevel();
    });

    initLevel();
});
