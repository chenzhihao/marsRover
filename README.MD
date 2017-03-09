# Mars Rover Code Kata

```
INTRODUCTION TO THE PROBLEM
There must be a way to supply the application with the input data via a text file or textarea. The application must run. You should provide sufficient evidence that your solution is complete by, as a minimum, indicating that it works correctly against the supplied test data. Please note that you will be assessed on your judgment as well as your execution.
MARS ROVERS
A squad of robotic rovers are to be landed by NASA on a plateau on Mars. This plateau, which is curiously rectangular, must be navigated by the rovers so that their on-board cameras can get a complete view of the surrounding terrain to send back to Earth.
A rover's position and location is represented by a combination of x and y co-ordinates and a letter representing one of the four cardinal compass points. The plateau is divided up into a grid to simplify navigation. An example position might be 0, 0, N, which means the rover is in the bottom left corner and facing North.
In order to control a rover, NASA sends a simple string of letters. The possible letters are 'L', 'R' and 'M'. 'L' and 'R' makes the rover spin 90 degrees left or right respectively, without moving from its current spot. 'M' means move forward one grid point, and maintain the same heading.
Assume that the square directly North from (x, y) is (x, y+1).
INPUT:
The first line of input is the upper-right coordinates of the plateau, the lower-left coordinates are assumed to be 0,0.
The rest of the input is information pertaining to the rovers that have been deployed. Each rover has two lines of input. The first line gives the rover's position, and the second line is a series of instructions telling the rover how to explore the plateau.
The position is made up of two integers and a letter separated by spaces, corresponding to the x and y co-ordinates and the rover's orientation.
Each rover will be finished sequentially, which means that the second rover won't start to move until the first one has finished moving.OUTPUT
The output for each rover should be its final co-ordinates and heading.
INPUT AND OUTPUT
Test Input:
55
12 N LMLMLMLMM 33 E MMRMMRMRRM
Expected Output: 13 N
51 E ==========
```

## How to execute code:
Let us install all the dependency firstly:
```shell
 yarn install
 # Or
 npm install
```
As we use ES6, we need to transpile our code to ES5 which is can be run in node,
there is a prestart hook as ```NODE_ENV=production webpack --config ./webpack.config.js```.

So we can directly execute our code as:
```shell
 npm start
```
The input is located at ```./input.text```
, and the result will be output to the screen. 

## How to do unit test:
I used [AVA](https://github.com/avajs/ava) for unit test, we can run all the unit test like:
```
npm run test
```

## Assumptions and Design

#### Assumptions:
 - The rover should always be on the Plateau, which means all the rover can't moved out of Plateau.
    For example we have the Plateau as (5, 5). One Rover is at (3, 3, N) and its instructions is 'MMMMMRMM'.
    After it executed the second instruction, it will be at (3, 5, N) and the left instruction is 'MMMRMM'.
    Now it can't move forward N anymore. So the following "M" before "R" will be skipped, 
    the rest available instruction will be 'RMM'. So its finally locations will be (5, 5, E).
 
 - The rover can't be moved to overlap on previous rovers, which means when we have two rovers [(0, 1, N), (0, 0, N)],
  we can't move the second rover, because there is already one rover at (0, 1) already.
   This instruction will be skipped like before.  

Basically I used OO design for 3 classes:

- Plateau - Used to limit how far away the rovers can move to. It has no idea of rovers.

- Rover - Rover can turn left, turn right and move forward one step. One rover has no idea of other rover nor plateau. 

- Controller - It's used to
    - connect Plateau and Rovers
    
    - format, trim, validate, parse input instructions
    
    - Check if a rover move instruction can be executed, which means a rover can't move out of plateau, nor move to overlap
    on another rover. Controller will skip these wrong instructions, however it will still do the rest commands
    
    - Print the information of Rovers  

### Error handle:
When there is input error(the coordinate is negative or decimal, and etc) or logic error(rover was deployed out plateau, and etc.)
The code will throw error.

## I also build a GUI on top of it: https://github.com/chenzhihao/marsRoverGUI
