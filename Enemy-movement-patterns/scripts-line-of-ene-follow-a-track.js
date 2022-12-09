/** @type {HTMLCanvasElement} */

//To set up the canvas and get the java linked in to it
const CANVAS = document.getElementById('canvas1');
const CTX = CANVAS.getContext('2d');
CANVAS_WIDTH = CANVAS.width = 500;
CANVAS_HEIGHT = CANVAS.height = 1000;
const numOfEnemies = 20;
const enemiesArray = [];


// const enemyImage = new Image();
// enemyImage.src = 'enemy1.png'
let gameFrame = 0;
/* enemy1 = {
    Simple javascript object, stores values as to where and how on the canvas we draw this
    Used to test functionality
    x: 0,
    y: 0,
    width: 200,
    height: 200,
}
*/

//This is wherer we're building the factory, that every time we call it it'll give us one or more if we specify
class Enemy {
    //REQUIRED for a class, this will be the blueprint for that the factory is turning out
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy3.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteHeight = 177;
        this.spriteWidth = 218;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;
        this.x = Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.angle = Math.random() * 500;
        this.angleSpeed = Math.random() * 2 + 0.5;
        // this.curve = Math.random() * 200 + 50;
    }
    //This is avaliable to anything inside the javascript class and will handle all movement for the different objects
    update(){
        this.x = CANVAS_WIDTH/2 * Math.sin(this.angle * Math.PI/360) + (CANVAS_WIDTH/2 - this.width/2);
        this.y = CANVAS_HEIGHT/2 * Math.cos(this.angle * Math.PI/180) + (CANVAS_HEIGHT/2 - this.height/2);
        this.angle += this.angleSpeed;
        if(this.x + this.width < 0) this.x = CANVAS.width;
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        CTX.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}
//NEW tells the constructor to run from a blank slate, to enter the constructor with a blank javascript obj and apply the constructor method. This only makes one enemy, however
// const enemy1 = new Enemy();

for(let i = 0; i < numOfEnemies; i++){
    enemiesArray.push(new Enemy());
}

function animate(){
    CTX.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        //This is one way we could handle it, but we've moved it to the calss so we don't have to access and tell each indivivual enemy what to do. This is much less scalable than having it baked into the class.  
    // enemy1.x++;
    // enemy1.y++;
    // enemy2.x += 0.5;
    // enemy2.y += 0.5;

    //this function expects X, Y, width and height of the rectangle it's going to be drawing
    //Like above, this was moved into the class to make it more scalable  
    // CTX.fillRect(enemy1.x, enemy1.y, enemy1.width, enemy1.height);
    enemiesArray.forEach(enemy => {
        enemy.draw();
        enemy.update();
    })
    gameFrame++;
    requestAnimationFrame(animate);
};

animate();