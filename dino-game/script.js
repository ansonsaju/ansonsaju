const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const scoreElement = document.getElementById('score-val');
const finalScoreElement = document.getElementById('final-score');
const statusText = document.getElementById('status-text');

// Configuration
canvas.width = 800;
canvas.height = 300;

let gameActive = false;
let score = 0;
let highScore = localStorage.getItem('protoScore') || 0;
let speed = 5;
let frameCount = 0;

const COLORS = {
    yellow: '#ffdf00',
    gray: '#a1a1a6',
    darkGray: '#2c2c2e',
    ground: '#1a1a1c'
};

class Raptor {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = 50;
        this.y = canvas.height - this.height - 10;
        this.dy = 0;
        this.gravity = 0.6;
        this.jumpForce = -12;
        this.grounded = true;
        this.frame = 0;
    }

    jump() {
        if (this.grounded) {
            this.dy = this.jumpForce;
            this.grounded = false;
        }
    }

    update() {
        if (!this.grounded) {
            this.dy += this.gravity;
            this.y += this.dy;
        }

        if (this.y >= canvas.height - this.height - 10) {
            this.y = canvas.height - this.height - 10;
            this.dy = 0;
            this.grounded = true;
        }

        this.frame++;
    }

    draw() {
        // Body (Metallic Gray)
        ctx.fillStyle = COLORS.gray;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Head
        ctx.fillRect(this.x + 30, this.y - 15, 25, 20);

        // Eye (Neon Yellow)
        ctx.fillStyle = COLORS.yellow;
        ctx.shadowBlur = 10;
        ctx.shadowColor = COLORS.yellow;
        ctx.fillRect(this.x + 45, this.y - 10, 5, 5);

        // Neon Yellow Details (Circuitry)
        ctx.fillRect(this.x + 5, this.y + 10, 30, 2);
        ctx.fillRect(this.x + 5, this.y + 25, 20, 2);

        // Tail
        ctx.fillStyle = COLORS.darkGray;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 10);
        ctx.lineTo(this.x - 20, this.y + 25);
        ctx.lineTo(this.x, this.y + 40);
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

class Obstacle {
    constructor() {
        this.width = 20 + Math.random() * 30;
        this.height = 30 + Math.random() * 40;
        this.x = canvas.width;
        this.y = canvas.height - this.height - 10;
    }

    update() {
        this.x -= speed;
    }

    draw() {
        ctx.fillStyle = COLORS.yellow;
        ctx.shadowBlur = 15;
        ctx.shadowColor = COLORS.yellow;
        
        // Data spike shape
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width/2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    }
}

let raptor = new Raptor();
let obstacles = [];

function spawnObstacle() {
    if (frameCount % Math.max(70, Math.floor(120 - speed * 2)) === 0) {
        obstacles.push(new Obstacle());
    }
}

function resetGame() {
    raptor = new Raptor();
    obstacles = [];
    score = 0;
    speed = 5;
    frameCount = 0;
    gameActive = true;
    gameOverScreen.classList.add('hidden');
    statusText.innerText = "STATUS: SYSTEM_SYNCED";
}

function endGame() {
    gameActive = false;
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.innerText = Math.floor(score);
    statusText.innerText = "STATUS: CONNECTION_LOST";
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('protoScore', Math.floor(highScore));
    }
}

function animate() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.strokeStyle = COLORS.gray;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 10);
    ctx.lineTo(canvas.width, canvas.height - 10);
    ctx.stroke();

    // Spawn & Update Obstacles
    spawnObstacle();
    obstacles.forEach((obs, index) => {
        obs.update();
        obs.draw();

        // Collision Detection
        if (
            raptor.x < obs.x + obs.width &&
            raptor.x + raptor.width > obs.x &&
            raptor.y < obs.y + obs.height &&
            raptor.y + raptor.height > obs.y
        ) {
            endGame();
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
        }
    });

    raptor.update();
    raptor.draw();

    score += 0.1;
    speed += 0.001;
    scoreElement.innerText = Math.floor(score).toString().padStart(5, '0');
    frameCount++;

    if (gameActive) {
        requestAnimationFrame(animate);
    }
}

// Input Handling
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameActive) {
            if (startScreen.classList.contains('hidden')) {
                resetGame();
                animate();
            } else {
                startScreen.classList.add('hidden');
                resetGame();
                animate();
            }
        } else {
            raptor.jump();
        }
    }
});

canvas.addEventListener('touchstart', () => {
    if (!gameActive) {
        startScreen.classList.add('hidden');
        resetGame();
        animate();
    } else {
        raptor.jump();
    }
});

// Initial draw
ctx.fillStyle = COLORS.gray;
ctx.font = "20px Share Tech Mono";
ctx.fillText("READY_FOR_SYNC", canvas.width/2 - 80, canvas.height/2);
