const gameviewer = document.getElementById("gamecanvas");
const brush = gameviewer.getContext('2d');

let playerX = 500;
let playerY = 100;
let worldX = 0;
let levelWidth = 3000;
let speedX = 0;
let speedY = 0;
const gravity = 1; // positive pulls the player down (standard physics)
const GROUND_Y = 600;

// Movement tuning
const ACCEL = 1.2;         // horizontal acceleration per frame while key is held
const MAX_SPEED_X = 12;    // max horizontal speed
const FRICTION = 0.85;     // applied when no left/right input
const JUMP_VELOCITY = -18; // initial upward velocity for jump

// keep track of which keys are held so movement is smooth
const keys = {
    left: false,
    right: false,
    jump: false,
};

// Track touch/click state for tap detection
let touchStartTime = 0;
const TAP_THRESHOLD = 200; // ms - max duration to consider as a tap/jump

// initialize canvas size and handle resizing
function resizeCanvas() {
    gameviewer.width = window.innerWidth;
    gameviewer.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Touch/Click handling for screen halves
document.addEventListener('mousedown', (event) => {
    touchStartTime = Date.now();
    const screenCenterX = window.innerWidth / 2;
    
    if (event.clientX > screenCenterX) {
        keys.right = true;
    } else {
        keys.left = true;
    }
});

document.addEventListener('mouseup', (event) => {
    const touchDuration = Date.now() - touchStartTime;
    const screenCenterX = window.innerWidth / 2;
    
    // Check if it was a quick tap (for jumping)
    if (touchDuration < TAP_THRESHOLD) {
        keys.jump = true;
        // Jump impulse will be applied in gameloop when on ground
    }
    
    // Stop movement
    if (event.clientX > screenCenterX) {
        keys.right = false;
    } else {
        keys.left = false;
    }
});

// Touch handling for mobile
document.addEventListener('touchstart', (event) => {
    touchStartTime = Date.now();
    const touch = event.touches[0];
    const screenCenterX = window.innerWidth / 2;
    
    if (touch.clientX > screenCenterX) {
        keys.right = true;
    } else {
        keys.left = true;
    }
});

document.addEventListener('touchend', (event) => {
    const touchDuration = Date.now() - touchStartTime;
    
    // Check if it was a quick tap (for jumping)
    if (touchDuration < TAP_THRESHOLD) {
        keys.jump = true;
        // Jump impulse will be applied in gameloop when on ground
    }
    
    // Stop movement
    keys.right = false;
    keys.left = false;
});

brush.clearCanvas = function() {
    brush.clearRect(0, 0, gameviewer.width, gameviewer.height);
}

brush.drawPlayer = function(x, y, size, color) {
    brush.fillStyle = color;
    brush.fillRect(x - (size / 2), y - (size / 2), size, size);
}

function gameloop() {
    // horizontal movement: accelerate when keys pressed, otherwise apply friction
    if (keys.right && !keys.left) {
        speedX += ACCEL;
    } else if (keys.left && !keys.right) {
        speedX -= ACCEL;
    } else {
        // no horizontal input -> apply friction
        speedX *= FRICTION;
        // avoid tiny lingering velocities
        if (Math.abs(speedX) < 0.1) speedX = 0;
    }

    // clamp horizontal speed
    if (speedX > MAX_SPEED_X) speedX = MAX_SPEED_X;
    if (speedX < -MAX_SPEED_X) speedX = -MAX_SPEED_X;

    // vertical movement
    speedY += gravity; // gravity pulls down
    playerX += speedX;
    playerY += speedY;

    // ground collision & jumping
    if (playerY >= GROUND_Y) {
        // snap to ground
        playerY = GROUND_Y;
        speedY = 0;
        // apply jump impulse only if jump key is pressed now
        if (keys.jump) {
            speedY = JUMP_VELOCITY;
            keys.jump = false; // consume the jump
        }
    }

    // simple world bounds
    if (playerX < 0) playerX = 0;
    if (playerX > levelWidth) playerX = levelWidth;

    brush.clearCanvas();
    brush.drawPlayer(playerX, playerY, 100, '#ff0000');

    window.requestAnimationFrame(gameloop);
}

window.requestAnimationFrame(gameloop);
