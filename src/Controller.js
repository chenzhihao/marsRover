import Plateau from './Plateau';
import Rover from './Rover';

export default class Controller {
  constructor () {
    this.roverInfos = [];
    this.plateau = null;
  }

  printRoversLocation () {
    let res = [];
    this.roverInfos.forEach(roverInfos => {
      const rover = roverInfos.rover;
      res.push(`${rover.xCoordinate} ${rover.yCoordinate} ${rover.orientation}`);
    });

    return res.join('\n');
  }

  executeInstructions (instruction) {
    const instructions = this.instructionSplitAndTrim(instruction);

    const plateauInstructions = instructions.plateauInstructions;
    this.setPlateauFromInstruction(plateauInstructions);

    instructions.roverInstructions.forEach(roverInstruction => {
      this.setRoverFromInstruction(roverInstruction);
    });


    this.roverInfos.forEach(roverInfo => {
      this.moveRoverFromInstructions(roverInfo.rover, roverInfo.moveRoverInstruction, this.canMoveStrategy);
    });
  }

  validateSetPlateauInstruction (instruction) {
    return /^\d+\s+\d+$/.test(instruction);
  }

  validateSetRoverInstruction (instruction) {
    return /^\d+\s\d+\s[ENSW]$/.test(instruction);
  }

  validateMoveRoverInstruction (instruction) {
    return /^[RLM]+$/.test(instruction);
  }

  instructionSplitAndTrim (instruction) {
    let instructionLines = instruction.trim().split('\n');
    instructionLines = instructionLines.filter(instructionLine => {
      return instructionLine.trim() !== '';
    });

    const plateauInstructions = instructionLines[0];

    const roverInstructionLines = instructionLines.slice(1);

    let roverInstructions = [];
    for (let i = 0; i < roverInstructionLines.length; i += 2) {
      roverInstructions.push(
        {
          setRoverInstruction: roverInstructionLines[i],
          moveRoverInstruction: roverInstructionLines[i + 1]
        });
    }

    return {
      plateauInstructions,
      roverInstructions,
    }
  }

  setPlateauFromInstruction (plateauInstruction) {
    if (!this.validateSetPlateauInstruction(plateauInstruction)) {
      throw Error(`Plateau instructions is not correct: "${plateauInstruction}"`);
    }
    const args = plateauInstruction.split(' ').map(i => parseInt(i));

    this.plateau = new Plateau(...args);
  }

  setRoverFromInstruction ({setRoverInstruction, moveRoverInstruction}) {
    if (!this.plateau) {
      throw Error('Plateau is not set, you can\'t set rover');
    }

    let args = setRoverInstruction.split(' ');
    args = args.slice(0, 2).map(i => parseInt(i)).concat(args[2]);

    if (this.plateau.xCoordinate < args[0] || this.plateau.yCoordinate < args[1]) {
      throw Error(`Rover can't be set out of Plateau`)
    }

    if (!this.validateSetRoverInstruction(setRoverInstruction)) {
      throw Error(`Rover set instruction is not correct: "${setRoverInstruction}"`);
    }

    if (!this.validateMoveRoverInstruction(moveRoverInstruction)) {
      throw Error(`Rover move instruction is not correct: "${moveRoverInstruction}"`);
    }

    this.roverInfos.push({rover: new Rover(...args), moveRoverInstruction})
  }

  canMoveStrategy (rover, rovers, plateau) {
    const maxXCoordinate = plateau.xCoordinate;
    const maxYCoordinate = plateau.yCoordinate;

    let xCoordinate = rover.xCoordinate;
    let yCoordinate = rover.yCoordinate;
    let orientation = rover.orientation;

    let mockRover = {xCoordinate, yCoordinate, orientation};
    rover.move.apply(mockRover);
    const afterMoveStillInPlateau = mockRover.xCoordinate <= maxXCoordinate &&
      mockRover.yCoordinate <= maxYCoordinate &&
      mockRover.xCoordinate >= 0 &&
      mockRover.yCoordinate >= 0;

    let theNextCoordinateIsAvailable = true;
    let roverIndex = rovers.indexOf(rover);
    rovers.slice(0, roverIndex).forEach(rover => {
      if (rover.xCoordinate === mockRover.xCoordinate && rover.yCoordinate === mockRover.yCoordinate) {
        theNextCoordinateIsAvailable = false;
      }
    });
    return afterMoveStillInPlateau && theNextCoordinateIsAvailable;
  }

  moveRoverFromInstructions (rover, moveRoverInstructions, canMoveStrategy) {
    for (let instruction of moveRoverInstructions) {
      this.moveRoverFromInstruction(rover, instruction, canMoveStrategy);
    }
  }

  moveRoverFromInstruction (rover, instruction, canMoveStrategy) {
    switch (instruction) {
      case 'M':
        if (canMoveStrategy) {
          if (canMoveStrategy(rover, this.roverInfos.map(roverInfo => roverInfo.rover), this.plateau)) {
            rover.move();
          }
        } else {
          rover.move();
        }
        break;
      case 'L':
        rover.turnLeft();
        break;
      case 'R':
        rover.turnRight();
        break;
      default:
        throw Error(`Unknown Rover move instruction: "${instruction}"`);
    }
  }
}