function seed(a, b, c) {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  if (x === j & y === k) {
    return true;
  } else {
    return false;
  }
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some((value) => {
    return same(value, cell);
  });

}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = [[0, 0]]) => {

  let topRightX = state[0][0];
  let topRightY = state[0][1];
  let bottomLeftX = state[0][0];
  let bottomLeftY = state[0][1];

  for (let liveCell of state) {

    topRightX = Math.max(topRightX, liveCell[0]);
    topRightY = Math.max(topRightY, liveCell[1]);
    bottomLeftX = Math.min(bottomLeftX, liveCell[0]);
    bottomLeftY = Math.min(bottomLeftY, liveCell[1]);

  }

  return { topRight: [topRightX, topRightY], bottomLeft: [bottomLeftX, bottomLeftY] };

};

const printCells = (state) => {
  let cornerCells = corners(state);
  let stateString = "";

  for (let i = cornerCells.topRight[1]; i >= cornerCells.bottomLeft[1]; i--) {
    for (let j = cornerCells.bottomLeft[0]; j <= cornerCells.topRight[0]; j++) {
      stateString += printCell([j, i], state);
      stateString += " ";
    }
    stateString += "\n";
  }

  return stateString;

};

const getNeighborsOf = ([x, y]) => {

  let neighbours = [];

  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      neighbours.push([i, j]);
    }
  }

  neighbours.splice(4, 1);

  return neighbours;

};

const getLivingNeighbors = (cell, state) => {

  let neighbours = getNeighborsOf(cell);

  let containsBound = contains.bind(state);

  let livingCells = [];

  neighbours.forEach((cell) => {
    if (containsBound(cell)) {
      livingCells.push(cell);
    }
  });

  return livingCells;
};

//  The function has two parameters. The first is a cell (the corresponding argument, for example, would be of the form [x,y]),
//   and the second is a game state (array of cells). A cell is alive in the next game state if and only if:

//     the cell has three living neighbors, or,
//     the cell is currently alive and has two living neighbors

// Use the function getLivingNeighbors completed previously to determine how many living neighbors the cell currently has.
//  Use the function contains completed previously to determine if the cell is currently alive. 
//  Invoke the contains function by using its call method to supply the current game state as the this value within contains and call the function.


const willBeAlive = (cell, state) => {

  let willBeAlive = false;

  let numLivingNeighbours = getLivingNeighbors(cell, state).length;

  if ((numLivingNeighbours == 3) || (numLivingNeighbours == 2 && contains.call(state, cell))) {
    willBeAlive = true;
  };

  return willBeAlive;

};

// Complete the function calculateNext that calculates the next state of the game from the current state of the game. 
// The function has a single parameter state that is an array containing all living cells (the current game state). 
// The function should return an array containing all living cells in the next game state.

// Use the corners function previously completed to establish the extent of the grid to be tested for the next game state.
//  Be sure to extend the search space by one row or column in each direction. 
//  For example if bottomLeft is [2,2] and topRight is [4,4] then the grid to test for the next game state is from [1,1] to [5,5].
//  Use the previously completed function willBeAlive to determine if a cell will be alive in the next game state.
const calculateNext = (state) => {

  let cornerCells = corners(state);
  let nextState = [];

  for (let i = cornerCells.topRight[1] + 1; i >= cornerCells.bottomLeft[1] - 1; i--) {
    for (let j = cornerCells.bottomLeft[0] - 1; j <= cornerCells.topRight[0] + 1; j++) {
      if (willBeAlive([i, j], state)) {
        nextState.push([i, j]);
      }
    }
  }

  return nextState;

 };

// Complete the function iterate that calculates new game states, based on a starting game state. 
// The function has two parameters. The first parameter is a game state, that is, an array of living cells. 
// The second parameter is an integer indicating how many new game states to calculate. The function should return an array of games states.

// For example, if iterate is called with a starting game state in the first parameter and the value 2 for the second parameter 
// it will return an array with three game states, the starting game state and two more that were calculated.

// The next game state can be calculated by using the calculateNext function previously completed, based upon the most recent game state.
const iterate = (state, iterations) => { 

  let gameStates = [state];

  for (let i =  0; i < iterations; i++){
    gameStates.push(calculateNext(gameStates[i]))
  };

  return gameStates;
};

// Complete the function main that calculates a given number of future states from a given starting states and prints 
// them all to the console (including the initial state). The function has two parameters. 
// The first parameter is a string containing the name of one of the game states in the startPatterns object, that is: rpentomino, glider or square.
//  The second parameter is an integer indicating how many new game states to calculate. 
//  Each game state should be printed with a trailing new line character.

// For example, main("rpentomino", 2) will print to the console:

// ▢ ▣ ▣
// ▣ ▣ ▢
// ▢ ▣ ▢

// ▣ ▣ ▣
// ▣ ▢ ▢
// ▣ ▣ ▢

// ▢ ▢ ▣ ▢
// ▢ ▣ ▣ ▢
// ▣ ▢ ▢ ▣
// ▢ ▣ ▣ ▢

// Use the iterate function completed previously to calculate new game states
const main = (pattern, iterations) => { 

  let startPattern = startPatterns[pattern];

  let gameStates = iterate(startPattern, iterations);

  gameStates.forEach(state => {
    printedState = printCells(state);
    console.log(printedState, "\n");
  })

};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;