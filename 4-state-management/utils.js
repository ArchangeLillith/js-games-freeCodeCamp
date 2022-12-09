export function drawStatusText(context, input, player){
    context.font = '30px Helvetica';
    context.fillText('Last input: ' + input.lastKey, 40, 40);
    context.fillText('Active state: ' + player.currentState.state, 40, 90);
}