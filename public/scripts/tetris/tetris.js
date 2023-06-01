import Block from "./block.js";
import Stage from "./stage.js";
import randomShape from "./shapes.js";

class Tetris {
  constructor(pos={x, y}){
    this.pos = pos;
    this.stage = new Stage(this.pos, 10, 20);
    this.block = new Block(randomShape(), {i:3, j:0}, this.pos);
  }
  draw(ctx) {
    this.stage.draw(ctx);
    this.block.draw(ctx);
  }
}

export default Tetris;
