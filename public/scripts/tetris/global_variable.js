import Block from "./block.js";
export const CELL_SIZE     = 30;
export const CANVAS_WIDTH  = 1000;
export const CANVAS_HEIGHT = 600;
export const randomColor = () => {
  const HEX = '56789AB';
  let color = '#';
  for(let i=0; i<3; i++)
    color += HEX[Math.floor(Math.random() * HEX.length)];
  return color;
}

//export const copyBlock = (block) => new Block(block.shapes, block.color, {...block.coord}, {...block.pos}, block.currentShapeNum);
