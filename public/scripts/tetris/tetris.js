import Block from "./block.js";
import Stage from "./stage.js";
import { randomColor, AIR } from "./global_variable.js";

class Tetris {
  constructor(ctx, pos={x, y}){
    this.pos = pos;
    this.stage = new Stage(this.pos, 10, 20);
    this.block = null;
    this.shapesArr = null;
    this.shapesArrIdx = 0;
    this.ctx  = ctx;
    this.isAlive = false;
  }
  
  draw() {
    this.stage.draw(this.ctx);
    if(this.block)
      this.block.draw(this.ctx);
  }
  
  checkMadeLine(){
    // let lineCnt = 0;
    // this.stage.cells.map((rows, i) => {
    //   if(rows.filter(cell => cell.color==='AIR').length==0){
    //     console.log(i, this.stage.cells[i]);
    //     this.stage.cells.splice(i,1);
    //   }
    // })
    let removeLineNum = [];
    for (let i=0; i<this.stage.cols; i++){
      let sumOfAir = 0;
      for (let j=0; j<this.stage.rows; j++){
        if(this.stage.cells[i][j].color == AIR)
          sumOfAir++; 
      }
      if(sumOfAir == 0){ 
        removeLineNum.push(i)
        //this.stage.cells.splice(i--, 1);
        //console.log(this.stage.cells);
      }
    }
    removeLineNum = removeLineNum.map((e, i)=>e-i);
    removeLineNum.map(i => this.stage.cells.splice(i))
    this.stage.addRows(removeLineNum.length);
  }

  cantMoveBlock(originBlock, direction){
    const block = originBlock.clone();
    block.move[direction]();
    for(let i=0; i<block.shapes[block.currentShapeNum].length; i++){
      for(let j=0; j<block.shapes[block.currentShapeNum][i].length; j++){
        if(block.shapes[block.currentShapeNum][i][j] == undefined)              continue;
        if(block.coord.i+i<0 || block.coord.i+i>=this.stage.cols)               return true; 
        if(block.coord.j+j<0 || block.coord.j+j>=this.stage.rows)               return true;
        if(this.stage.cells[block.coord.i+i][block.coord.j+j].color !== '#444') return true;
      }
    }
    this.checkMadeLine();
    return false;
  }
  
  setBlockToTop(){
    this.block = new Block(this.shapesArr[this.shapesArrIdx++], randomColor(), {i:0, j:3}, this.pos);
    if(this.cantMoveBlock(this.block, 'ArrowDown'))
      this.isAlive = false;
  }
  
  ready(shapesArr){
    this.shapesArr = shapesArr;
    this.setBlockToTop();
    this.draw();
  }
  start(){
    this.isAlive = true;
    console.log('start');
    this.timer = setInterval(()=>{
      if(this.cantMoveBlock(this.block, 'ArrowDown')){
        this.block.die(this.stage);
        this.setBlockToTop();
      }
      else  
        this.block.move['ArrowDown']();
      this.draw();
    }, 1000)
  }
  end(){
    this.isAlive = false;
    clearInterval(this.timer);
  }
}

export default Tetris;
