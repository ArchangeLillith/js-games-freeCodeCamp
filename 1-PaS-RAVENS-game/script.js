//Canvas setup times TWO lol
const CANVAS = document.getElementById('canvas1');
const CTX = CANVAS.getContext('2d');
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;
const COLLISION_CANVAS = document.getElementById('collisionCanvas');
const COLLISION_CTX = COLLISION_CANVAS.getContext('2d');
COLLISION_CANVAS.width = window.innerWidth;
COLLISION_CANVAS.height = window.innerHeight;
//Global arrays
let RAVENS = []
let EXPLOSIONS = [];
let PARTICLES = [];
//Score handlers
let GAME_OVER = false;
let SCORE = 0;
CTX.font = '50px Impact';
//Raven/Delta time handlers
let TIME_TO_NEXT_RAVEN = 0;
let RAVEN_INTERVAL = 500;
let LAST_TIME = 0;

class Raven {
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteWidth * this.sizeModifier;
        this.x = CANVAS.width;
        this.y = Math.random() * (CANVAS.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 75 + 75;
        this.randomColors = [Math.floor(Math.random()* 255), Math.floor(Math.random()* 255), Math.floor(Math.random()* 255)]
        this.color = "rgb(" + this.randomColors[0] + "," + this.randomColors[1] + "," + this.randomColors[2] + ")";
    }
    update(deltaTime){
        if(this.y < 0 || this.y > CANVAS.height - this.height){
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if(this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltaTime;
        if(this.timeSinceFlap > this.flapInterval){
            if(this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
            for (let i = 0; i <5; i++){
                PARTICLES.push(new Particle(this.x, this.y, this.width, "rgb(255,255,255)"))
            }
        }
        if (this.x < 0 - this.width) GAME_OVER = true;
    }
    draw(){
        COLLISION_CTX.fillStyle = this.color;
        COLLISION_CTX.fillRect(this.x, this.y, this.width, this.height);
        CTX.drawImage(
            this.image, 
            this.frame * this.spriteWidth, 
            0, 
            this.spriteWidth, 
            this.spriteHeight, 
            this.x, 
            this.y, 
            this.width, 
            this.height);
    }
}

class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 80;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if(this.frame > 5) this.markedForDeletion = true;
        }
    }
    draw(){
        CTX.drawImage(
            this.image, 
            this.frame * this.spriteWidth,
            0, 
            this.spriteWidth, 
            this.spriteHeight,
            this.x,
            this.y,
            this.size,
            this.size);
    }
}

class Particle {
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + this.size/2 + Math.random() * 50 - 25;
        this.y = y + this.size/2.25 + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }
    update(){
        this.x += this.speedX;
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }
    draw(){
        CTX.save();
        CTX.globalAlpha = 1 - this.radius/this.maxRadius;
        CTX.beginPath();
        CTX.fillStyle = this.color;
        CTX.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        CTX.fill();
        CTX.restore();
    }
}
function drawScore(){
    CTX.fillStyle = 'black';
    CTX.fillText(`Score: ${SCORE}`, 50, 75)
    CTX.fillStyle = 'white';
    CTX.fillText(`Score: ${SCORE}`, 55, 80)
}

function drawGameOver(){
    CTX.textAlign = 'center';
    CTX.fillStyle = 'black';
    CTX.fillText('GAME OVER! Your score is ' + SCORE, CANVAS.width/2, CANVAS.height/2);
    CTX.fillStyle = 'white';
    CTX.fillText('GAME OVER! Your score is ' + SCORE, CANVAS.width/2 + 5, CANVAS.height/2 + 5);
}

window.addEventListener('click', function(e){
    const detectPixelColor = COLLISION_CTX.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixelColor.data;
    RAVENS.forEach(object => {
        if(object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]){
            object.markedForDeletion = true;
            SCORE += Math.floor(object.directionX);
            EXPLOSIONS.push(new Explosion(object.x, object.y, object.width));
        }
    });
});

function animate(timestamp){
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    COLLISION_CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    let deltaTime = timestamp - LAST_TIME;
    LAST_TIME = timestamp;
    TIME_TO_NEXT_RAVEN += deltaTime;
    if(TIME_TO_NEXT_RAVEN > RAVEN_INTERVAL){
        RAVENS.push(new Raven());
        TIME_TO_NEXT_RAVEN = 0;
        RAVENS.sort(function(a,b){
            return a.width - b.width;
        })
    };
    drawScore();
    [...PARTICLES, ...RAVENS, ...EXPLOSIONS].forEach(object => object.update(deltaTime));
    [ ...PARTICLES, ...RAVENS, ...EXPLOSIONS].forEach(object => object.draw());
    RAVENS = RAVENS.filter(object => !object.markedForDeletion);
    EXPLOSIONS = EXPLOSIONS.filter(object => !object.markedForDeletion);
    PARTICLES = PARTICLES.filter(object => !object.markedForDeletion);
    if (!GAME_OVER) requestAnimationFrame(animate);
    else drawGameOver();
}

animate(0);
