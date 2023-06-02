import Block from "./block.js";
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

const copyBlock = (block) => new Block(block.shapes, block.color, {...block.coord}, {...block.pos}, block.currentShapeNum);

const gm = {};  // 테트리스의 인스턴스

//const t1 = new Tetris(ctx, $myNick.value, {x:50, y:0});

document.body.style.overflow = "hidden";

document.addEventListener('keydown', (e)=>{
  const cloneBlock = copyBlock(gm[$myNick.value].block);
  cloneBlock.move[e.key]();
  if(gm[$myNick.value].stage.cantMoveBlock(cloneBlock)) return;
  myMsgSend('direction', e.key);
})


const myMsgSend = (code, direction ) =>{
  const myMsg = { nick : $myNick.value, code : code, direction : direction }; 
  ws.send(JSON.stringify(myMsg));
}

window.isReady = false;

const functionByMsgCode = {
  'direction' : (msg) => {gm[msg.nick].block.move[msg.direction]()},
  'ready'     : (msg) => {
    if(gm[msg.nick] !== undefined) return;
    if(msg.nick === $myNick.value){  
      gm[msg.nick] = new Tetris(ctx, {x:50, y:0});
    }
    else {                            
      gm[msg.nick] = new Tetris(ctx, {x:650, y:0});
      if(window.isReady)
        ws.send(JSON.stringify({nick : $myNick.value,  code : 'ready'}));
    }
    gm[msg.nick].start(msg.shapesArr);
  },
  'countDown' : (msg) => {
    let cnt = 5;
    const countDownTimer = setInterval(() => {
      ctx.clearRect(CANVAS_WIDTH/2-50, CANVAS_HEIGHT/2-75, 200, 200);
      ctx.font = "bold 100px Arial, sans-serif";
      ctx.fillStyle = '#ddd';
      ctx.fillText(`${cnt}` , CANVAS_WIDTH/2-30  , CANVAS_HEIGHT/2);
      cnt--;
      if(cnt < 0) {
        clearInterval(countDownTimer);
      }
    }, 1000);

  },
}


const receiveMsg = (e) => {
  const msg = JSON.parse(e.data)
  console.log(msg);
  functionByMsgCode[msg.code](msg);
}


window.ready = () => {
  window.isReady = true;
  ws.send(JSON.stringify({nick : $myNick.value,  code : 'ready'}))
  document.querySelector('#ready').style.display = "none";
}

ws.onmessage = receiveMsg;
