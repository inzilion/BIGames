import Tetris from "./tetris.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, randomColor } from "./global_variable.js";

const ws = new WebSocket("ws://localhost:3002");
//const ws = new WebSocket("ws://10.94.121.10:3002");
const $div = document.querySelector("#tetris");
const $cvs = document.createElement("canvas");
$cvs.width = CANVAS_WIDTH;
$cvs.height = CANVAS_HEIGHT;
const ctx = $cvs.getContext('2d');
$div.appendChild($cvs);
const $myNick = { value : randomColor()};  //document.querySelector('#myNick');

class GameManager {
  constructor(){ 
    this.players = {}; 
    this.isGameStart = false;
    this.isReady = false;
  }
  init(){
    Object.keys(this.players).map(nick => this.players[nick].end());
    this.players = {};
    this.isGameStart = false;
    this.isReady = false;
  }
  gameStart(){
    if(this.isGameStart) return ;
    this.isGameStart = true;
    Object.keys(this.players).map(nick => this.players[nick].start());
    this.monitor();
  }
  monitor(){
    this.timer = setInterval(() => {
      Object.keys(gm.players).map(nick => {
        if(!gm.players[nick].isAlive)  
          this.gameEnd();
        if(gm.players[nick].msg != null && nick == $myNick.value){
          myMsgSend('attack', gm.players[nick].msg);
          gm.players[nick].msg = null;
        }
      });
    }, 100);
  }
  gameEnd(){
    myMsgSend('end', 'end');
    clearInterval(this.timer);
    Object.keys(this.players).map(nick => this.players[nick].end())    
  }
}

const gm = new GameManager();

document.body.style.overflow = "hidden";

document.addEventListener('keydown', (e)=>{
  try {
    if(gm.players[$myNick.value].cantMoveBlock(gm.players[$myNick.value].block, e.key)) return;
    if(gm.isGameStart)
      myMsgSend('direction', e.key);
  } catch{
    console.log('key error');
  }
})  

const myMsgSend = (code, content ) =>{
  const myMsg = { nick : $myNick.value, code : code, content : content }; 
  ws.send(JSON.stringify(myMsg));
}

const functionByMsgCode = {
  'attack'    : (msg) => {
    Object.keys(gm.players).map(nick => {
      if(nick != msg.nick)
        gm.players[nick].stage.addPenaltyRows(msg.content);
    });
  },

  'direction' : (msg) => {gm.players[msg.nick].block.move[msg.content]()},
  
  'ready'     : (msg) => {
    if(gm.players[msg.nick] !== undefined) return;
    if(msg.nick === $myNick.value){  
      gm.players[msg.nick] = new Tetris(msg.nick, ctx, {x:50, y:50});
    }
    else {                            
      gm.players[msg.nick] = new Tetris(msg.nick, ctx, {x:650, y:50});
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
  
  'end' : (msg) => {
    document.querySelector('#ready').style.display = "block";
    gm.init();
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
