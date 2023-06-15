const randomShape = require("./shapes");
const { WebSocketServer } = require("ws");
const wssTetris = new WebSocketServer({port : 3002});

class RoomManager{
  constructor(){
    this.rooms = [[undefined, undefined]];
    this.playerRoomNum = {};
  }
  
  makeRoom(){
    this.rooms.push([undefined, undefined]);
  }

  assignPlayerToRoom(ws, nick){
    for(let i=0; i<this.rooms.length; i++)
      for(let j=0; j<this.rooms[i].length; j++)
        if(this.rooms[i][j] == undefined){
          this.rooms[i][j] = ws;
          this.playerRoomNum[nick] = [i,j];
          return;
        }
    this.makeRoom();
    this.assignPlayerToRoom(ws, nick);
  }
  
  removePlayerToRoom(ws, nick){
    const [i, j] = [...this.playerRoomNum[nick]];
    this.rooms[i][j] = undefined;
    delete this.playerRoomNum[nick];
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
  wssTetris.readyCnt = 0;
}

init();

const functionByMsgCode = {
  'ready' : (wssTetris, ws, data) => {
    data.shapesArr = wssTetris.shapesArr;
    wssTetris.readyCnt++;
    rm.assignPlayerToRoom(ws, data.nick);
    rm.rooms[rm.playerRoomNum[data.nick][0]].includes(undefined);
  
  },  

  'attack' : (wssTetris, ws, data) => {
    data.content = new Array(data.content).fill().map(row => new Array(10).fill().map(e=>Math.floor(Math.random()*2)));
  },

  'direction' : (wssTetris, ws, data) => {},
  'end' : (wssTetris, ws, data) => init(),
}

wssTetris.on("connection", (ws) =>{
  console.log(`연결되었습니다.`);
  console.log(wssTetris.clients.size);

  ws.on("close", () => {
    console.log("연결이 끊어졌습니다.");
  }) 

  ws.on("message", data =>{
    const dataJson = JSON.parse(data);
    
    functionByMsgCode[dataJson.code](wssTetris, ws, dataJson);

    console.log(dataJson, wssTetris.readyCnt);

    for(client of wssTetris.clients){
      client.send(JSON.stringify(dataJson));
    }
  });
});  

exports.module = wssTetris;
