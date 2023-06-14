import Block from "./block.js";
import Stage from "./stage.js";
import { randomColor, AIR } from "./global_variable.js";

class Tetris {
  constructor(nick, ctx, pos={x, y}){
    this.nick = nick;
    this.pos = pos;
    this.stage = new Stage(this.pos, 20, 10);
    this.block = null;
    this.shapesArr = null;
    this.shapesArrIdx = 0;
    this.ctx  = ctx;
    this.isAlive = false;
    this.msg = null;
  }
  draw() {
    this.stage.draw(this.ctx);
    if(this.block)
      this.block.draw(this.ctx);
    this.ctx.font = "bold 42px Arial, sans-serif";
    this.ctx.fillStyle = '#ddd';
    this.ctx.fillText(this.nick , this.pos.x+100 , this.pos.y-10);
  }
  
  cantMoveBlock(originBlock, direction){
    const block = originBlock.clone();
    block.move[direction]();
    for(let i=0; i<block.shapes[block.currentShapeNum].length; i++){
      for(let j=0; j<block.shapes[block.currentShapeNum][i].length; j++){
        if(block.shapes[block.currentShapeNum][i][j] == undefined)           continue;
        if(block.coord.i+i<0 || block.coord.i+i>=this.stage.rows)            return true; 
        if(block.coord.j+j<0 || block.coord.j+j>=this.stage.cols)            return true; 
        if(this.stage.cells[block.coord.i+i][block.coord.j+j].color !== AIR) return true; 
      }
    }
    return false;
  }
  
  setBlockToTop(){
    this.block = new Block(this.shapesArr[this.shapesArrIdx++], randomColor(), {i:0, j:3}, this.pos);
    if(this.cantMoveBlock(this.block, 'Down'))
      this.isAlive = false;
  }

  checkMadeLine(){
    let removeLineNum = [];
    for (let i=0; i<this.stage.rows; i++){
      let sumOfAir = 0;
      for (let j=0; j<this.stage.cols; j++)
        if(this.stage.cells[i][j].color == AIR) sumOfAir++; 
      if(sumOfAir == 0)  removeLineNum.push(i)
    }
    
    if (removeLineNum.length == 0) return;
    
    removeLineNum = removeLineNum.map((e, i)=>e-i);
    removeLineNum.map(e => this.stage.cells.splice(e, 1))
    this.stage.addRows(removeLineNum.length);
    if (removeLineNum.length >=2) this.msg = removeLineNum.length;
  }

  ready(shapesArr){
    this.shapesArr = shapesArr;
    this.setBlockToTop();
    this.draw();
  }
  
  start(){
    this.isAlive = true;
    this.timer = setInterval(()=>{
      if(this.cantMoveBlock(this.block, 'Down')){
        this.block.die(this.stage);
        this.block = null; 
        this.checkMadeLine();
        this.setBlockToTop();
      }
      else  
        this.block.move['Down']();
      this.draw();
    }, 1000)
  }
  
  end(){
    this.isAlive = false;
    clearInterval(this.timer);
  }
  
  showResult(text, color){
    this.ctx.font = "bold 70px Arial, sans-serif";
    this.ctx.fillStyle = color;
    this.ctx.fillText(text , this.pos.x+80 , this.pos.y+300);
  }
  
  win(){
    this.showResult('Win', '#fff');
  }
  
  lose(){
    this.showResult('Lose', '#000');
  }
}

export default Tetris;
