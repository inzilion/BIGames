import Cell from './cell.js';
import { CELL_SIZE } from './global_variable.js';

class Stage {
  constructor(pos={x, y}, rows, cols){ 
    this.pos  = pos;
    this.rows   = rows;
    this.cols   = cols;
    this.cells = new Array(cols).fill().map(e=>new Array(rows).fill().map(e=>new Cell(CELL_SIZE, '#444')));
  }
  draw(ctx){
    this.cells.map((rows, j) => rows.map((cell, i) => cell.draw(ctx, {x : this.pos.x + i*cell.size , y : this.pos.y + j*cell.size})))
  }
  canMoveBlock(block){
    let result = true;
    
    for(let j=0; j<block.shapes[block.currentShapeNum].length; j++){
      for(let i=0; i<block.shapes[block.currentShapeNum][j].length; i++){
        if(block.shapes[block.currentShapeNum][j][i] == undefined) continue;
        if(block.coord.i+i<0 || block.coord.i+i>=this.rows || block.coord.j+j<0 || block.coord.j+j>=this.cols)
          result = false;
        console.log(block.coord.i+i, block.coord.j+j);
      }
    }
    return result;
  }

}

export default Stage;