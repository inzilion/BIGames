import Cell from "./cell.js";
import { CELL_SIZE } from "./global_variable.js";

class Block {
  constructor(shapes, color, coord={i, j}, pos={x, y}, num=0){
    this.shapes = shapes.map(shape=>shape.map(row=>row.map(cell=>{if (cell) return new Cell(CELL_SIZE, color)})));
    this.color = color;
    this.coord = coord;
    this.pos = pos;
    this.currentShapeNum = num;
    this.move = {
      'ArrowLeft'  : () => {this.coord.i--;},
      'ArrowRight' : () => {this.coord.i++;},
      'ArrowDown'  : () => {this.coord.j++;},
      'ArrowUp'    : () => {this.currentShapeNum++; 
                            this.currentShapeNum %= this.shapes.length;},
    }
  }
  draw(ctx){
    this.shapes[this.currentShapeNum].map((row, j) => row.map((cell, i) => {
      if(cell) cell.draw(ctx, {x:this.pos.x+(this.coord.i+i)*cell.size, y:this.pos.y+(this.coord.j+j)*cell.size})}))
  }
  die(stage){
    this.shapes[this.currentShapeNum].map((rows, j) => rows.map((cell, i)=>{ 
      if(cell)
        stage.cells[this.coord.j+j][this.coord.i+i].color = cell.color;
    }))
  }
  clone(){
    return new Block(this.shapes, this.color, {...this.coord}, {...this.pos}, this.currentShapeNum);
  }
}

export default Block;
