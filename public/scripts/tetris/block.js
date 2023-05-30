import Cell from "./cell.js";
import { CELL_SIZE } from "./global_variable.js";

const randomColor = () => {
  const HEX = '456789A';
  let color = '#';
  for(let i=0; i<3; i++)
    color += HEX[Math.floor(Math.random() * HEX.length)];
  return color;
}

class Block {
  constructor(shapes, coord={i, j}, pos={x, y}){
    this.coord = coord;
    this.pos = pos;
    this.currentShapeNum = 0;
    this.color = randomColor();
    this.shapes = shapes.map(shape=>shape.map(row=>row.map(cell=>{if (cell) return new Cell(CELL_SIZE, this.color)})));
  }
  draw(ctx){
    this.shapes[this.currentShapeNum].map((row, j) => row.map((cell, i) => {
      if(cell) cell.draw(ctx, {x:this.pos.x+(this.coord.i+i)*cell.size, y:this.pos.y+(this.coord.j+j)*cell.size})}))
  }
}

export default Block;
