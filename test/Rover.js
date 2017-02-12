import test from 'ava';
import Rover from '../src/Rover';

test('Rover can be build up', t => {
  const plateau = new Rover(10, 10, 'E');
  t.is(plateau.xCoordinate, 10);
  t.is(plateau.yCoordinate, 10);
  t.is(plateau.orientation, 'E');
});

test('Rover coordinates must be integer', t => {
  const error = t.throws(function () {
    new Rover(10.1, 10.2, 'E');
  }, Error);
  t.is(error.message, 'Rover coordinates must be integers')
});

test('Rover coordinates must be non-negative', t => {
  const error = t.throws(function () {
    new Rover(-1, 0, 'E');
  }, Error);
  t.is(error.message, 'Rover coordinates must be non-negative')
});

test('Rover orientation must be one of "W, N, E, S"', t => {
  const error = t.throws(function () {
    new Rover(0, 0, 'abc');
  }, Error, 'Rover orientation must be one of "W, N, E, S"');
  t.is(error.message, 'Rover orientation must be one of "W, N, E, S"')
});


test('Rover can move forward its orientation', t => {
  const RoverN = new Rover(10, 10, 'N');
  RoverN.move();
  t.is(RoverN.xCoordinate, 10);
  t.is(RoverN.yCoordinate, 11);
  t.is(RoverN.orientation, 'N');

  const RoverE = new Rover(10, 10, 'E');
  RoverE.move();
  t.is(RoverE.xCoordinate, 11);
  t.is(RoverE.yCoordinate, 10);
  t.is(RoverE.orientation, 'E');


  const RoverW = new Rover(10, 10, 'W');
  RoverW.move();
  t.is(RoverW.xCoordinate, 9);
  t.is(RoverW.yCoordinate, 10);
  t.is(RoverW.orientation, 'W');

  const RoverS = new Rover(10, 10, 'S');
  RoverS.move();
  t.is(RoverS.xCoordinate, 10);
  t.is(RoverS.yCoordinate, 9);
  t.is(RoverS.orientation, 'S');
});

test('Rover can turn left and turn right its orientation', t => {
  const RoverN = new Rover(10, 10, 'N');
  RoverN.turnRight();
  t.is(RoverN.orientation, 'E');
  RoverN.turnRight();
  t.is(RoverN.orientation, 'S');
  RoverN.turnRight();
  t.is(RoverN.orientation, 'W');
  RoverN.turnRight();
  t.is(RoverN.orientation, 'N');

  const RoverE = new Rover(10, 10, 'E');
  RoverE.turnLeft();
  t.is(RoverE.orientation, 'N');
  RoverE.turnLeft();
  t.is(RoverE.orientation, 'W');
  RoverE.turnLeft();
  t.is(RoverE.orientation, 'S');
  RoverE.turnLeft();
  t.is(RoverE.orientation, 'E');
});
