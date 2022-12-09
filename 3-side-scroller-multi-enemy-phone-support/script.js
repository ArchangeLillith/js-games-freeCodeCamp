window.addEventListener('load', function(){
    const CANVAS = document.getElementById('canvas1');
    const CTX = CANVAS.getContext('2d');
    CANVAS.width = 800;
    CANVAS.height = 720;
    let ENEMIES = []
    let SCORE = 0;
    let GAME_OVER = false;

    class InputHandler {
        constructor(){
            this.keys = [];
            //ES6 aRROW FUNCTION!! tHEY DON'T BIND THEIR OWN 'THIS' BUT INHERIT ONE FROM THEIR PARENT SCOPE.
            //CALLED lEXICAL sCOPING!
            window.addEventListener('keydown', e => {
                //=1 Means that this object isn't in the array
                if ((   e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp' || 
                        e.key === 'ArrowLeft' || 
                        e.key === 'ArrowRight')
                        && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                } else if (e.key === 'Enter' && GAME_OVER) restartGame();
            })
            window.addEventListener('keyup', e => {
                //=1 Means that this object isn't in the array
                if (    e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp' || 
                        e.key === 'ArrowLeft' || 
                        e.key === 'ArrowRight'){
                    //Here we find the index of by taking the index of so we know we have the right one and splice once there
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            })
        }
    }

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width= 200;
            this.height = 210;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.maxFrame = 8;
            this.frameY = 0;
            this.fps = 25;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        restart(){
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }
        draw(context){
            context.strokeStyle = 'white';
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/1.75, this.width/3, 0, Math.PI *2);
            context.stroke();
            context.drawImage(
                this.image,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width, 
                this.height,
                this.x,
                this.y,
                this.width,
                this.height)
        }
        update(input, deltaTime, enemies){
            // collision detection
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
                const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);
                const distance = Math.sqrt(dx * dx + dy * dy);  
                if (distance < 150){
                    GAME_OVER = true;
                }
            });
            // sprite animation
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            //controls
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
                this.vy -= 25;
            } else {
                this.speed = 0;
            }

            //horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            
            //vertical movement
            this.y += this.vy; 
            if (!this.onGround()){
            this.vy += this.weight;
            this.maxFrame = 5;
            this.frameY = 1;
            } else {
                this.vy = 0;
                this.maxFrame = 8;
                this.frameY = 0;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
        }
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height)
        }
        update(){
            this.x -= this.speed;
            if(this.x < 0 - this.width) this.x = 0;
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('enemyImage');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 5;
            this.markedForDeletion = false;
        }
        draw(context){
            context.strokeStyle = 'white';
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/1.75, this.width/3, 0, Math.PI *2);
            context.stroke();
            context.drawImage(
                this.image,
                this.frameX * this.width,
                0,
                this.width,
                this.height + 15,
                this.x, 
                this.y,
                this.width,
                this.height);
        }
        update(deltaTime){
            if (this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width){
                this.markedForDeletion = true;
                SCORE++;
            }
        }
    }

    function handleEnemies(deltaTime){
        if (enemyTimer >= enemyInterval + randomEnemyInterval){
            ENEMIES.push(new Enemy(CANVAS.width, CANVAS.height));
            let randomEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        ENEMIES.forEach(enemy => {
            enemy.draw(CTX);
            enemy.update(deltaTime);
        })
        ENEMIES = ENEMIES.filter(enemy => !enemy.markedForDeletion);
    }

    function displayStatusText(context){
        context.textAlign = 'left';
        context.font = '40px Helvetica'
        context.fillStyle = 'black';
        context.fillText('Score: ' + SCORE, 20, 50);
        context.fillStyle = 'white';
        context.fillText('Score: ' + SCORE, 22, 52);
        if (GAME_OVER){
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GAME OVER, press enter to try again!', CANVAS.width/2, 200)
            context.fillStyle = 'white';
            context.fillText('GAME OVER, press enter to try again!', CANVAS.width/2, 202)
        }
    }

    function restartGame(){
        player.restart();
        ENEMIES = []
        SCORE = 0;
        GAME_OVER = false;
        animate(0);
    }

    const input = new InputHandler();
    const player = new Player(CANVAS.width, CANVAS.height)
    const background = new Background(CANVAS.width, CANVAS.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        CTX.clearRect(0,0,CANVAS.width, CANVAS.height);
        background.draw(CTX)
        background.update();
        player.draw(CTX);
        player.update(input, deltaTime, ENEMIES);
        handleEnemies(deltaTime);
        displayStatusText(CTX);
        if (!GAME_OVER) requestAnimationFrame(animate);
    }
    animate(0);
})