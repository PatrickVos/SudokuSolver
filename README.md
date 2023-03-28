# About the SudokuSolver

This sudoku solver is an application that tries to solve the sudoku.
The algorithm used is a genetic algorithm. In fact it is the same algorithm as used in my previous project "the Knapsack Problem".
But this algorithm is slightly changed, in order to create appropriate solutions for the sudoku.


# How it's build up

First of all, you start with a field with predefined values in the sudoku (as a starting point). 
![unset Sudoku](https://user-images.githubusercontent.com/8873367/228329509-a526ab26-ddf5-4226-98b9-55145faaa95e.png)

These values can be mofified to you own needs (as long as you create a valid sudoku).
When you are sure about the values, you can confirm the values with the "Done" button (otherwise you'll need to refresh the page and start over):
![done button](https://user-images.githubusercontent.com/8873367/228330353-b6b8cf9c-83e4-44c7-8844-c478fc90e7f0.png)

Only when the "Done" button is pressed, the start button will be enabled:
![start button](https://user-images.githubusercontent.com/8873367/228330114-00ab3e93-e00e-497e-b30d-945befa027f0.png)

By pressing this button, you let the computer start playing the game! ...But wait, there is more!
With values besides the "Start" button you can see what values the computer will try to use. Highlighted in yellow:
![highlighted values](https://user-images.githubusercontent.com/8873367/228330783-b92b3a43-83b0-45d6-975f-7424bb4b10db.png)

Above the "Start" button, you see a slider where you can adjust the speed of the computer. By default the value is set to "990".
What means is the computer will pause (read "think") for 990 milliseconds between every move.
![slider option](https://user-images.githubusercontent.com/8873367/228331089-ec823ae2-9cbd-4bf4-b7d1-253cf990db6e.png)

After the computer played the game, the minimum score and the maximum score will be set or updated. The generation counter will show how
many generations have passed. This will start to increment each time the "start" button is pressed:
![log info](https://user-images.githubusercontent.com/8873367/228332484-67c5831b-d279-4085-82bc-c4c32a26d805.png)


# Technical details

The genetic algorithm will try 100 different randomly created sequences of numbers (including their place). 
You could referred to these sequences as "chromosomes" (like in DNA).
To keep track of these sequences, a (fitness) score is saved after each run. For each of them, individually.
So when there is an evaluation, only the sequences that meet the required minimum score will be used later on.
Each evaluation this minimum score will be incremented, so there is progress. The reason why the minimum score of all possible candates (for the 
next generation) will be used as the minimum score for the next evaluation, is because of the generation of diversity. 
This will play a major role later on in the game. After all, the sequences know nothing about the right direction. So they can easily go the wrong direction.
For regeneration, all the sequences that do meet the requirement (of a minimum score) will be split and combined with other candidates for 
the next generation. The recombination happens at the piece of the sequence where it fails to progress. 
This first part will be combined with an other randomly picked sequence. Starting at the point where it left off in the first sequence.
With a randomly modification (read mutation) of 15%, the new sequence will be assured to become a more distinct one.
Eventually, this new recombined sequence will be a part of a new group of 100 new candidates for teh next generation.
