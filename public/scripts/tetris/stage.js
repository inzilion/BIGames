import Cell from './cell.js';
import { AIR, CELL_SIZE } from './global_variable.js';

class Stage {
  constructor(pos={x, y}, rows, cols){ 
    this.pos  = pos;
    this.rows   = rows;
    this.cols   = cols;
    this.cells = new Array(cols).fill().map(e=>new Array(rows).fill().map(e=>new Cell(CELL_SIZE, AIR)));
  }
  draw(ctx){
    this.cells.map((rows, i) => rows.map((cell, j) => cell.draw(ctx, {x : this.pos.x + j*cell.size , y : this.pos.y + i*cell.size})))
  }
  addRows(n){
    for(let i=0; i<n; i++)
      this.cells.unshift(new Array(this.rows).fill().map(e=>new Cell(CELL_SIZE, AIR)))
  }
}

export default Stage;