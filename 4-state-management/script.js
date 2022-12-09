import Player from './player.js';
import InputHandler from './input.js';
import {drawStatusText} from './utils.js'

window.addEventListener('load', function(){
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
    const CANVAS = document.getElementById('canvas1');
    const CTX = CANVAS.getContext('2d');
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    const player = new Player(CANVAS.width, CANVAS.height);
    const input = new InputHandler();
    
    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        CTX.clearRect(0,0,CANVAS.width,CANVAS.height);
        player.update(input.lastKey);
        player.draw(CTX, deltaTime);
        requestAnimationFrame(animate)
        drawStatusText(CTX, input, player);
    }
    animate(0);
});