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
      'ArrowLeft'  : () => {this.coord.j--;},
      'ArrowRight' : () => {this.coord.j++;},
      'ArrowDown'  : () => {this.coord.i++;},
      'Down'       : () => {this.coord.i++;},
      'ArrowUp'    : () => {this.currentShapeNum++; 
                            this.currentShapeNum %= this.shapes.length;},
    }
  }
  draw(ctx){
    this.shapes[this.currentShapeNum].map((row, i) => row.map((cell, j) => {
      if(cell) cell.draw(ctx, {x:this.pos.x+(this.coord.j+j)*cell.size, y:this.pos.y+(this.coord.i+i)*cell.size})}))
  }
  die(stage){
    this.shapes[this.currentShapeNum].map((rows, i) => rows.map((cell, j)=>{ 
      if(cell)
        try{
          stage.cells[this.coord.i+i][this.coord.j+j].color = cell.color;
        } catch {
          console.log('die error');
        }
    }))
  }
  clone(){
    return new Block(this.shapes, this.color, {...this.coord}, {...this.pos}, this.currentShapeNum);
  }
}

export default Block;
