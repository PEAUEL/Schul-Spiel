const gameviewer = document.getElementById("gamecanvas")
const brush = gameviewer.getContext('2d')

let playerX = 500;
let playerY = 100;
let worldX = 0;
let levelWidth = 3000;
let speedX = 0
gameviewer.width = window.innerWidth;
gameviewer.height = window.innerHeight;

document.addEventListener('keydown', (Event) => {
    Event.preventDefault()
    if (Event.key === 'd' || Event.key === 'D' || Event.key === 'ArrowRight') {
        playerX += 10;
    }
    if (Event.key === 'a' || Event.key === 'A' || Event.key === 'ArrowLeft') {
        playerX -= 10;
    }
    if (Event.key === 'w' || Event.key === 'W' || Event.key === 'ArrowUp') {
        playerY -= 10;
    }
    if (Event.key === 's' || Event.key === 'S' || Event.key === 'ArrowDown') {
        playerY += 10;
    }
})

brush.clearCanvas = function() {
    brush.clearRect(0, 0, gameviewer.width, gameviewer.height);
}

brush.drawPlayer = function(x, y, size, color) {
    brush.fillStyle = color;
    brush.fillRect(x - (size / 2), y - (size / 2), size, size);
}

function gameloop() {
    brush.clearCanvas();
    brush.drawPlayer(playerX, playerY, 100, '#ff0000');

    window.requestAnimationFrame(gameloop);
}

window.requestAnimationFrame(gameloop);
