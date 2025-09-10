import { describe, it, expect } from 'vitest';
import { ParkingLot } from '../src/services/ParkingLot.js';
import { DefaultFeePolicy } from '../src/services/FeeCalculator.js';

describe('ParkingLot', () => {
  const makeLot = () =>
    new ParkingLot({
      name: 'Test',
      slots: [
        { size: 'S', count: 1 },
        { size: 'M', count: 1 },
        { size: 'L', count: 1 },
      ],
      feePolicy: new DefaultFeePolicy(),
    });

  it('parks with best-fit slot', () => {
    const lot = makeLot();
    const t1 = lot.park({ plate: 'ABC-1', size: 'S' });
    expect(t1.slotId).toBe(1);
    const t2 = lot.park({ plate: 'DEF-2', size: 'M' });
    expect(t2.slotId).toBe(2);
    const t3 = lot.park({ plate: 'GHI-3', size: 'L' });
    expect(t3.slotId).toBe(3);
    expect(() => lot.park({ plate: 'JKL-4', size: 'S' })).toThrow();
  });

  it('charges default fee by hours (rounded up)', () => {
    const lot = makeLot();
    const entry = new Date('2024-01-01T10:00:00Z');
    const t = lot.park({ plate: 'ABC', size: 'M' }, entry);
    const exit1 = new Date('2024-01-01T10:30:00Z');
    const { fee: fee1 } = lot.leave(t.id, exit1);
    expect(fee1).toBe(10); // first hour flat
  });

  it('increments fee for additional hours', () => {
    const lot = makeLot();
    const entry = new Date('2024-01-01T10:00:00Z');
    const t = lot.park({ plate: 'XYZ', size: 'L' }, entry);
    const exit = new Date('2024-01-01T12:05:00Z');
    const { fee } = lot.leave(t.id, exit);
    // 3 hours rounded up -> 10 + 2*5 = 20
    expect(fee).toBe(20);
  });

  it('prevents double leave', () => {
    const lot = makeLot();
    const t = lot.park({ plate: 'ONE', size: 'M' });
    lot.leave(t.id, new Date(Date.now() + 3600_000));
    expect(() => lot.leave(t.id)).toThrow();
  });
});

