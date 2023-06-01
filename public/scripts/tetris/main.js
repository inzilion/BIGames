import Block from "./block.js";
import Tetris from "./tetris.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./global_variable.js";

const $div = document.querySelector("#tetris")
const $cvs = document.createElement("canvas");
$cvs.width = CANVAS_WIDTH;
$cvs.height = CANVAS_HEIGHT;
const ctx = $cvs.getContext('2d');
$div.appendChild($cvs);

const copyBlock = (block) => new Block(block.shapes, {...block.coord}, {...block.pos}, block.currentShapeNum);

const t1 = new Tetris({x:50, y:0})
setInterval(() => {
  t1.draw(ctx);
}, 100);

// setInterval(() => {
//   t1.block.move('DOWN');
// }, 1000);

document.body.style.overflow = "hidden";

document.addEventListener('keydown', (e)=>{
  const cloneBlock = copyBlock(t1.block);

  cloneBlock.move[e.key]();

  if(t1.stage.cantMoveBlock(cloneBlock)) return;

  t1.block.move[e.key]();
})
