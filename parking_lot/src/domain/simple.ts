export interface Car {
  registration: string;
  color: string;
}

interface StatusRow {
  slot: number;
  registration: string;
  color: string;
}

export class ParkingLot {
  private slots: (Car | null)[] = [];
  private created = false;

  create(size: number): void {
    if (size <= 0 || !Number.isInteger(size)) {
      throw new Error('Invalid lot size');
    }
    this.slots = Array.from({ length: size }, () => null);
    this.created = true;
  }

  size(): number {
    return this.slots.length;
  }

  isCreated(): boolean {
    return this.created;
  }

  park(car: Car): number | null {
    const idx = this.slots.findIndex((s) => s === null);
    if (idx === -1) return null;
    this.slots[idx] = car;
    return idx + 1; // slots are 1-indexed
  }

  leave(slotNumber: number): boolean {
    if (!Number.isInteger(slotNumber)) return false;
    const idx = slotNumber - 1;
    if (idx < 0 || idx >= this.slots.length) return false;
    if (this.slots[idx] === null) return false;
    this.slots[idx] = null;
    return true;
  }

  status(): StatusRow[] {
    const rows: StatusRow[] = [];
    for (let i = 0; i < this.slots.length; i++) {
      const car = this.slots[i];
      if (car) rows.push({ slot: i + 1, registration: car.registration, color: car.color });
    }
    return rows;
  }

  registrationsByColor(color: string): string[] {
    return this.status()
      .filter((r) => r.color.toLowerCase() === color.toLowerCase())
      .map((r) => r.registration);
  }

  slotsByColor(color: string): number[] {
    return this.status()
      .filter((r) => r.color.toLowerCase() === color.toLowerCase())
      .map((r) => r.slot);
  }

  slotByRegistration(reg: string): number | null {
    const row = this.status().find((r) => r.registration === reg);
    return row ? row.slot : null;
  }
}
