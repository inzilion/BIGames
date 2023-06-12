import Block from "./block.js";
import Stage from "./stage.js";
import { randomColor } from "./global_variable.js";

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
  cantMoveBlock(originBlock, direction){
    const block = originBlock.clone();
    block.move[direction]();
    for(let j=0; j<block.shapes[block.currentShapeNum].length; j++){
      for(let i=0; i<block.shapes[block.currentShapeNum][j].length; i++){
        if(block.shapes[block.currentShapeNum][j][i] == undefined)        continue;
        if(block.coord.i+i<0 || block.coord.i+i>=this.stage.rows)               return true; 
        if(block.coord.j+j<0 || block.coord.j+j>=this.stage.cols)               return true;
        if(this.stage.cells[block.coord.j+j][block.coord.i+i].color !== '#444') return true;
      }
    }
    return false;
  }
  setBlockToTop(){
    this.block = new Block(this.shapesArr[this.shapesArrIdx++], randomColor(), {i:3, j:0}, this.pos);
    if(this.cantMoveBlock(this.block, 'ArrowDown'))
      this.end();
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
