// Project: "Maze"
// Create a console-based TypeScript game where the player navigates through a maze using the arrow keys until they reach the exit
// Maze should be hardcoded in the code (use 2D array)
// Make sure screen is readable to player, so console should be cleared after each move, to make it clear, where play is currently
// Maze should be at least 10x10 in size
// Make sure there is correct collision detection

import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SNAKE = [   // Initial snake position as array of [row, column] coordinates
  [1, 3],
  [1, 4],
  [1, 5]
];

type Direction = 'up' | 'down' | 'left' | 'right';  // Specifies definitions for valid movement directions


const DIRECTIONS = {
  up: [-1, 0],    // Move up decreases row index (row/column movement) --> In computer graphics, the y-axis is often inverted, with (0,0) at the top-left corner and positive y going downward.
  down: [1, 0],  // Move down increases row index (row/column movement)
  left: [0, -1], // Move left decreases column index (row/column movement)
  right: [0, 1]  // Move right increases column index (row/column movement)
} as const;


const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];



function moveSnake(direction: Direction): void {
  const [dx, dy] = DIRECTIONS[direction];
  for (let i = 0; i < SNAKE.length; i++) { // AI HELP: Loop through snake segments --> DIRECTIONS[direction] - It looks up the direction in a DIRECTIONS object to get the x and y coordinates for that direction. For example: 'up' might be [0, -1] (move up by decreasing y), 'right' might be [1, 0] (move right by increasing x)
    const [prevX, prevY] = SNAKE[i];
    const [newX, newY] = [prevX + dx, prevY + dy];

  // Out-of-bounds check
  if (newX < 0 || newX >= MAZE.length || newY < 0 || newY >= MAZE[0].length) {
    console.log('You hit the boundary! I guess you really need to understand how games work :(');
    rl.close();
    return;
  }    
    SNAKE[i] = [newX, newY];
    
    
    if (MAZE[newX][newY] === 2) { // AI HELP: Check for win condition (reached goal) --> MAZE[newX][newY] === 2 
      console.log('You win! I guess you are not a mere mortal');
      rl.close();
      return;
    }
   
    if (MAZE[newX][newY] === 1) {  // AI HELP: Check for collision with wall --> MAZE[newX][newY] === 1 
      console.log('You lose! I guess the tech gods did not like you :(, does anyone really? ');
      rl.close();
      return;
    }
  }
  console.clear();
  printMaze();
}


function printMaze(): void {
  for (let i = 0; i < MAZE.length; i++) {
    for (let j = 0; j < MAZE[i].length; j++) {
      if (SNAKE.find(([x, y]) => x === i && y === j)) {
        process.stdout.write('S'); // Snake segment
      } else {
        process.stdout.write(MAZE[i][j] === 1 ? 'X' : ' '); // Wall or empty    
      }
    }
    console.log(''); // New line after each row --> MAZE[i][j] === 1 
  }
}


printMaze();


rl.on('line', (input) => {
  const direction = input.trim().toLowerCase();
  if (direction === 'exit') {
    rl.close();
  } else if (['up', 'down', 'left', 'right'].includes(direction)) {
    moveSnake(direction as Direction);
  } else {
    console.log('Please check yourself before you wreck yourself by these: up, down, left, right, or exit...');
  }
}).on('close', () => {
  process.exit(0);
});
