const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({port : 3001});

const data1 = ["김","박","신","이", "가", "조", "전", "정","지", "장", "표", "남", "문", "윤", "최", "강"];
const data2 = ["한","희","동","정", "성", "원", "강", "혜","다", "준", "선", "휘", "세", "진", "태", '재'];
const data3 = ["별","진","민","찬", "필", "재", "빈", "찬","빈", "혁", "호", "성", "빈", "영", "균", '현'];

const randomWord = () => {
  let a = Math.floor(Math.random()*data1.length);
  let b = Math.floor(Math.random()*data1.length);
  let c = Math.floor(Math.random()*data1.length);
  return data1[a] + data2[b] + data3[c];
}

wss.on("connection", ws =>{
  console.log(`연결되었습니다.`);
  console.log(wss.clients.size);

  setInterval(() => {
    let randWord = { word : randomWord()};
    console.log(randWord);
    ws.send(JSON.stringify(randWord));
  }, 1000);

  ws.on("message", data =>{
    ws.room = JSON.parse(data).room;
    for(client of wss.clients){
      if(ws.room === client.room)
        client.send(data.toString());
    }
  });
});  

module.exports = wss;