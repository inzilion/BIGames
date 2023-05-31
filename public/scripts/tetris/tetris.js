import Stage from "./stage.js";
import Block from "./block.js";
import randomShape from "./shapes.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./global_variable.js";

const $div = document.querySelector("#tetris")
const $cvs = document.createElement("canvas");
$cvs.width = CANVAS_WIDTH;
$cvs.height = CANVAS_HEIGHT;
const ctx = $cvs.getContext('2d');
$div.appendChild($cvs);

class Tetris {
  constructor(pos={x, y}){
    this.pos = pos;
    this.stage = new Stage(this.pos, 10, 20);
    this.block = new Block(randomShape(), {i:3, j:0}, this.pos);
    this.cloneBlock = null;
  }
  draw(ctx) {
    this.stage.draw(ctx);
    this.block.draw(ctx);
  }
  copyCloneBlock(){
    return new Block(this.block.shapes, {...this.block.coord}, {...this.block.pos}, this.block.currentShapeNum);
  }
}

const t1 = new Tetris({x:50, y:0})
setInterval(() => {
  t1.draw(ctx);
}, 100);

// setInterval(() => {
//   t1.block.move('DOWN');
// }, 1000);

document.body.style.overflow = "hidden";

document.addEventListener('keydown', (e)=>{
  t1.cloneBlock = t1.copyCloneBlock();
  switch(e.key){
    case 'ArrowLeft'  : t1.cloneBlock.move('LEFT'); break;
    case 'ArrowRight' : t1.cloneBlock.move('RIGHT'); break;
    case 'ArrowDown'  : t1.cloneBlock.move('DOWN'); break;
    case 'ArrowUp'    : t1.cloneBlock.move('ROTATE'); break;
}
  if(t1.stage.canMoveBlock(t1.cloneBlock)){
    switch(e.key){
      case 'ArrowLeft'  : t1.block.move('LEFT'); break;
      case 'ArrowRight' : t1.block.move('RIGHT'); break;
      case 'ArrowDown'  : t1.block.move('DOWN'); break;
      case 'ArrowUp'    : t1.block.move('ROTATE'); break;
    }
  }
})
