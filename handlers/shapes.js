const SHAPES = {
  'I' : [
          [
            [1,1,1,1],
          ],
          [
            [0,1],
            [0,1],
            [0,1],
            [0,1]
          ],
        ],

  'O' : [
          [
            [1,1],
            [1,1],
          ]
        ],
  
  'L' : [ 
					[ 
            [1,0],
						[1,0],
						[1,1] 
          ],
					[ 
            [0,0,1],
						[1,1,1],
          ],
					[ 
            [1,1],
						[0,1],
						[0,1] 
          ], 					
					[ 
            [1,1,1],
						[1,0,0],
          ],
				],
	
  'J' : [ 
					[ 
            [0,1],
						[0,1],
						[1,1] 
          ],
					[ 
            [1,1,1],
						[0,0,1],
          ],
					[ 
            [1,1],
						[1,0],
						[1,0] 
          ], 					
					[ 
            [1,0,0],
						[1,1,1],
          ],
				],
	
  'T' : [ 
					[ 
            [1,1,1],
						[0,1,0],
          ],
					[ 
            [1,0],
						[1,1],
						[1,0] 
          ],
					[ 
            [0,0,0],
            [0,1,0],
						[1,1,1],
          ], 					
					[ 
            [0,0,1],
						[0,1,1],
						[0,0,1] 
          ],
				],      
  
  'S' : [ 
					[ 
            [1,0],
						[1,1],
						[0,1] 
          ],
					[ 
            [0,1,1],
						[1,1,0],
          ],
        ],
  
  'N' : [
					[ 
            [0,1],
						[1,1],
						[1,0] 
          ], 					
					[ 
            [1,1,0],
						[0,1,1],
          ],
				],      
}

const randomShape = () => SHAPES[Object.keys(SHAPES)[Math.floor(Math.random()*Object.keys(SHAPES).length)]];

module.exports = randomShape;