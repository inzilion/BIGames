const randomShape = require("./shapes");
const { WebSocketServer } = require("ws");
const wssTetris = new WebSocketServer({port : 3002});

class RoomManager{
  constructor(){
    this.rooms = [[undefined, undefined]];
    this.playerRoomAndWs = {};
  }
  
  makeRoom(){
    this.rooms.push([undefined, undefined]);
  }

  assignPlayerToRoom(ws, nick){
    if(this.playerRoomAndWs[nick]) return this.playerRoomAndWs[nick].roomNum[0];
    for(let i=0; i<this.rooms.length; i++)
      for(let j=0; j<this.rooms[i].length; j++)
        if(this.rooms[i][j] == undefined){
          this.rooms[i][j] = nick;
          this.playerRoomAndWs[nick] = {roomNum : [i, j], ws : ws};
          console.log(i,j);
          return i;
        }
    this.makeRoom();
    return this.assignPlayerToRoom(ws, nick);
  }

  removePlayerToRoom(nick){
    try{
      const [i, j] = [...this.playerRoomAndWs[nick].roomNum];
      this.rooms[i][j] = undefined;
      delete this.playerRoomNum[nick];
    } catch {
      console.log('아직 방을 배정 받지 않은 사용자가 페이지를 나갔습니다.');
    }
  }  
}

const rm = new RoomManager();
// rm.makeRoom();
// rm.assignPlayerToRoom('웹소켓1', '하하1');
// rm.assignPlayerToRoom('웹소켓2', '하하2');
// rm.assignPlayerToRoom('웹소켓3', '하하3');
// rm.assignPlayerToRoom('웹소켓4', '하하4');
// console.log(rm.rooms, rm.playerRoomNum);
// rm.removePlayerToRoom('웹소켓1', '하하3');
// console.log(rm.rooms, rm.playerRoomNum);
// rm.assignPlayerToRoom('웹소켓6', '하하6');
// console.log(rm.rooms, rm.playerRoomNum);


const createShapesArr = () => {
  return new Array(100).fill().map(e=>randomShape());
}

const init = () => {
  wssTetris.shapesArr = createShapesArr();
}

init();

const functionByMsgCode = {
  'ready' : (wssTetris, ws, data) => {
    data.shapesArr = wssTetris.shapesArr;
    const roomNum  = rm.assignPlayerToRoom(ws, data.nick);
    console.log(rm.rooms);

    if( rm.rooms[roomNum][0] != undefined && rm.rooms[roomNum][1] != undefined){
      const [nick1, nick2] = [...rm.rooms[roomNum]];
      rm.playerRoomAndWs[nick1].ws.send(JSON.stringify({nick : nick2, code : 'readyEnemy', shapesArr : data.shapesArr})); 
      rm.playerRoomAndWs[nick2].ws.send(JSON.stringify({nick : nick1, code : 'readyEnemy', shapesArr : data.shapesArr})); 
      setTimeout(() => {
        try{
          rm.rooms[roomNum].map(nick => rm.playerRoomAndWs[nick].ws.send(JSON.stringify({ nick : nick , code : 'countDown'})))
        } catch {
          console.log("사용자가 방을 나갔습니다.");
        }
        }, 2000);
    }
  },   

  'attack' : (wssTetris, ws, data) => {
    data.content = new Array(data.content).fill().map(row => new Array(10).fill().map(e=>Math.floor(Math.random()*2)));
  },

  'direction' : (wssTetris, ws, data) => {},
  'end' : (wssTetris, ws, data) => {
    rm.removePlayerToRoom(data.nick);
    init();
  }
}

wssTetris.on("connection", (ws) =>{
  console.log(`연결되었습니다.`);
  console.log(wssTetris.clients.size);

  ws.on("close", () => {
    console.log("연결이 끊어졌습니다.");
  }) 

  ws.on("message", data =>{
    const dataJson = JSON.parse(data);
    console.log(dataJson, wssTetris.readyCnt);
    
    functionByMsgCode[dataJson.code](wssTetris, ws, dataJson);
    try {
      const roomNum  = rm.playerRoomAndWs[dataJson.nick].roomNum[0];
      rm.rooms[roomNum].map(nick => {
        if(nick) rm.playerRoomAndWs[nick].ws.send(JSON.stringify(dataJson))
      });
    } catch {
      console.log('아직 방을 배정 받지 않은 사용자가 메시지를 보내고 있음');
    }
  });
});  

exports.module = wssTetris;
