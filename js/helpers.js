// Get the square number in which the number resides (In total, there are 9 dividing squares in the field)
function getSquare(col, row) {
  let verticalSquare = (Math.ceil(row / 3) - 1) * 3; // Row (use multiply), so minus 1 for correction.
  let horizontalSquare = Math.ceil(col / 3); // Column (use addition)

  return verticalSquare + horizontalSquare;
}

// Translate cell number to column, row and square number, where the number resides.
function getIndexInfo(location) {
  const column = (location + 1) % 9 == 0 ? 9 : (location + 1) % 9;
  const row = Math.ceil((location + 1) / 9);
  const square = getSquare(column, row);
  return [column, row, square];
}

// Get column and row based on location of the number.
function getColumnAndRowInfo(location) {
  const column = (location + 1) % 9 == 0 ? 9 : (location + 1) % 9;
  const row = Math.ceil((location + 1) / 9);
  return [column, row];
}

// Create the chromosome
function createGenes(counterFreeCells, freeCells) {
  let chromosome = [];
  // Create a copy of the array.
  let copyFreeCells = [...freeCells];
  // Iterate through every cell only once in random order.
  for (let i = 0; i < counterFreeCells; i++) {
    // Take a location.
    let location = copyFreeCells.splice(
      Math.floor(Math.random() * copyFreeCells.length),
      1
    );

    // Choose a number (between 1 and 9).
    let number = Math.floor(Math.random() * 9) + 1;

    // Assemble the gene.
    let gene = { prior: i, location: location[0], number: number };

    // Add to chromosome.
    chromosome.push(gene);
  }
  // Return created chromosome.
  return chromosome;
}
