// System variables
const refrshrate = 150;

const deathBySelf = [
    "You tried to eat yourself? Seriously?",
    "You... bit your own tail... Oh, I get it.",
    "I've heard of ouroboros, but this is ridiculous.",
    "You do understand the apples are the red dots... Right?",
    "You managed to bite yourself to death...",
    "Suffering from success I see.",
    "Congratulations! You're a snake cannibal.",
    "This isn't Tron... You can't light cycle yourself.",
    "Snake.exe has encountered an infinite loop.",
    "Did you confuse the snake with a pretzel?",
    "Auto-cannibalism: Not a valid survival strategy.",
    "Pro tip: Snakes shouldn't self-consume.",
    "You achieved snake-ception! (Still counts as dead)",
    "That wasn't an apple. That was YOU.",
    "The snake became its own worst enemy.",
    "Error: Snake recursive collision detected.",
    "You played yourself. (literally)",
    "The snake has officially gone vegan... too late",
    "Congratulations! You discovered snake solitaire.",
    "Skill issue."
];

const deathByVoid = [
    "Please refrain from exiting the playing ground.",
    "If you can't see yourself, you went too far.",
    "Next time, turn back when you see the border.",
    "Nobody leaves the farm, Comrade.",
    "Congratulations! You discovered the void...",
    "The snake has left the simulation.",
    "Out-of-bounds error: Snake not found.",
    "This isn't Event Horizon - stay in bounds!",
    "You entered the Danger Zone. (literally)",
    "Snake.exe has left the observable universe.",
    "Boundaries: They're not just a suggestion.",
    "You achieved escape velocity...",
    "The edge of the world isn't actually edible.",
    "Snake GPS signal lost.",
    "Warning: Reality ends here.",
    "You're going to need a bigger canvas.",
    "Congratulations! You nocliped through reality.",
    "Snake has been Thanos-snapped.",
    "The first rule of Snake Club: Stay in Snake Club."
];

// Game Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Gameloop variables
let snake = [{x:canvas.width/2, y:canvas.height/2}];
let snakeDirection = "up";
let snakeSize = 20;
let snakeSpeed = 20;

let appleSize = 20;
let currentApple = {x:getRandomInt(0, canvas.width - appleSize), y:getRandomInt(0, canvas.height + appleSize)};

// State Machine
let state = {
    current: "gameover",
    menu: {
        title: "JSnake",
        start: "Press Enter To Start"
    },
    gameloop: {
        score: 0,
    },
    gameover: {
        title: "Game Over",
        reset: "Press Enter To Restart",
        deathExplanation: "Here it says that you died because...",
        gameOverMessage: "Who knows, keep trying king."
    }
}

// Helper and debugging
let debugging = false
const startExecution = Date.now();
let frameCounter = 0;
let avgFPS = 0;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function getExecutionTime () {
    return Date.now() - startExecution
}

function checkCollisionApple () {
    // Complex math summary: check bounding boxes of snake head vs apple
    return (
        snake[0].x < currentApple.x + appleSize &&
        snake[0].x + snakeSize > currentApple.x &&
        snake[0].y < currentApple.y + appleSize &&
        snake[0].y + snakeSize > currentApple.y
    );
}

function checkCollisionSelf () {
    const head = snake[0];
    // Start from index 1 to skip comparing head with itself
    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        if (
            head.x < segment.x + snakeSize &&
            head.x + snakeSize > segment.x &&
            head.y < segment.y + snakeSize &&
            head.y + snakeSize > segment.y
        ) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}

function checkSnakeInbound () {
    return (
        snake[0].x < 0 || snake[0].x > canvas.width ||
        snake[0].y < 0 || snake[0].y > canvas.height
    );
}

function snakePlusOne () {
    let tempNewTail = { ...snake.at(-1) }
    snake.push(tempNewTail)
}

// Fill the bg black
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function clearCanvas () {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function mainLoop () {
    // Clear the framebuffer 
    clearCanvas();

    // Debugging
    // Calculate FPS
    frameCounter++;
    avgFPS = Math.round(frameCounter / (getExecutionTime() / 1000))
    // Draw FPS
    if (debugging) {
        ctx.fillStyle = "green";
        ctx.font = "30px Arial";
        ctx.fillText(avgFPS, canvas.width - ctx.measureText(avgFPS).width - 10, 30);
    }

    // Execute game logic
    switch (state.current) {
        case "menu":
            stateMenu();
            break;
        case "gameloop":
            stateGameloop();
            break;
        case "gameover":
            stateGameOver();
            break;
    }
}

function resetGame () {
    state.gameloop.score = 0;
    snake = [{x:canvas.width/2, y:canvas.height/2}];
    snakeDirection = "up";
    currentApple = {x:getRandomInt(0, canvas.width - appleSize), y:getRandomInt(0, canvas.height + appleSize)};
}

// State functions
function stateMenu () {
    // Draw title
    ctx.fillStyle = "white";
    ctx.textalign = "left";
    ctx.font = "30px Arial";
    ctx.fillText(state.menu.title, canvas.width / 2 - ctx.measureText(state.menu.title).width / 2, canvas.height / 2)
    // Draw start text
    if (Math.round((getExecutionTime() / 1000)) % 2 == 0) {
        ctx.fillStyle = "white";
        ctx.textalign = "left";
        ctx.font = "30px Arial";
        ctx.fillText(state.menu.start, canvas.width / 2 - ctx.measureText(state.menu.start).width / 2, canvas.height - canvas.height / 4);
    }
}

function stateGameloop () {
    // Calculate snake movement
    let tempHead = { ...snake[0] };
    switch (snakeDirection) {
        case "up":
            tempHead.y -= snakeSpeed;
            break;
        case "down":
            tempHead.y += snakeSpeed;
            break;
        case "right":
            tempHead.x += snakeSpeed;
            break;
        case "left":
            tempHead.x -= snakeSpeed
            break; 
    }
    snake.unshift(tempHead);
    snake.pop();

    // Check if snake hits snake
    if (checkCollisionSelf()) {
        resetGame();
        state.gameover.gameOverMessage = deathBySelf[getRandomInt(0, deathBySelf.length - 1)]
        state.current = "gameover";
    }

    // Check if snake inbound
    if (checkSnakeInbound()) {
        resetGame();
        state.gameover.gameOverMessage = deathByVoid[getRandomInt(0, deathByVoid.length - 1)]
        state.current = "gameover";
    }

    // Check if snake ate apple
    if (checkCollisionApple()) {
        snakePlusOne();
        state.gameloop.score += 1;
        currentApple = {x:getRandomInt(0, canvas.width - appleSize), y:getRandomInt(0, canvas.height + appleSize)};
    }

    // Draw Score
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(state.gameloop.score, 10, 30);

    // Draw Snake
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize)
    })

    // Draw Apple
    ctx.fillStyle = "red";
    ctx.fillRect(currentApple.x, currentApple.y, appleSize, appleSize)
}

function stateGameOver () {
    // Draw game over
    ctx.fillStyle = "red";
    ctx.textalign = "left";
    ctx.font = "60px Arial";
    ctx.fillText(state.gameover.title, canvas.width / 2 - ctx.measureText(state.gameover.title).width / 2, 150);
    // Draw explanation
    ctx.fillStyle = "red";
    ctx.textalign = "left";
    ctx.font = "30px Arial";
    ctx.fillText(state.gameover.deathExplanation, canvas.width / 2 - ctx.measureText(state.gameover.deathExplanation).width / 2, 200);
    // Draw message
    ctx.fillStyle = "red";
    ctx.textalign = "left";
    ctx.font = "20px Arial";
    ctx.fillText(state.gameover.gameOverMessage, canvas.width / 2 - ctx.measureText(state.gameover.gameOverMessage).width / 2, canvas.height / 2);
    // Draw restart text
    if (Math.round((getExecutionTime() / 1000)) % 2 == 0) {
        ctx.fillStyle = "white";
        ctx.textalign = "left";
        ctx.font = "30px Arial";
        ctx.fillText(state.gameover.reset, canvas.width / 2 - ctx.measureText(state.gameover.reset).width / 2, canvas.height - canvas.height / 4);
    }
}

// Execute main loop
setInterval(mainLoop, refrshrate);

// Input handling
document.addEventListener("keydown", keyMapper);
// Key mapping
function keyMapper (event) {
    // Debugging
    switch (event.key){
        case "D":
        case "d":
            debugging = !debugging
            break;
        case "R":
        case "r":
            if (state.current == "gameloop") {
                state.current = "menu"
            }
            break;
        case "1":
            if (state.current == "gameloop")
                snakePlusOne();
            break;
    }

    // Menu bindings
    if (state.current == "menu" || state.current == "gameover") {
        switch (event.key) {
            case "Enter":
                state.current = "gameloop"
                break;
        }
    }

    // Gameplay bindings
    if (state.current == "gameloop") {
        switch(event.key) {
            case "ArrowUp":
                snakeDirection = "up"
                break;
            case "ArrowDown":
                snakeDirection = "down"
                break;
            case "ArrowLeft":
                snakeDirection = "left"
                break;
            case "ArrowRight":
                snakeDirection = "right"
                break;
        }
    }
}