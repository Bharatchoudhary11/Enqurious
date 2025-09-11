import { ParkingLot, Car } from './domain/simple.js';

export class App {
  private lot = new ParkingLot();

  handle(line: string): string | null {
    const parts = line.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return null;
    const cmd = parts[0];

    switch (cmd) {
      case 'create_parking_lot': {
        const nRaw = parts[1];
        if (nRaw === undefined) return 'Invalid command';
        const n = Number(nRaw);
        if (!Number.isInteger(n)) return 'Invalid command';
        if (n === 0) return 'Required a positive number of slots';
        if (n < 0) return 'Invalid command';
        this.lot.create(n);
        return `Created a parking lot with ${n} slots`;
      }
      case 'park': {
        if (!this.lot.isCreated()) return 'Please create a parking lot first';
        const [registration, color] = [parts[1], parts[2]];
        if (!registration || !color) return 'Invalid command';
        const slot = this.lot.park({ registration, color } as Car);
        return slot ? `Allocated slot number: ${slot}` : 'Sorry, parking lot is full';
      }
      case 'leave': {
        if (!this.lot.isCreated()) return 'Please create a parking lot first';
        const slotRaw = parts[1];
        const slot = Number(slotRaw);
        if (!Number.isInteger(slot) || slot <= 0) return 'Invalid slot number';
        if (this.lot.leave(slot)) return `Slot number ${slot} is free`;
        return 'Invalid slot number';
      }
      case 'status': {
        if (!this.lot.isCreated()) return 'Please create a parking lot first';
        const rows = this.lot.status();
        const header = 'Slot No. Registration No Colour';
        const body = rows.map((r) => `${r.slot} ${r.registration} ${r.color}`).join('\n');
        return body ? `${header}\n${body}` : header;
      }
      case 'registration_numbers_for_cars_with_colour': {
        if (!this.lot.isCreated()) return 'Please create a parking lot first';
        const color = parts[1];
        const regs = this.lot.registrationsByColor(color);
        return regs.length ? regs.join(', ') : '';
      }
      case 'slot_numbers_for_cars_with_colour': {
        if (!this.lot.isCreated()) return 'Please create a parking lot first';
        const color = parts[1];
        const slots = this.lot.slotsByColor(color);
        return slots.length ? slots.join(', ') : '';
      }
      case 'slot_number_for_registration_number': {
        if (!this.lot.isCreated()) return 'Please create a parking lot first';
        const reg = parts[1];
        const slot = this.lot.slotByRegistration(reg);
        return slot ? String(slot) : 'Not found';
      }
      case 'exit':
      case 'quit':
        return '__EXIT__';
      default:
        return 'Invalid command';
    }
  }
}
