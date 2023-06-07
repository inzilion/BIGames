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
    this.stage.blockDown(this.block, this);
  }
}

export default Tetris;
