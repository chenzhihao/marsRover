import test from 'ava';
import Plateau from '../src/Plateau';

test('Plateau can be build up', t => {
  const plateau = new Plateau(10, 10);
  t.is(plateau.xCoordinate, 10);
  t.is(plateau.yCoordinate, 10);
});

test('Plateau coordinates must be integer', t => {
  const error = t.throws(function () {
    new Plateau(10.1, 10.2);
  }, Error);
  t.is(error.message, 'Plateau coordinates must be integers');
});

test('Plateau coordinates must be integer', t => {
  const error = t.throws(function () {
    new Plateau(0, 0);
  }, Error);
  t.is(error.message, 'Plateau coordinates must be positive');
});