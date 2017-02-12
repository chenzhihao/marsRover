export default class Plateau {
  constructor (xCoordinate, yCoordinate) {
    if (!Number.isInteger(xCoordinate) || !Number.isInteger(yCoordinate)) {
      throw new Error('Plateau coordinates must be integers');
    }

    if (xCoordinate <= 0 || yCoordinate <= 0) {
      throw new Error('Plateau coordinates must be positive');
    }

    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }
}