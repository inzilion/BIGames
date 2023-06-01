const { WebSocketServer } = require("ws");
const wssTetris = new WebSocketServer({port : 3002});

const randomColor = () => {
  const HEX = '56789AB';
  let color = '#';
  for(let i=0; i<3; i++)
    color += HEX[Math.floor(Math.random() * HEX.length)];
  return color;
}


const functionByMsgCode = {
  'ready' : (wssTetris, ws, data) => { },
  'start' : (wssTetris, ws, data) => { },
  'direction' : (wssTetris, ws, data) => { },
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