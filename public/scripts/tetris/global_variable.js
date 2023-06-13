export const AIR           = '#444';
export const CELL_SIZE     = 30;
export const CANVAS_WIDTH  = 1000;
export const CANVAS_HEIGHT = 700;
export const randomColor = () => {
  const HEX = '56789AB';
  let color = '#';
  for(let i=0; i<3; i++)
    color += HEX[Math.floor(Math.random() * HEX.length)];
  return color;
}
