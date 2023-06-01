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

const t1 = new Tetris(ctx, $myNick.value, {x:50, y:0});

// setInterval(() => {
//   t1.block.move('DOWN');
// }, 1000);

document.body.style.overflow = "hidden";

document.addEventListener('keydown', (e)=>{
  const cloneBlock = copyBlock(t1.block);

  cloneBlock.move[e.key]();
  if(t1.stage.cantMoveBlock(cloneBlock)) return;
  myMsgSend('direction', e.key);
//  t1.block.move[e.key]();
})


const myMsgSend = (code, direction ) =>{
  const myMsg = { 
                  nick : $myNick.value, 
                  code : code,
                  direction : direction,
                  block : null,
                }; 
  ws.send(JSON.stringify(myMsg));
}

const functionByMsgCode = {
  'direction' : (msg) => {t1.block.move[msg.direction]()},
  'start'     : (msg) => {t1.start(msg.shapesArr)}
}

const receiveMsg = (e) => {
  const msg = JSON.parse(e.data)
  console.log(msg);
  if(msg.nick === $myNick.value)
    functionByMsgCode[msg.code](msg);
}

window.start = () => {
  ws.send(JSON.stringify({nick : $myNick.value,  code : 'start'}))
}

ws.onmessage = receiveMsg;
