import Cell from './cell.js';
import { AIR, CELL_SIZE } from './global_variable.js';

class Stage {
  constructor(pos={x, y}, rows, cols){ 
    this.pos  = pos;
    this.rows   = rows;
    this.cols   = cols;
    this.cells = new Array(rows).fill().map(e=>new Array(cols).fill().map(e=>new Cell(CELL_SIZE, AIR)));
  }

  draw(ctx){
    this.cells.map((rows, i) => rows.map((cell, j) => cell.draw(ctx, {x : this.pos.x + j*cell.size , y : this.pos.y + i*cell.size})))
  }

  addRows(n){
    for(let i=0; i<n; i++)
      this.cells.unshift(new Array(this.cols).fill().map(e=>new Cell(CELL_SIZE, AIR)))
  }

  addPenaltyRows(rows){
    const penaltyRows = rows.map(row => row.map(e => {
      if(e) return new Cell(CELL_SIZE, '#f00');
      else  return new Cell(CELL_SIZE, AIR)
    }))
    penaltyRows.map(row => {
      this.cells.push(row);
      this.cells.shift();
    })
  }
}

export default Stage;