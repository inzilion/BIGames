import Cell from "./cell.js";
import { CELL_SIZE } from "./global_variable.js";

const randomColor = () => {
  const HEX = '56789AB';
  let color = '#';
  for(let i=0; i<3; i++)
    color += HEX[Math.floor(Math.random() * HEX.length)];
  return color;
}

class Block {
  constructor(shapes, coord={i, j}, pos={x, y}, num=0){
    this.coord = coord;
    this.pos = pos;
    this.currentShapeNum = num;
    this.color = randomColor();
    this.shapes = shapes.map(shape=>shape.map(row=>row.map(cell=>{if (cell) return new Cell(CELL_SIZE, this.color)})));
  }
  draw(ctx){
    this.shapes[this.currentShapeNum].map((row, j) => row.map((cell, i) => {
      if(cell) cell.draw(ctx, {x:this.pos.x+(this.coord.i+i)*cell.size, y:this.pos.y+(this.coord.j+j)*cell.size})}))
  }
  move(direction){
    switch(direction){
      case "LEFT"    : this.coord.i--; break;
      case "RIGHT"   : this.coord.i++; break;
      case "DOWN"    : this.coord.j++; break;
      case "ROTATE"  : this.currentShapeNum++; this.currentShapeNum %= this.shapes.length; break;
    }
  }
}

export default Block;
