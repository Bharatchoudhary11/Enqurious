import { describe, it, expect } from 'vitest';
import { ParkingLot } from '../src/domain/simple.ts';

describe('Simple ParkingLot domain edge cases', () => {
  it('leave returns false on NaN / non-integer / out-of-range', () => {
    const lot = new ParkingLot();
    lot.create(2);
    expect(lot.leave(NaN as any)).toBe(false);
    expect(lot.leave(0)).toBe(false);
    expect(lot.leave(-1 as any)).toBe(false);
    expect(lot.leave(3)).toBe(false);
  });

  it('create with invalid sizes is rejected via domain error', () => {
    const lot = new ParkingLot();
    expect(() => lot.create(0)).toThrowError();
    expect(() => lot.create(-1 as any)).toThrowError();
  });
});

