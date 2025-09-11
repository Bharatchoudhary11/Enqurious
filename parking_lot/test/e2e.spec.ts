import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { App } from '../src/app.ts';

describe('E2E: sample file input outputs exactly match', () => {
  it('matches expected outputs for file_inputs.txt', () => {
    const fileUrl = new URL('../file_inputs.txt', import.meta.url);
    const content = readFileSync(fileUrl, 'utf8');
    const lines = content.split(/\r?\n/).filter((l) => l.length > 0);

    const app = new App();
    const outputs: string[] = [];

    for (const line of lines) {
      const res = app.handle(line);
      if (res && res !== '__EXIT__') outputs.push(res);
    }

    expect(outputs).toEqual([
      'Created a parking lot with 6 slots',
      'Allocated slot number: 1',
      'Allocated slot number: 2',
      'Allocated slot number: 3',
      'Allocated slot number: 4',
      'Allocated slot number: 5',
      'Allocated slot number: 6',
      'Slot number 4 is free',
      'Slot No. Registration No Colour\n1 KA-01-HH-1234 White\n2 KA-01-HH-9999 White\n3 KA-01-BB-0001 Black\n5 KA-01-HH-2701 Blue\n6 KA-01-HH-3141 Black',
      'KA-01-HH-1234, KA-01-HH-9999',
      '1, 2',
      '6',
      'Not found',
    ]);
  });
});

