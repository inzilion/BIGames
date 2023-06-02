const randomShape = require("./shapes");
const { WebSocketServer } = require("ws");
const wss = require("./acidRain");
const wssTetris = new WebSocketServer({port : 3002});

const createShapesArr = () => {
  return new Array(100).fill().map(e=>randomShape());
}

wssTetris.shapesArr = createShapesArr();
wssTetris.executeCountDown = true;

const functionByMsgCode = {
  'ready' : (wssTetris, ws, data) => {
    data.shapesArr = wssTetris.shapesArr;
    if(wssTetris.clients.size === 2 && wssTetris.executeCountDown){
      wssTetris.executeCountDown = false;
      setTimeout(()=>{
        for(client of wssTetris.clients)
          client.send(JSON.stringify({code:'countDown'}));
      }, 3000);
    }
  },  
  'direction' : (wssTetris, ws, data) => {},
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

    console.log(dataJson);

    for(client of wssTetris.clients){
      client.send(JSON.stringify(dataJson));
    }
  });
});  

exports.module = wssTetris;