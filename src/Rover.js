const ORIENTATIONS = ['W', 'N', 'E', 'S'];

export default class Rover {
  constructor (xCoordinate, yCoordinate, orientation) {
    if (!Number.isInteger(xCoordinate) || !Number.isInteger(yCoordinate)) {
      throw new Error('Rover coordinates must be integers');
    }

    if (xCoordinate < 0 || yCoordinate < 0) {
      throw new Error('Rover coordinates must be non-negative');
    }

    if (ORIENTATIONS.indexOf(orientation) < 0) {
      throw new Error('Rover orientation must be one of "W, N, E, S"');
    }

    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.orientation = orientation;
  }

  move () {
    switch (this.orientation) {
      case 'W': {
        this.xCoordinate--;
        break;
      }
      case 'N': {
        this.yCoordinate++;
        break;
      }
      case 'E': {
        this.xCoordinate++;
        break;
      }
      case 'S': {
        this.yCoordinate--;
        break;
      }
      default:
        break;
    }
  }

  turnLeft () {
    const orientationIndex = ORIENTATIONS.indexOf(this.orientation) - 1;
    this.orientation = ORIENTATIONS[orientationIndex < 0 ? orientationIndex + 4 : orientationIndex];
  }

  turnRight () {
    const orientationIndex = ORIENTATIONS.indexOf(this.orientation) + 1;
    this.orientation = ORIENTATIONS[orientationIndex > 3 ? orientationIndex - 4 : orientationIndex];
  }
}