export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 20;
        this.fontFamily = 'Helvetica';

    }
    draw(context){
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        //score
        context.fillText('State: ' + this.game.player.currentState.state, 20, 20);
        context.fillText('Score: ' + this.game.score, 20, 50);
        //timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + this.game.time, 20, 80);
        //game over message
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if(this.game.gameOver){
                context.fillText('Boo-yah', this.game.width * 0.5, this.game.height * 0.5 - 20)
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('What are creatures of the night afraid of? You!', this.game.width * 0.5, this.game.height * 0.5 + 20)
            }
        }
    }
}