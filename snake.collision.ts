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

const SNAKE = [   //Initial snake position as array of [row, column] coordinates, starts at [1, 3] and spans to [1, 5] in the maze
  [1, 3],
  [1, 4],
  [1, 5]
];

const DIRECTIONS = {
  up: [-1, 0],     // Up arrow --> Moves one row up (decreases row index) --> Is -1 as in 2D arrays, the indexing works that -1 means moving to a smaller row number 
  down: [1, 0],   // Down arrow
  right: [0, 1],  // Right arrow
  left: [0, -1]   // Left arrow
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

function moveSnake(direction: keyof typeof DIRECTIONS): void {
  const [dx, dy] = DIRECTIONS[direction];
  const [headX, headY] = SNAKE[0];
  const newHeadX = headX + dx;
  const newHeadY = headY + dy;

  
  if (MAZE[newHeadX]?.[newHeadY] === 2) { // Check for win condition to escape! (Reached the end of the maze)
    console.log('Congratulations! You won, the tech gods respect you a little bit, not sure about the mortals though!');
    process.exit(0);
  }

  // This checks for collisions with walls or boundaries, the collision detection part of the task set
  if (
    newHeadX < 0 ||
    newHeadX >= MAZE.length ||
    newHeadY < 0 ||
    newHeadY >= MAZE[0].length ||
    MAZE[newHeadX][newHeadY] === 1
  ) {
    console.log('Game Over! You hit a wall, check yourself real hard before you wreck yourself :(');
    process.exit(0);
  }

  // AI HELP: This checks for self-collision (verifies if the new head position overlaps with any part of the snake's body) --> Index 0 is skipped for current head when checking for collisions
  if (SNAKE.some(([x, y], index) => index > 0 && x === newHeadX && y === newHeadY)) {
    console.log('Game Over! You hit yourself, clumsy oafs do not do well here :(');
    process.exit(0);
  }

  // This adds the new head to the snake
  SNAKE.unshift([newHeadX, newHeadY]);

  // This clears the console and redraws the maze
  console.clear();
  printMaze();
}

function printMaze(): void {
  for (let i = 0; i < MAZE.length; i++) {
    for (let j = 0; j < MAZE[i].length; j++) {
      if (SNAKE.find(([x, y]) => x === i && y === j)) {
        process.stdout.write('S'); // Snake segment of maze to identify it
      } else {
        process.stdout.write(MAZE[i][j] === 1 ? 'X' : ' '); // Wall or empty to help movements
      }
    }
    console.log(''); // New line after each row --> MAZE[i][j] === 1 
  }
}

readline.emitKeypressEvents(process.stdin); // AI HELP: This sets up arrow key input
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

console.clear();
printMaze();
console.log('Use arrow keys to move, as this is what the tech gods approve of. Press q or type sucker to quit.');

process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit(0);
  }
  
  //  This maps arrow key names to the direction names programmed above --> This is to allow arrow key input
  const directionMap: {[key: string]: keyof typeof DIRECTIONS} = {
    'up': 'up',
    'down': 'down',
    'right': 'right',
    'left': 'left'
  };

  const direction = directionMap[key.name as keyof typeof directionMap];
  if (direction) {
    moveSnake(direction);
  } else if (key.name === 'sucker' || key.name === 'q') {
    process.exit(0);
  }
});
