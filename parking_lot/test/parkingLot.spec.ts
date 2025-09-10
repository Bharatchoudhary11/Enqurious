import { describe, it, expect } from 'vitest';
import { ParkingLot } from '../src/services/ParkingLot.ts';
import { DefaultFeePolicy } from '../src/services/FeeCalculator.ts';

describe('ParkingLot', () => {
  const newLot = (s = 2, m = 2, l = 2) =>
    new ParkingLot({
      name: 'TestLot',
      slots: [
        { size: 'S', count: s },
        { size: 'M', count: m },
        { size: 'L', count: l },
      ],
      feePolicy: new DefaultFeePolicy(),
    });

  it('initializes with correct capacity and availability', () => {
    const lot = newLot(1, 2, 3);
    expect(lot.capacity()).toBe(6);
    expect(lot.available()).toBe(6);
  });

  it('allocates the smallest sufficient free slot (best-fit) and by lowest id', () => {
    const lot = newLot(2, 2, 1);

    // Expect S slots first: ids 1..2, then M: 3..4, then L: 5
    const t1 = lot.park({ plate: 'S-1', size: 'S' });
    const t2 = lot.park({ plate: 'S-2', size: 'S' });
    const t3 = lot.park({ plate: 'M-1', size: 'M' });
    const t4 = lot.park({ plate: 'M-2', size: 'M' });
    const t5 = lot.park({ plate: 'L-1', size: 'L' });

    expect([t1.slotId, t2.slotId, t3.slotId, t4.slotId, t5.slotId]).toEqual([1, 2, 3, 4, 5]);
    expect(lot.available()).toBe(0);
  });

  it('falls back to larger slots when needed', () => {
    const lot = newLot(1, 1, 0); // S:1 (id 1), M:1 (id 2)
    lot.park({ plate: 'S-1', size: 'S' }); // occupy S slot id 1
    const tM = lot.park({ plate: 'S-2', size: 'S' }); // should use M slot id 2
    expect(tM.slotId).toBe(2);
  });

  it('computes fee on leave and frees slot', () => {
    const lot = newLot(1, 0, 0);
    const entry = new Date('2024-01-01T10:00:00Z');
    const exit = new Date('2024-01-01T12:15:00Z'); // rounds up to 3 hours with default policy
    const t = lot.park({ plate: 'P-1', size: 'S' }, entry);
    expect(lot.available()).toBe(0);

    const { fee } = lot.leave(t.id, exit);
    expect(fee).toBe(10 + (3 - 1) * 5); // 20
    expect(lot.available()).toBe(1);
  });
});

describe('DefaultFeePolicy', () => {
  it('rounds up to next hour with base pricing', () => {
    const policy = new DefaultFeePolicy();
    const e = new Date('2024-01-01T10:00:00Z');
    expect(policy.calculate(e, new Date('2024-01-01T10:00:01Z'))).toBe(10); // within first hour
    expect(policy.calculate(e, new Date('2024-01-01T11:00:00Z'))).toBe(10); // exactly 1h
    expect(policy.calculate(e, new Date('2024-01-01T11:00:01Z'))).toBe(15); // 2h rounded
  });
});

