const randomShape = require("./shapes");
const { WebSocketServer } = require("ws");
const wssTetris = new WebSocketServer({port : 3002});

const createShapesArr = () => {
  return new Array(100).fill().map(e=>randomShape());
}

const init = () => {
  wssTetris.shapesArr = createShapesArr();
  wssTetris.readyCnt = 0;
}

const room = new Array(10).fill(new Array(2).fill(undefined));
console.log(room);

init();

const functionByMsgCode = {
  'ready' : (wssTetris, ws, data) => {
    data.shapesArr = wssTetris.shapesArr;
    wssTetris.readyCnt++;
    if(wssTetris.readyCnt >= 2){
      setTimeout(()=>{
        for(client of wssTetris.clients)
          client.send(JSON.stringify({code:'countDown'}));
      }, 3000);
    }
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