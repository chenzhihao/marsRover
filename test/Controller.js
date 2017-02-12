import test from 'ava';
import Controller from '../src/Controller';
import Plateau from '../src/Plateau';
import Rover from '../src/Rover';

test('Controller can split and trim input instructions', t => {
  const instruction = '5 5\n1 2 N\nLMLMLMLMM';

  const instruction2 = '5 5\n1 2 N\n\n\nLLL\n3 4 S\nMMMM';

  const controller = new Controller();

  t.deepEqual(controller.instructionSplitAndTrim(instruction),
    {plateauInstructions: '5 5', roverInstructions: [{setRoverInstruction: '1 2 N', moveRoverInstruction: 'LMLMLMLMM'}]});
  t.deepEqual(controller.instructionSplitAndTrim(instruction2),
    {
      plateauInstructions: '5 5',
      roverInstructions: [{setRoverInstruction: '1 2 N', moveRoverInstruction: 'LLL'}, {
        setRoverInstruction: '3 4 S',
        moveRoverInstruction: 'MMMM'
      }]
    });
});

test('Controller validate instruction', t => {
  const setPlateauInstruction = '5 5';
  const FAIL_setPlateauInstruction = 'R 5';
  const setMarsInstruction = '5 5 N';
  const FAIL_setMarsInstruction = '5 N 5';
  const moveMarsInstruction = 'LRMMRLRML';
  const FAIL_moveMarsInstruction = 'LRMMRLR3L';

  const controller = new Controller();
  t.true(controller.validateSetPlateauInstruction(setPlateauInstruction));
  t.false(controller.validateSetPlateauInstruction(FAIL_setPlateauInstruction));

  t.true(controller.validateSetRoverInstruction(setMarsInstruction));
  t.false(controller.validateSetRoverInstruction(FAIL_setMarsInstruction));

  t.true(controller.validateMoveRoverInstruction(moveMarsInstruction));
  t.false(controller.validateMoveRoverInstruction(FAIL_moveMarsInstruction));
});


test('Controller can set Plateau from instruction', t => {
  const controller = new Controller();

  controller.setPlateauFromInstruction('5 3');
  t.is(controller.plateau.xCoordinate, 5);
  t.is(controller.plateau.yCoordinate, 3);
});

test('Controller can set Plateau from instruction, Plateau coordinates must be positive', t => {
  const controller = new Controller();
  const error = t.throws(() => {
    controller.setPlateauFromInstruction('0 0');
  }, Error);
  t.is(error.message, 'Plateau coordinates must be positive');
});

test('Controller can set Plateau from instruction, Plateau coordinates must be number', t => {
  const controller = new Controller();
  const error = t.throws(() => {
    controller.setPlateauFromInstruction('L 0');
  }, Error);
  t.is(error.message, 'Plateau instructions is not correct: "L 0"');
});

test('Controller can set Rover from instruction', t => {
  const controller = new Controller();
  controller.plateau = new Plateau(5, 5);

  controller.setRoverFromInstruction({setRoverInstruction: '5 3 N', moveRoverInstruction: 'MMMLR'});
  controller.setRoverFromInstruction({setRoverInstruction: '3 5 E', moveRoverInstruction: 'MMMLR'});

  t.is(controller.roverInfos[0].rover.xCoordinate, 5);
  t.is(controller.roverInfos[0].rover.yCoordinate, 3);
  t.is(controller.roverInfos[0].rover.orientation, 'N');
  t.is(controller.roverInfos[0].moveRoverInstruction, 'MMMLR');

  t.is(controller.roverInfos[1].rover.xCoordinate, 3);
  t.is(controller.roverInfos[1].rover.yCoordinate, 5);
  t.is(controller.roverInfos[1].rover.orientation, 'E');
  t.is(controller.roverInfos[1].moveRoverInstruction, 'MMMLR');
});

test('Controller will throw error when set Rover before setting plateau', t => {
  const controller = new Controller();

  const error = t.throws(() => {
    controller.setRoverFromInstruction({setRoverInstruction: '5 5 N', moveRoverInstruction: 'MMMLR4'});
  }, Error);

  t.is(error.message, 'Plateau is not set, you can\'t set rover')
});

test('Controller will throw error when set Rover from wrong set instruction', t => {
  const controller = new Controller();
  controller.plateau = new Plateau(5, 5);

  const error = t.throws(() => {
    controller.setRoverFromInstruction({setRoverInstruction: '5 N N', moveRoverInstruction: 'MMMLR'});
  }, Error);

  t.is(error.message, 'Rover set instruction is not correct: "5 N N"')
});

test('Controller will throw error when set Rover from wrong move instruction', t => {
  const controller = new Controller();
  controller.plateau = new Plateau(5, 5);

  const error = t.throws(() => {
    controller.setRoverFromInstruction({setRoverInstruction: '5 5 N', moveRoverInstruction: 'MMMLR4'});
  }, Error);

  t.is(error.message, 'Rover move instruction is not correct: "MMMLR4"')
});

test('Controller can drive rover to move', t => {
  const controller = new Controller();
  controller.plateau = new Plateau(5, 5);

  const rover = new Rover(0, 0, 'N');
  controller.moveRoverFromInstructions(rover, 'MMRMMM');
  t.is(rover.xCoordinate, 3);
  t.is(rover.yCoordinate, 2);
});

test('Controller move strategy can\'t drive rover to move out of plateau', t => {
  const controller = new Controller();
  const plateau = new Plateau(5, 5);

  const rover = new Rover(0, 0, 'N');
  const rover2 = new Rover(0, 0, 'S');
  const rovers = [rover, rover2];

  t.true(controller.canMoveStrategy(rover, rovers, plateau));
  t.false(controller.canMoveStrategy(rover2, rovers, plateau));
});

test('Controller move strategy can\'t drive rover to move to overlap on another rover', t => {
  const controller = new Controller();
  const plateau = new Plateau(5, 5);

  const rover = new Rover(0, 1, 'N');
  const rover2 = new Rover(0, 0, 'N');
  const rover3 = new Rover(0, 3, 'N');
  const rovers = [rover, rover2, rover3];

  t.false(controller.canMoveStrategy(rover2, rovers, plateau));
  t.true(controller.canMoveStrategy(rover3, rovers, plateau));
});


test('Controller test move strategy will not actually move Rover', t => {
  const controller = new Controller();
  const plateau = new Plateau(5, 5);

  const rover = new Rover(0, 1, 'N');
  const rover2 = new Rover(0, 0, 'N');
  const rover3 = new Rover(0, 3, 'N');
  const rovers = [rover, rover2, rover3];

  t.true(controller.canMoveStrategy(rover, rovers, plateau));
  t.is(rover.xCoordinate, 0);
  t.is(rover.yCoordinate, 1);
});

test('Controller can drive roverInfos, finally output correct position', t => {
  const controller = new Controller();
  controller.executeInstructions('5 5\n1 2 N\nLMLMLMLMM');
  t.is(controller.printRoversLocation(), '1 3 N');

  const controller2 = new Controller();
  controller2.executeInstructions('5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM');
  t.is(controller2.printRoversLocation(), '1 3 N\n5 1 E');
});

