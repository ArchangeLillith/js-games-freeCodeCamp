//Parallax is when the foreground moves faster than the background layers, this gives an illusion of depth in a 2d space
//This is pretty typical set up for a canvas project
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 3.5;

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'layer-5.png';


const slider = document.getElementByID('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementsByID('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;

//JavaScript class, (class [|C|ustomname]) constructor required and will create a new blank object based on the things inside the object
class Layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if(this.x <= -this.width){
            this.x = this.width + this.x2 - this.speed;
        }
        if(this.x2 <= -this.width){
            this.x2 = this.width + this.x - this.speed;
        }
        this.x = Math.floor(this.x - this.speed);
        this.x2 = Math.floor(this.x2 - this.speed);
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height)
    }
}

const layer1 = new Layer(backgroundLayer1, 0.5); 
const layer2 = new Layer(backgroundLayer2, 0.75); 
const layer3 = new Layer(backgroundLayer3, 1); 
const layer4 = new Layer(backgroundLayer4, 1.25); 
const layer5 = new Layer(backgroundLayer5, 1.5); 

const gameObjects = [layer1, layer2, layer3, layer4, layer5]
//This is a non-scalable, much harder way to do this but shows the fundamentals
//* let x = 0;
//* let x2 = 2400;

//* function animate(){
//*    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//*    ctx.drawImage(backgroundLayer4, x, 0);
//*     ctx.drawImage(backgroundLayer4, x2, 0);
//*     if(x < -2400) x = 2400 + x2 - gameSpeed;
//*     else x -= gameSpeed;
//*     if(x2 < -2400) x = 2400 + x - gameSpeed;
//*     else x2 -= gameSpeed;
//*     requestAnimationFrame(animate);
//*     x-= gameSpeed;
//* };
//* animate();
function animate(){
    //this clears the canvas so we don't draw on top of an old image, so when we draw the next frame it shows as an animation
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    })
    requestAnimationFrame(animate);
};
animate();