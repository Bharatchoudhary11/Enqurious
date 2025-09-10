Parking Lot Automation System (TypeScript)

Overview
- Simple automated ticketing for a parking lot with sizes S/M/L.
- Issues tickets, allocates best-fit slots, computes fees on exit.
- Includes a minimal CLI and unit tests.

Architecture
- Domain: `src/domain/types.ts`
- Services: `src/services/ParkingLot.ts`, `src/services/FeeCalculator.ts`
- CLI: `src/cli.ts`
- Tests: `test/parkingLot.spec.ts` (Vitest)

Fee Policy
- Default: round up to next hour; first hour $10, then $5/hour.
- You can swap in `ConfigurableFeePolicy` for different rules.

CLI Usage
- Initialize lot: `node dist/cli.js init <S> <M> <L>`
- Park vehicle: `node dist/cli.js park <plate> <S|M|L>`
- Leave: `node dist/cli.js leave <ticketId>`
- Status: `node dist/cli.js status`
- Ticket info: `node dist/cli.js ticket <ticketId>`

Local Development
1) Install deps: `npm install`
2) Build: `npm run build`
3) Run CLI: `npm start -- <command>` (see above)
4) Tests: `npm test`

Docker
- Build image: `docker build -t parking-lot .`
- Run tests: `docker run --rm parking-lot npm test`
- Run CLI: `docker run --rm -it parking-lot node dist/cli.js help`

