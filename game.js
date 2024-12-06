// game.js - Containment Inc.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Global Variables
let gameRunning = false;
let virusSpread = 0; // Represents the percentage of the virus spread globally
let containmentProgress = 0; // Represents vaccine and containment efforts
let panicLevel = 10; // Represents global panic (affects gameplay difficulty)
let funds = 1000; // Starting funds for containment measures
const events = [];
const countries = [
    { name: 'USA', infected: 0, population: 331 },
    { name: 'India', infected: 0, population: 1390 },
    { name: 'China', infected: 0, population: 1441 },
    { name: 'Russia', infected: 0, population: 146 },
    { name: 'Brazil', infected: 0, population: 213 },
    { name: 'Australia', infected: 0, population: 26 },
];

// Utility Functions
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addEvent(message) {
    if (events.length > 5) events.shift();
    events.push(message);
}

// Draw Functions
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#003973');
    gradient.addColorStop(1, '#E5E5BE');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStats() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(`Global Virus Spread: ${virusSpread}%`, 10, 20);
    ctx.fillText(`Containment Progress: ${containmentProgress}%`, 10, 40);
    ctx.fillText(`Global Panic Level: ${panicLevel}%`, 10, 60);
    ctx.fillText(`Funds Available: $${funds}`, 10, 80);
}

function drawEvents() {
    ctx.font = '14px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'left';
    let y = canvas.height - 100;
    events.forEach((event) => {
        ctx.fillText(event, 10, y);
        y += 20;
    });
}

function drawCountries() {
    ctx.font = '14px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    countries.forEach((country, index) => {
        const y = 100 + index * 30;
        ctx.fillText(`${country.name}: ${country.infected}% infected`, canvas.width - 250, y);
    });
}

// Game Logic Functions
function updateVirusSpread() {
    countries.forEach((country) => {
        if (random(0, 100) < panicLevel) {
            const newInfections = random(1, 5);
            country.infected = Math.min(100, country.infected + newInfections);
            virusSpread = Math.min(100, virusSpread + newInfections / 10);
        }
    });
    addEvent('Virus spread increases!');
}

function updateContainment() {
    if (funds > 0) {
        const progress = random(1, 5);
        containmentProgress = Math.min(100, containmentProgress + progress);
        funds -= 50;
        addEvent(`Containment efforts progressed by ${progress}%`);
    } else {
        addEvent('Insufficient funds for containment!');
    }
}

function handleGlobalPanic() {
    if (panicLevel < 100 && random(0, 100) < 20) {
        panicLevel += 5;
        addEvent('Global panic increases!');
    }
}

function allocateFunds() {
    if (funds > 0) {
        funds += random(100, 300);
        addEvent('Additional funds secured!');
    }
}

function gameOver() {
    gameRunning = false;
    alert(virusSpread >= 100 ? 'Game Over: The virus spread uncontrollably!' : 'Congratulations! Containment Successful!');
}

// Main Game Loop
function gameLoop() {
    if (!gameRunning) return;

    drawBackground();
    drawStats();
    drawCountries();
    drawEvents();

    if (virusSpread >= 100 || containmentProgress >= 100) {
        gameOver();
        return;
    }

    updateVirusSpread();
    handleGlobalPanic();
    setTimeout(gameLoop, 1000);
}

// Event Listeners
document.getElementById('start-game').addEventListener('click', () => {
    if (gameRunning) return;
    gameRunning = true;
    virusSpread = 0;
    containmentProgress = 0;
    panicLevel = 10;
    funds = 1000;
    countries.forEach((country) => (country.infected = 0));
    events.length = 0;
    addEvent('Game Started! Contain the virus!');
    gameLoop();
});

document.getElementById('gameCanvas').addEventListener('click', (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    if (x > canvas.width - 250 && y > 100 && y < 280) {
        const countryIndex = Math.floor((y - 100) / 30);
        const country = countries[countryIndex];
        if (country && funds >= 200) {
            country.infected = Math.max(0, country.infected - 10);
            funds -= 200;
            addEvent(`Allocated $200 to ${country.name}.`);
        }
    }
});

// Initial Screen Setup
drawBackground();
drawStats();
drawCountries();
drawEvents();
addEvent('Welcome! Click "Begin Your Mission" to start!');
