import { describe, it, expect } from 'vitest';
import { App } from '../src/app.ts';

describe('App CLI edge cases', () => {
  it('handles invalid create_parking_lot without crashing', () => {
    const app = new App();
    expect(app.handle('create_parking_lot')).toBe('Invalid command');
    expect(app.handle('create_parking_lot foo')).toBe('Invalid command');
    expect(app.handle('create_parking_lot 0')).toBe('Required a positive number of slots');
    expect(app.handle('create_parking_lot -3')).toBe('Invalid command');
  });

  it('requires creation before other commands', () => {
    const app = new App();
    expect(app.handle('park ABC White')).toBe('Please create a parking lot first');
    expect(app.handle('leave 1')).toBe('Please create a parking lot first');
    expect(app.handle('status')).toBe('Please create a parking lot first');
  });

  it('handles invalid leave arguments and does not free slots', () => {
    const app = new App();
    expect(app.handle('create_parking_lot 2')).toBe('Created a parking lot with 2 slots');
    expect(app.handle('park KA-01 White')).toBe('Allocated slot number: 1');

    // invalid leave inputs
    expect(app.handle('leave')).toBe('Invalid slot number');
    expect(app.handle('leave foo')).toBe('Invalid slot number');
    expect(app.handle('leave 0')).toBe('Invalid slot number');
    expect(app.handle('leave -1')).toBe('Invalid slot number');

    // status should still show the parked car at slot 1
    const out = app.handle('status');
    expect(out).toBe(
      [
        'Slot No. Registration No Colour',
        '1 KA-01 White',
      ].join('\n')
    );
  });
});

describe('App CLI e2e small flow', () => {
  it('runs a simple flow and matches outputs', () => {
    const app = new App();
    const outputs: string[] = [];
    const run = (cmd: string) => {
      const res = app.handle(cmd);
      if (res && res !== '__EXIT__') outputs.push(res);
    };

    run('create_parking_lot 2');
    run('park KA-01-HH-1234 White');
    run('park KA-01-HH-9999 Black');
    run('park KA-01-HH-7777 Red'); // should be full
    run('status');
    run('registration_numbers_for_cars_with_colour White');
    run('slot_number_for_registration_number MH-04-AY-1111');
    run('leave 2');
    run('slot_number_for_registration_number KA-01-HH-9999');

    expect(outputs).toEqual([
      'Created a parking lot with 2 slots',
      'Allocated slot number: 1',
      'Allocated slot number: 2',
      'Sorry, parking lot is full',
      'Slot No. Registration No Colour\n1 KA-01-HH-1234 White\n2 KA-01-HH-9999 Black',
      'KA-01-HH-1234',
      'Not found',
      'Slot number 2 is free',
      'Not found',
    ]);
  });
});

