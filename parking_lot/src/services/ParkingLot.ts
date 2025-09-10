import { FeePolicy, Slot, Ticket, Vehicle, VehicleSize } from '../domain/types.js';

const sizeOrder: Record<VehicleSize, number> = { S: 1, M: 2, L: 3 };

export class ParkingLot {
  readonly name: string;
  private slots: Slot[];
  private tickets = new Map<string, Ticket>();
  private feePolicy: FeePolicy;
  private ticketSeq = 0;

  constructor(opts: { name?: string; slots: { size: VehicleSize; count: number }[]; feePolicy: FeePolicy }) {
    this.name = opts.name ?? 'MainLot';
    this.feePolicy = opts.feePolicy;
    let id = 1;
    this.slots = opts.slots.flatMap(({ size, count }) =>
      Array.from({ length: count }, () => ({ id: id++, size, occupied: false }))
    );
  }

  capacity(): number {
    return this.slots.length;
  }

  available(): number {
    return this.slots.filter((s) => !s.occupied).length;
  }

  getSlots(): ReadonlyArray<Slot> {
    return this.slots.slice();
  }

  findTicket(id: string): Ticket | undefined {
    return this.tickets.get(id);
  }

  park(vehicle: Vehicle, at: Date = new Date()): Ticket {
    const slot = this.allocateSlotFor(vehicle);
    if (!slot) throw new Error('Parking lot full for this vehicle size');
    slot.occupied = true;
    slot.plate = vehicle.plate;
    const ticket: Ticket = {
      id: this.nextTicketId(),
      plate: vehicle.plate,
      slotId: slot.id,
      entryTime: new Date(at),
    };
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  leave(ticketId: string, at: Date = new Date()): { ticket: Ticket; fee: number } {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error('Invalid ticket');
    if (ticket.exitTime) throw new Error('Ticket already processed');
    const slot = this.slots.find((s) => s.id === ticket.slotId);
    if (!slot) throw new Error('Internal error: slot not found');

    ticket.exitTime = new Date(at);
    const fee = this.feePolicy.calculate(ticket.entryTime, ticket.exitTime);
    ticket.paid = fee;

    // free slot
    slot.occupied = false;
    delete slot.plate;

    return { ticket, fee };
  }

  private allocateSlotFor(vehicle: Vehicle): Slot | undefined {
    // allocate the smallest sufficient free slot (best-fit)
    const needed = sizeOrder[vehicle.size];
    const candidates = this.slots
      .filter((s) => !s.occupied && sizeOrder[s.size] >= needed)
      .sort((a, b) => sizeOrder[a.size] - sizeOrder[b.size] || a.id - b.id);
    return candidates[0];
  }

  private nextTicketId(): string {
    this.ticketSeq += 1;
    return `${this.name}-${String(this.ticketSeq).padStart(6, '0')}`;
  }
}

