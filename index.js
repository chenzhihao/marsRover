import Controller from './src/Controller';
import fs from 'fs';

const controller = new Controller();
fs.readFile('./input.txt', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  const input = data.toString();
  try {
    controller.executeInstructions(input);
    process.stdout.write('Input:\n' + input + '\n');
    process.stdout.write('Output:\n' + controller.printRoversLocation() + '\n');
  } catch (err) {
    process.stdout.write(err + '\n');
  }
});
