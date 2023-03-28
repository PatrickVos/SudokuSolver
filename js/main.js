const finishButton = document.querySelector(".finish");
const cells = document.querySelectorAll(".cell");
const readyButton = document.querySelector("#ready");
const generationCounter = document.querySelector(".generation");
const minScoreCounter = document.querySelector(".minimumScore");
const maxScoreCounter = document.querySelector(".maximumScore");

// Variables
const regex = new RegExp("^([1-9])$");
let freeCells = [];
let counterFreeCells = 0;
let lookupTable = Array(9).fill(0);
let population;
let counter = 1;
let speedcounter = 990;

// Adjust play speed
let slider = document.querySelector(".speedrange");
let output = document.querySelector(".speed");
output.innerHTML = slider.value;

// Listener for speed adjustments
slider.oninput = function () {
  output.innerHTML = this.value;
  speedcounter = this.value;
};

// Places already filled in.
cells[0].value = 6;
cells[4].value = 2;
cells[5].value = 9;
cells[10].value = 8;
cells[17].value = 3;
cells[18].value = 9;
cells[21].value = 8;
cells[22].value = 5;
cells[27].value = 2;
cells[28].value = 9;
cells[29].value = 4;
cells[31].value = 8;
cells[34].value = 5;
cells[40].value = 9;
cells[45].value = 8;
cells[49].value = 6;
cells[51].value = 3;
cells[53].value = 7;
cells[54].value = 3;
cells[60].value = 4;
cells[61].value = 8;
cells[63].value = 5;
cells[67].value = 7;
cells[68].value = 2;
cells[73].value = 6;
cells[75].value = 5;

// Check if index is valid (distinct value as in 'conform rules') in order to append item to list.
// This lookup table acts like a hash table when checking.
function addTolookupTable(memoryObject, [column, row, square], isValid) {
  if (memoryObject == 0) {
    memoryObject = { column: [column], row: [row], square: [square] }; // LookupTable starts at 0, but gene.number does not.
  } else {
    // Search the arrays for an equal number in the object (e.g. iterating over the columns)
    for (let i = 0; i < memoryObject.column.length; i++) {
      if (
        memoryObject.column[i] == column ||
        memoryObject.row[i] == row ||
        memoryObject.square[i] == square
      ) {
        isValid = false;
        console.log("clash!");
        break;
      }
    }
    // Add it, if nothing else is wrong.
    if (isValid) {
      memoryObject.column.push(column);
      memoryObject.row.push(row);
      memoryObject.square.push(square);
    }
  }
  return [memoryObject, isValid];
}

// Check if the number is in accordance with sudoku rules
// If so, add it to the lookupTable.
function checkValidity(gene, lookupTable) {
  // Apply rules: check left, right, below, above or in block.
  let isValid = true;
  const [column, row, square] = getIndexInfo(gene.location);
  [lookupTable[gene.number - 1], isValid] = addTolookupTable(
    lookupTable[gene.number - 1],
    [column, row, square],
    isValid
  );

  return isValid;
}

// Pauses the script for an amount of time in milliseconds.
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function clearArea(chromosome, index) {
  // Clear the red color, before deleting it.
  cells[chromosome[index].location].style.background = "";

  // Delete all placed numbers in reversed direction.
  for (let i = index; i > -1; i--) {
    cells[chromosome[i].location].value = "";
  }

  // Clear the color of the number.
  document.querySelectorAll(".box")[
    chromosome[index].number - 1
  ].style.background = "white";
}

// Write down the number on the playing field
async function writeDown(chromosome, lookupTable) {
  // Copy of the lookupTable, so edits to the copy don't harm the standard existing numbers in the original lookupTable.
  let copyLookupTable = JSON.parse(JSON.stringify(lookupTable));
  let iterationCounter = 0;
  for (let i = 0; i < chromosome.length; i++) {
    // Select a number.
    document.querySelectorAll(".box")[
      chromosome[i].number - 1
    ].style.background = "#FFFF00";
    await delay(1);

    // Fill in a number
    cells[chromosome[i].location].value = chromosome[i].number;

    // Check validation
    if (!checkValidity(chromosome[i], copyLookupTable)) {
      cells[chromosome[i].location].style.background = "red";
      // Wait for a delay of what is in 'speedcounter' variable.
      await delay(speedcounter);
      readyButton.disabled = false;
      clearArea(chromosome, i);
      break;
    }
    iterationCounter++;

    document.querySelectorAll(".box")[
      chromosome[i].number - 1
    ].style.background = "white";

    // Wait with a delay of 0.3s.
    await delay(300);
  }
  return iterationCounter;
}

async function repeatProcesPopulation(lookupTable, chromosomes) {
  let iterations = [];
  for (let i = 0; i < chromosomes.length; i++) {
    const iterationCounter = await writeDown(chromosomes[i], lookupTable);
    iterations.push(iterationCounter);
  }

  let solutions = population.evaluate(
    iterations,
    population.members,
    counterFreeCells
  );
  population.createNextGeneration(100, solutions, counterFreeCells);
}

// Event listener for 'Done' button
finishButton.addEventListener("click", () => {
  let indexCell = 0;
  counterFreeCells = 0;
  freeCells = [];

  cells.forEach((cell) => {
    // Check if a number exists at this place.
    if (regex.test(cell.value)) {
      cell.style.fontWeight = "900";
      const [column, row, square] = getIndexInfo(indexCell);
      let isValid = true;
      [lookupTable[cell.value - 1], isValid] = addTolookupTable(
        lookupTable[parseInt(cell.value) - 1],
        [column, row, square],
        isValid
      );
    } else {
      // Save the places where there is no number filled in and increment the counter to keep track of the amount.
      freeCells.push(indexCell);
      counterFreeCells++;
    }
    cell.disabled = true;
    indexCell++;
  });
  readyButton.disabled = false;

  population = new Population(freeCells, 100);
  generationCounter.innerHTML = "generation: " + counter;
});

readyButton.addEventListener("click", () => {
  generationCounter.innerHTML = "generation: " + String(counter);
  repeatProcesPopulation(lookupTable, population.members);
  counter++;
});
