class Population {
  constructor(freeCells, number) {
    this.optimalSolutionScore = 0; // Criterion for recruiting the optimal solutions.
    this.optimalMembers = []; // Best solutions encoded.
    this.optimalSolutionValues = []; // Associated values of the best encoded solutions.
    this.members = []; // Members of the population.
    this.minimumSolutionValue = 0;

    // Make the chromosome.
    for (let i = 0; i < number; i++) {
      let chromosome = createGenes(freeCells.length, freeCells);
      this.members.push(chromosome);
    }
  }

  // Compare two chromosomes and stop at point of failure.
  checkSequence(chromosomeOne, chromosomeTwo, limit) {
    for (let i = 0; i < limit; i++) {
      if (
        chromosomeOne[i].location == chromosomeTwo[i].location &&
        chromosomeOne[i].number == chromosomeTwo[i].number
      ) {
        return false;
      }
    }
    return true;
  }

  // Decide what to do with the chomosomes based on the results.
  evaluate(iterations, chromosomes, counterFreeCells) {
    let solutions = [];
    let minimums = [];

    for (let i = 0; i < iterations.length; i++) {
      // Setup a minimum, to force progression in next generation.
      if (iterations[i] > this.minimumSolutionValue) {
        // save score
        minimums.push(iterations[i]);
        // Save the solution that satisfies the minimum solution value boundary.
        solutions.push({
          chromosome: chromosomes[i],
          iterations: iterations[i],
        });

        // Save all most optimal distinct solutions at the end.
        if (
          iterations[i] > this.optimalSolutionScore &&
          this.optimalSolutionScore == counterFreeCells - 1
        ) {
          this.optimalSolutionScore = iterations[i];
          this.optimalSolutionValues.push(iterations[i]);
          this.optimalMembers.push(chromosomes[i]);
        } else if (iterations[i] === this.optimalSolutionScore) {
          let uniqueMember = true;
          this.optimalMembers.forEach((optimalMember) => {
            if (
              !this.checkSequence(chromosomes[i], optimalMember, iterations[i])
            ) {
              uniqueMember = false;
            }
          });

          // Add if unique in encoding
          if (uniqueMember) {
            this.optimalMembers.push(this.members[i]);
            this.optimalSolutionValues.push(iterations[i]);
          }
        }
        // Log result to the console.
        console.log("optimal member: ", this.members[i]);
      }
    }

    // Pushes the boundary of a minimum score a solution must have.
    this.minimumSolutionValue = Math.min(...minimums);
    minScoreCounter.innerHTML =
      "min. score: " + String(this.minimumSolutionValue);
    maxScoreCounter.innerHTML = "max. score: " + String(Math.max(...minimums));
    return solutions;
  }

  // Create next generation of population.
  createNextGeneration(amountPopulation, solutions, counterFreeCells) {
    if (solutions.length !== 0) {
      // Save all new members to this array.
      let nextpool = [];

      // A counter in order to ensure that every solution has been processed.
      let solutionCounter = 0;

      // itereer over alle solutions opnieuw en opnieuw totdat er niet meer toegevoegd kan worden.
      while (nextpool.length < amountPopulation) {
        // pak een willeukeurige chromosome.
        const randomIndex = Math.floor(Math.random() * solutions.length);

        // Pick a solution from all the solutions
        let solution = solutions[solutionCounter];

        // Pick a second random member from the population
        let randomSolution = solutions[randomIndex];

        // First part of chromosome goes to the first parent.
        const parentOne = solution.chromosome.slice(0, solution.iterations);

        // Second part goes to the second parent.
        const parentTwo = randomSolution.chromosome.slice(
          solution.iterations,
          counterFreeCells - solution.iterations
        );

        // Combine the parts of both parents.
        let newMember = [...parentOne, ...parentTwo];

        // Sometimes, make a mutation to create randomness/variation in solutions.
        if (Math.random() < 0.15) {
          let originalIndexObject = newMember[solution.iterations];
          let newNumber = Math.floor(Math.random() * 9) + 1;
          // insert new number, but keep the rest the same.
          newMember[solution.iterations] = {
            prior: originalIndexObject.prior,
            location: originalIndexObject.location,
            number: newNumber,
          };
        }

        nextpool.push(newMember);

        solutionCounter++;
        // All solutions has been processed but does the amount 'nextpool' satisfies the required amount in 'amountPopulation'?
        if (solutionCounter >= solutions.length) {
          solutionCounter = 0;
        }
      }

      this.members = nextpool;
    } else {
      console.log("generation extinction!");
      alert("no more possible solutions! Refresh the page to start again!");
    }
  }
}
