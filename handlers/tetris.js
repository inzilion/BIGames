const randomShape = require("./shapes");
const { WebSocketServer } = require("ws");
const wss = require("./acidRain");
//const wss = require("./acidRain");
const wssTetris = new WebSocketServer({port : 3002});

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
    if(wssTetris.readyCnt >= 2){
      setTimeout(()=>{
        for(client of wssTetris.clients)
          client.send(JSON.stringify({code:'countDown'}));
      }, 3000);
    }
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