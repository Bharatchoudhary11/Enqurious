import assert from 'node:assert';
import { App } from '../src/app.js';

const run = (lines: string[]): string[] => {
  const app = new App();
  const out: string[] = [];
  for (const line of lines) {
    const r = app.handle(line);
    if (r && r !== '__EXIT__') out.push(r);
  }
  return out;
};

// Basic flow tests covering required commands
{
  const outputs = run([
    'create_parking_lot 6',
    'park KA-01-HH-1234 White',
    'park KA-01-HH-9999 White',
    'park KA-01-BB-0001 Black',
    'park KA-01-HH-7777 Red',
    'park KA-01-HH-2701 Blue',
    'park KA-01-HH-3141 Black',
    'status'
  ]);

  assert.strictEqual(outputs[0], 'Created a parking lot with 6 slots');
  assert.strictEqual(outputs[1], 'Allocated slot number: 1');
  assert.strictEqual(outputs[2], 'Allocated slot number: 2');
  assert.strictEqual(outputs[3], 'Allocated slot number: 3');
  assert.strictEqual(outputs[4], 'Allocated slot number: 4');
  assert.strictEqual(outputs[5], 'Allocated slot number: 5');
  assert.strictEqual(outputs[6], 'Allocated slot number: 6');
  assert.ok(outputs[7].startsWith('Slot No. Registration No Colour'));
}

// Freeing slot and queries
{
  const outputs = run([
    'create_parking_lot 6',
    'park KA-01-HH-1234 White',
    'park KA-01-HH-9999 White',
    'park KA-01-BB-0001 Black',
    'park KA-01-HH-7777 Red',
    'park KA-01-HH-2701 Blue',
    'park KA-01-HH-3141 Black',
    'leave 4',
    'status',
    'registration_numbers_for_cars_with_colour White',
    'slot_numbers_for_cars_with_colour White',
    'slot_number_for_registration_number KA-01-HH-3141',
    'slot_number_for_registration_number MH-04-AY-1111'
  ]);

  assert.strictEqual(outputs[7], 'Slot number 4 is free');

  const status = outputs[8].split('\n');
  // header + 5 lines (slot 4 removed)
  assert.strictEqual(status.length, 6);

  assert.strictEqual(outputs[9], 'KA-01-HH-1234, KA-01-HH-9999');
  assert.strictEqual(outputs[10], '1, 2');
  assert.strictEqual(outputs[11], '6');
  assert.strictEqual(outputs[12], 'Not found');
}

