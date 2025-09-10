export type VehicleSize = 'S' | 'M' | 'L';

export interface Vehicle {
  plate: string;
  size: VehicleSize;
}

export interface Slot {
  id: number;
  size: VehicleSize;
  occupied: boolean;
  plate?: string;
}

export interface Ticket {
  id: string;
  plate: string;
  slotId: number;
  entryTime: Date;
  exitTime?: Date;
  paid?: number;
}

export interface FeePolicy {
  name: string;
  calculate(entry: Date, exit: Date): number;
}

