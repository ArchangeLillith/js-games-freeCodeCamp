let playerState = "dizzy";
const dropdown = document.getElementById('animations');
dropdown.addEventListener("change", function (e){
    playerState = e.target.value;
})

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'shadow_dog.png'
const spriteWidth = 575;
const spriteHeight = 523;

let gameFrame = 0;
//The higher this number, the slower the animation will be 
const staggerFrames = 5;

//Is populated with location data, each pulling from animationStates to see how many frames there are
const spriteAnimations = []
//Handles name and how many frames are in the sprite library for each
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'KO',
        frames: 12,
    },
    {
        name: 'getHit',
        frames: 4,
    }
];

animationStates.forEach((state, index) => {
    let frames = {
        loc:[], 
    }
    for (let j = 0; j < state.frames; j++){
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimations[state.name] = frames; 
});
function animate(){
    //Taking the canvas and clearing it, this method expects 4 arguments 
    //This is using coordinate, coordinate and calculating based on the last two, height and width
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    //Wrapped in Math.Floor so we return a 0 UNLESS gameFrame is 5, throttling the speed so we don't have a very hyper doggo. It makes our animation 5 times slower.
    //The frames will cycle between 0 and the number/number assigned to the variable at the very end
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;

    //This final version accepts 9 arguments:
        //source, where on that image we cut it from (sourceX, sourceY, source width, source height,), and where we place it (destinationX, destY, dest wdth, dest height)
    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    
    gameFrame++;
    //requestAnimationFrame will run what we pass to it, creating an animating loop if you feed it it's parent. 
    //It runs once, but loops because it then calls its parent to run again. 
    requestAnimationFrame(animate);
};
animate();





//      -----------------       CODE EXAMPLES, NOT USED --------------------

//Was changed when  we implimented the arrays, and now we have the exact location of the image we need
    //This handles the movement between a single animation (sprite sheet dependant)
    //* let frameX = 0;
    //This handles movement between diffferent animations (sprite sheet dependant)
    //* let frameY = 0;

    
    //A handler for slowing down requestAnimation. This forces it to return only every [MATH] times the parent function runs. 
    //It's a mroe beginner way of doing things, but it works if you're not cycling through different animations with different numbers of frames. 
    //* if(gameFrame % staggerFrames == 0){
    //*     if(frameX < 6) frameX++;
    //*     else frameX = 0;
    //* }

    //This next line tests and makes sure that we're up and working, creates a rectangle
    //* ctx.fillRect(50,50,100,100);


    //drawImage can accept 2 arguments: source, destinationX and Y
    //* ctx.drawImage(playerImage, 0, 0);
    //Can also accept 5 arguments: source, destinationX, destinationY, width and height. 
    //* ctx.drawImage(playerImage, 0, 0, 500, 500);
