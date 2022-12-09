const CANVAS = document.getElementById('canvas1');
const CTX = CANVAS.getContext('2d');
CANVAS.width = 500;
CANVAS.height = 700;
const EXPLOSIONS = [];
let canvasPosition = CANVAS.getBoundingClientRect();

class Explosion {
    constructor(x, y){
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'boom.png';
        this.frame = 0;
        this.timer = 0;
        this.angle = Math.random() * 6.2;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
    }
    update(){
        if(this.frame === 0) this.sound.play();
        this.timer++;
        if (this.timer % 10 === 0){
            this.frame++;
        }
    }
    draw(){
        CTX.save();
        CTX.translate(this.x, this.y);
        CTX.rotate(this.angle);
        CTX.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 - this.width / 2, 0 - this.height /2, this.width, this.height);
        CTX.restore();
    }
}

window.addEventListener('click', function(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    EXPLOSIONS.push(new Explosion(positionX, positionY));
});

//SIMPLE way to add and remove things on and off an array
function animate(){
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    for(let i = 0; i < EXPLOSIONS.length; i++){
        EXPLOSIONS[i].update();
        EXPLOSIONS[i].draw();
        if(EXPLOSIONS[i].frame > 5){
            EXPLOSIONS.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();
