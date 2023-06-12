import Tetris from "./tetris.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, randomColor } from "./global_variable.js";

const ws = new WebSocket("ws://localhost:3002");
const $div = document.querySelector("#tetris");
const $cvs = document.createElement("canvas");
$cvs.width = CANVAS_WIDTH;
$cvs.height = CANVAS_HEIGHT;
const ctx = $cvs.getContext('2d');
$div.appendChild($cvs);
const $myNick = { value : randomColor()};  //document.querySelector('#myNick');

const gm = {
              players : {}, 
              isGameStart : false, 
              isReady : false, 
              gameStart  : () => {
                                    gm.isGameStart = true;
                                    Object.keys(gm.players).map(nick => gm.players[nick].start());
                                  },
}

document.body.style.overflow = "hidden";

document.addEventListener('keydown', (e)=>{
  if(gm.players[$myNick.value].cantMoveBlock(gm.players[$myNick.value].block, e.key)) return;
  if(gm.isGameStart)
    myMsgSend('direction', e.key);
})  

const myMsgSend = (code, direction ) =>{
  const myMsg = { nick : $myNick.value, code : code, direction : direction }; 
  ws.send(JSON.stringify(myMsg));
}

const functionByMsgCode = {
  'direction' : (msg) => {gm.players[msg.nick].block.move[msg.direction]()},
  'ready'     : (msg) => {
    if(gm.players[msg.nick] !== undefined) return;
    if(msg.nick === $myNick.value){  
      gm.players[msg.nick] = new Tetris(ctx, {x:50, y:0});
    }
    else {                            
      gm.players[msg.nick] = new Tetris(ctx, {x:650, y:0});
      if(gm.isReady)
        ws.send(JSON.stringify({nick : $myNick.value,  code : 'ready'}));
    }
    gm.players[msg.nick].ready(msg.shapesArr);
  },
  'countDown' : (msg) => {
    let cnt = 2;
    const countDownTimer = setInterval(() => {
      ctx.clearRect(CANVAS_WIDTH/2-50, CANVAS_HEIGHT/2-75, 200, 200);
      ctx.font = "bold 100px Arial, sans-serif";
      ctx.fillStyle = '#ddd';
      ctx.fillText(`${cnt}` , CANVAS_WIDTH/2-30  , CANVAS_HEIGHT/2);
      cnt--;
      if(cnt < 0) {
        clearInterval(countDownTimer);
        ctx.clearRect(CANVAS_WIDTH/2-50, CANVAS_HEIGHT/2-75, 200, 200);
        gm.gameStart();
      }
    }, 1000);
  },
}

const receiveMsg = (e) => {
  const msg = JSON.parse(e.data)
  console.log(msg);
  functionByMsgCode[msg.code](msg);
  Object.keys(gm.players).map(nick => gm.players[nick].draw());
}

window.ready = () => {
  gm.isReady = true;
  ws.send(JSON.stringify({nick : $myNick.value,  code : 'ready'}))
  document.querySelector('#ready').style.display = "none";
}

ws.onmessage = receiveMsg;
