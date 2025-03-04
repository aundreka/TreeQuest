document.addEventListener("DOMContentLoaded", () => {
    const levelTitle = document.getElementById("level-title");
    const traversalIndicator = document.getElementById("traversal-indicator"); 
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
        1: { name: "Preorder Tutorial", traversal: "preorder", size: 7, timeLimit: Infinity },
        2: { name: "Inorder Tutorial", traversal: "inorder", size: 7, timeLimit: Infinity },
        3: { name: "Postorder Tutorial", traversal: "postorder", size: 7, timeLimit: Infinity },
        4: { name: "Level 4", traversal: "random", size: 8, timeLimit: 60 },
        5: { name: "Level 5", traversal: "random", size: 8, timeLimit: 60 },
        6: { name: "Level 6", traversal: "random", size: 9, timeLimit: 60 },
        7: { name: "Level 7", traversal: "preorder", size: 9, timeLimit: 60 },
        8: { name: "Level 8", traversal: "inorder", size: 10, timeLimit: 60 },
        9: { name: "Level 9", traversal: "postorder", size: 10, timeLimit: 60 },
        10: { name: "🌲 Forest Guardian", traversal: "random", size: 11, timeLimit: 60 }, 
        11: { name: "Level 11", traversal: "random", size: 12, timeLimit: 60 },
        12: { name: "Level 12", traversal: "preorder", size: 13, timeLimit: 60 },
        13: { name: "Level 13", traversal: "inorder", size: 14, timeLimit: 60 },
        14: { name: "Level 14", traversal: "postorder", size: 15, timeLimit: 60 },
        15: { name: "Level 15", traversal: "random", size: 16, timeLimit: 60 },
        16: { name: "Level 16", traversal: "preorder", size: 17, timeLimit: 60 },
        17: { name: "Level 17", traversal: "inorder", size: 18, timeLimit: 60 },
        18: { name: "Level 18", traversal: "postorder", size: 19, timeLimit: 60 },
        19: { name: "Level 19", traversal: "random", size: 20, timeLimit: 60 },
        20: { name: "🌿 Mystic Grove", traversal: "random", size: 21, timeLimit: 60 }, 
        21: { name: "Level 21", traversal: "preorder", size: 22, timeLimit: 60 },
        22: { name: "Level 22", traversal: "inorder", size: 23, timeLimit: 60 },
        23: { name: "Level 23", traversal: "postorder", size: 24, timeLimit: 60 },
        24: { name: "Level 24", traversal: "random", size: 25, timeLimit: 60 },
        25: { name: "Level 25", traversal: "random", size: 26, timeLimit: 60 },
        26: { name: "Level 26", traversal: "preorder", size: 27, timeLimit: 60 },
        27: { name: "Level 27", traversal: "inorder", size: 28, timeLimit: 60 },
        28: { name: "Level 28", traversal: "postorder", size: 29, timeLimit: 60 },
        29: { name: "Level 29", traversal: "random", size: 30, timeLimit: 60 },
        30: { name: "🌌 The Eternal Tree", traversal: "random", size: 45, timeLimit: 60 } 
    };
    

    const currentLevel = difficultySettings[levelId] || difficultySettings[1];

    if (currentLevel.traversal === "random") {
        currentLevel.traversal = traversalTypes[Math.floor(Math.random() * traversalTypes.length)];
    }

    levelTitle.textContent = currentLevel.name;
    traversalIndicator.textContent = `Traversal: ${currentLevel.traversal.toUpperCase()}`; 


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

        console.log(`Generated ${type} traversal:`, result); 
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

        if (levelId >= 1 && levelId <= 3) {
            timerDisplay.style.display = "none"; 
            return;
        }
    
        timerDisplay.style.display = "block"; 
        timerDisplay.textContent = `Time: ${timeRemaining}s`;
        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `Time: ${timeRemaining}s`;
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                feedback.textContent = "Time's up! ⏳ Level failed.";
                
                document.querySelectorAll(".tree-node").forEach(node => {
                    node.classList.add("wrong");
                    node.style.pointerEvents = "none";
                });
            
                restartBtn.style.display = "none"; 
            
                let tryAgainBtn = document.createElement("button");
                tryAgainBtn.innerText = "Try Again";
                tryAgainBtn.classList.add("try-again-btn");
                tryAgainBtn.onclick = () => location.reload();
                document.body.appendChild(tryAgainBtn);
            }
            
        }, 1000);
    }

    function initLevel() {
        clearInterval(timerInterval);
        timeRemaining = currentLevel.timeLimit;
        tree = generateRandomTree(currentLevel.size);
        correctSequence = getTraversalOrder(tree, currentLevel.traversal);
    
        if (!treeContainer) {
            console.error("Tree container not found!");
            return;
        }
        generateTreeUI(tree, treeContainer);
        if (levelId > 3) {
            restartBtn.style.display = "block";
        } else {
            restartBtn.style.display = "none";
        }
        if (levelId <= 3) {
            startTutorial();
            showTutorial();

        } else {
            startTimer();
        }
    }

    function showTutorial(level) {
        let traversalOrder;
    
        if (levelId === 2) {
            traversalOrder = "Left → Root → Right"; 
        } else if (levelId === 3) {
            traversalOrder = "Left → Right → Root"; 
        } else {
            traversalOrder = "Root → Left → Right"; 
        }
    
        feedback.innerHTML = `Follow the traversal order: <strong>${traversalOrder}</strong>`;
        timerDisplay.style.display = "none"; 
    
        let index = 0;
    
        function highlightStep() {
            if (index < correctSequence.length) {
                let node = document.querySelector(`.tree-node[data-value="${correctSequence[index]}"]`);
                node.classList.add("highlight");
    
                let stepText = document.createElement("div");
                stepText.className = "tutorial-step";
                stepText.textContent = getTraversalText(index, currentLevel.traversal);  // Pass traversal type
                node.appendChild(stepText);
    
                setTimeout(() => {
                    node.classList.remove("highlight");
                    stepText.remove();
                    index++;
                    highlightStep();
                }, 1000);
            } else {
                feedback.innerHTML = "Now it's your turn!";
            }
        }
    
        highlightStep();
    }
    
    
    
    function getTraversalText(index, traversalType) {
        if (traversalType === "preorder") {
            return index === 0 ? "Root" : index % 2 === 1 ? "Left" : "Right";
        } else if (traversalType === "inorder") {
            return index % 2 === 0 ? "Left" : index === correctSequence.length - 1 ? "Right" : "Root";
        } else if (traversalType === "postorder") {
            return index % 2 === 0 ? "Left" : index % 2 === 1 ? "Right" : "Root";
        }
    }
    
    

    function startTutorial() {
        feedback.textContent = "Follow the traversal order!";
        
        let index = 0;
        function highlightNextNode() {
            if (index >= correctSequence.length) return;
            
            let nextNodeValue = correctSequence[index];
            let nextNode = [...document.querySelectorAll(".tree-node")].find(n => n.textContent == nextNodeValue);
    
            if (nextNode) {
                nextNode.classList.add("highlight");
                setTimeout(() => {
                    nextNode.classList.remove("highlight");
                    index++;
                    highlightNextNode();
                }, 1000);
            }
        }
    
        setTimeout(highlightNextNode, 500);
    }

    function drawLine(parentNode, childNode) {
        let svg = document.getElementById("tree-lines");
    
        // Get the parent and child node positions relative to the entire document
        let parentRect = parentNode.getBoundingClientRect();
        let childRect = childNode.getBoundingClientRect();
        let svgRect = svg.getBoundingClientRect();  // Get SVG's position
    
        // Calculate the center points of the parent and child nodes
        let parentX = parentRect.left + parentRect.width / 2 - svgRect.left;
        let parentY = parentRect.top + parentRect.height / 2 - svgRect.top;
        let childX = childRect.left + childRect.width / 2 - svgRect.left;
        let childY = childRect.top + childRect.height / 2 - svgRect.top;
    
        // Create an SVG line element
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", parentX);
        line.setAttribute("y1", parentY);
        line.setAttribute("x2", childX);
        line.setAttribute("y2", childY);
        line.setAttribute("stroke", "#aaa");
        line.setAttribute("stroke-width", "2");
    
        // Append the line to the SVG container
        svg.appendChild(line);
    }
    
    // Trigger line drawing after DOM is fully loaded
    window.addEventListener('load', function() {
        let parentNode = document.getElementById("parentNode"); // Replace with actual node id
        let childNode = document.getElementById("childNode"); // Replace with actual node id
        drawLine(parentNode, childNode);  // Call your function to draw the line
    });
    
    
    
    function calculateWidths(tree) {
        if (!tree) return 0;
    
        let leftWidth = calculateWidths(tree.left);
        let rightWidth = calculateWidths(tree.right);
    
        let minSpacing = 90;
    
        if (!tree.left && !tree.right) {
            tree.width = minSpacing; 
        } else {
            tree.width = Math.max(leftWidth + rightWidth, minSpacing);
        }
    
        return tree.width;
    }
    
    function generateTreeUI(tree, container, parentNode = null, x = null, y = 50, depth = 0) {
        if (!tree) return;
    
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
            // Delay drawing lines to ensure the parent node has been rendered
            setTimeout(() => drawLine(parentNode, nodeDiv), 100); // Add a delay before drawing the line
        }
    
        let leftWidth = tree.left ? tree.left.width : 0;
        let rightWidth = tree.right ? tree.right.width : 0;
    
        if (tree.left && tree.right) {
            generateTreeUI(tree.left, container, nodeDiv, x - leftWidth / 2, y + 80, depth + 1);
            generateTreeUI(tree.right, container, nodeDiv, x + rightWidth / 2, y + 80, depth + 1);
        } else if (tree.left || tree.right) {
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
        document.querySelectorAll(".tree-node.wrong").forEach(n => n.classList.remove("wrong"));
    
        if (userSequence.length < correctSequence.length) {
            if (value === correctSequence[userSequence.length]) {
                node.classList.add("correct");
                node.style.pointerEvents = "none";  
                userSequence.push(value);
                score += 10 * comboMultiplier;
                comboMultiplier++;
                feedback.textContent = `✅ Good choice! +${10 * comboMultiplier} points`;
            } else {
                node.classList.add("wrong");
                let penalty = 5;
                score = Math.max(0, score - penalty); 
                comboMultiplier = 1;
                mistakes++;
                feedback.textContent = `❌ Incorrect! -${penalty} points. Try again.`;
            }
    
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
    
        document.querySelectorAll(".tree-node").forEach(node => {
            node.classList.remove("correct", "wrong", "highlight");
            node.style.pointerEvents = "auto";
        });
    
        restartBtn.style.display = "block"; 
        initLevel();
    });
    

    initLevel();
});