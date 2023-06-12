import Block from "./block.js";
import Stage from "./stage.js";
import { randomColor, copyBlock } from "./global_variable.js";

class Tetris {
  constructor(ctx, pos={x, y}){
    this.pos = pos;
    this.stage = new Stage(this.pos, 10, 20);
    this.block = null;
    this.shapesArr = null;
    this.shapesArrIdx = 0;
    this.ctx  = ctx;
  }
  draw() {
    this.stage.draw(this.ctx);
    if(this.block)
      this.block.draw(this.ctx);
  }
  setBlockToTop(){
    this.block = new Block(this.shapesArr[this.shapesArrIdx++], randomColor(), {i:3, j:0}, this.pos);
  }
  ready(shapesArr){
    this.shapesArr = shapesArr;
    this.setBlockToTop();
    this.draw();
  }
  start(){
    setInterval(()=>{
      let cloneBlock = copyBlock(this.block);
      cloneBlock.move['ArrowDown']();
      if(this.stage.cantMoveBlock(cloneBlock)){
        this.block.die(this.stage);
        this.setBlockToTop();
      }
      else 
        this.block.move['ArrowDown']();
      this.draw();
    }, 1000)
  }
}

export default Tetris;
