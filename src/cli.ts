#!/usr/bin/env node
import { DefaultFeePolicy } from './services/FeeCalculator.js';
import { ParkingLot } from './services/ParkingLot.js';
import { Vehicle } from './domain/types.js';

function parseArgs(argv: string[]): { cmd: string; args: string[] } {
  const [, , cmd = 'help', ...args] = argv;
  return { cmd, args };
}

function printHelp() {
  console.log(`Parking Lot Automation CLI\n\nCommands:\n  init <S> <M> <L>            Initialize lot with counts per size\n  park <plate> <S|M|L>        Park a vehicle\n  leave <ticketId>            Leave and compute fee\n  status                      Show slot occupancy\n  ticket <ticketId>           Show ticket details\n  help                        Show help`);
}

let lot: ParkingLot | undefined;

async function main() {
  const { cmd, args } = parseArgs(process.argv);

  try {
    switch (cmd) {
      case 'init': {
        const [s, m, l] = args.map((a) => parseInt(a, 10) || 0);
        const total = s + m + l;
        if (total === 0) throw new Error('Provide at least one slot');
        lot = new ParkingLot({
          name: 'Lot',
          slots: [
            { size: 'S', count: s },
            { size: 'M', count: m },
            { size: 'L', count: l },
          ],
          feePolicy: new DefaultFeePolicy(),
        });
        console.log(`Initialized lot with capacity=${lot.capacity()}`);
        break;
      }
      case 'park': {
        ensureLot();
        const [plate, size = 'M'] = args;
        if (!plate) throw new Error('Usage: park <plate> <S|M|L>');
        const vehicle: Vehicle = { plate, size: size as any };
        const t = lot!.park(vehicle);
        console.log(`Parked: ticketId=${t.id} slot=${t.slotId}`);
        break;
      }
      case 'leave': {
        ensureLot();
        const [ticketId] = args;
        if (!ticketId) throw new Error('Usage: leave <ticketId>');
        const { fee } = lot!.leave(ticketId);
        console.log(`Left: ticketId=${ticketId} fee=${fee}`);
        break;
      }
      case 'status': {
        ensureLot();
        const slots = lot!.getSlots();
        console.log(`Capacity=${lot!.capacity()} Available=${lot!.available()}`);
        for (const s of slots) {
          console.log(`Slot#${s.id} [${s.size}] ${s.occupied ? `occupied(${s.plate})` : 'free'}`);
        }
        break;
      }
      case 'ticket': {
        ensureLot();
        const [id] = args;
        if (!id) throw new Error('Usage: ticket <ticketId>');
        const t = lot!.findTicket(id);
        if (!t) throw new Error('Ticket not found');
        console.log(JSON.stringify(t, null, 2));
        break;
      }
      case 'help':
      default:
        printHelp();
    }
  } catch (err: any) {
    console.error('Error:', err.message || String(err));
    process.exitCode = 1;
  }
}

function ensureLot() {
  if (!lot) throw new Error('Initialize the lot first with: init <S> <M> <L>');
}

main();

